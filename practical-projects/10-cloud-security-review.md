# Project 10 — Cloud Security Review of Misconfigured Infrastructure as Code

Cloud misconfigurations are rarely dramatic. A public bucket, a wildcard IAM policy, and an SSH port open to the world look like convenience until someone finds them. In this project you build a deliberately weak Terraform configuration, scan it, deploy the safe subset to local cloud emulation, prove the exposure, then remediate the code and verify the fix — without spending money or creating a real public bucket.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Estimated time | 6–9 hours |
| Cost | $0 with LocalStack; optional real-account path stays inside free tier with a hard budget |
| Prerequisites | Project 01; comfort with a terminal; basic Terraform and AWS vocabulary helps but is not required |
| Safety and scope | Local emulation only for the public-bucket test; never deploy an intentionally public bucket to a real cloud account |

`Last reviewed: 2026-10-31`

> **Safety and scope.** The configuration in this project is deliberately insecure, including a public-read bucket and an IAM policy with `Action: "*"` on `Resource: "*"`. Deploy it only to LocalStack on your isolated lab VM. The optional real-account path uses read-only scanning with Prowler and a one-dollar budget; it never deploys the misconfigured resources. If you use a real account, use a dedicated sandbox account, not one that holds data or billing relationships you care about.

## Objective

- Write and explain a small Terraform configuration with realistic cloud misconfigurations.
- Scan the code statically with Trivy and record findings before deployment.
- Deploy the storage and identity subset to LocalStack and verify the weak settings through the API.
- Demonstrate anonymous read access to a test object in the emulator.
- Map findings to recognized cloud controls and assess business impact.
- Remediate the code, re-scan, redeploy, and verify that each exposure is closed.
- Tear everything down and document a zero-cost result.

## Why this project matters

Infrastructure as code is how cloud environments are actually built, which makes it the best place to catch mistakes before they exist. A reviewer who can read a Terraform plan and say "this bucket will be public, this role can do anything, and this security group exposes SSH to the internet" prevents incidents that a runtime scanner would only discover after exposure. The same skills apply to Kubernetes manifests, container images, and CI pipelines.

The emulator matters too. It lets you test the behavior of a public ACL and a public access block without creating a real exposure window. Cost control is part of the lesson: a cloud lab that quietly bills you every month is a failed lab.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Terraform | Declarative infrastructure and plan review | <https://developer.hashicorp.com/terraform> | Free, open source |
| LocalStack | Local AWS emulation for S3, IAM, STS | <https://www.localstack.cloud/> | Free Community edition; no account required |
| AWS CLI v2 | Interacting with the emulator and optional sandbox | <https://aws.amazon.com/cli/> | Free |
| Trivy | Static misconfiguration scanning for IaC | <https://github.com/aquasecurity/trivy> | Free, open source |
| Prowler | Read-only cloud posture assessment (optional real account) | <https://github.com/prowler-cloud/prowler> | Free, open source |
| CloudGoat | Intentionally vulnerable AWS scenarios (optional, paid risk) | <https://github.com/RhinoSecurityLabs/cloudgoat> | Free tool; it creates real AWS resources that can cost money |
| CIS Benchmarks | Control mapping for cloud findings | <https://www.cisecurity.org/cis-benchmarks> | Free registration for some benchmarks |

## Setup

### Prepare the lab VM

1. Create `lab-cloud` with 2 vCPUs, 4 GB RAM, and a 25 GB disk on the host-only network at `192.168.56.70`. Install Ubuntu Server 24.04, Docker, Terraform, and the AWS CLI v2 using their official instructions.
2. Start LocalStack and confirm its health endpoint:

```bash
docker run -d --name localstack -p 4566:4566 \
  -e SERVICES=s3,iam,sts \
  -v localstack-data:/var/lib/localstack \
  localstack/localstack:latest
curl -s http://localhost:4566/_localstack/health | jq .
```

3. Export dummy credentials. These are not secrets; LocalStack accepts any value. Never use real access keys in a lab file.

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
```

4. Confirm the CLI reaches the emulator:

```bash
aws --endpoint-url=http://localhost:4566 sts get-caller-identity
aws --endpoint-url=http://localhost:4566 s3api list-buckets
```

### Write the deliberately weak configuration

Create `main.tf` in `~/cloud-review/before/`:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3  = "http://localhost:4566"
    iam = "http://localhost:4566"
    sts = "http://localhost:4566"
  }
}

resource "aws_s3_bucket" "public" {
  bucket = "lab-public-data"
}

resource "aws_s3_bucket_ownership_controls" "public" {
  bucket = aws_s3_bucket.public.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "public" {
  depends_on = [aws_s3_bucket_ownership_controls.public]
  bucket     = aws_s3_bucket.public.id
  acl        = "public-read"
}

resource "aws_iam_policy" "ci_deployer" {
  name = "lab-ci-deployer"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}

resource "aws_security_group" "admin" {
  name        = "lab-admin"
  description = "Deliberately weak for the lab"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

The ownership controls are there because modern S3 buckets default to bucket-owner-enforced ownership, which disables ACLs. Without them, the public ACL fails to apply, and the lab would not demonstrate the misconfiguration.

5. Initialize and validate the configuration. Read the plan, because the plan is the review artifact:

```bash
cd ~/cloud-review/before
terraform init
terraform validate
terraform plan -out=plan.out
terraform show plan.out | tee plan-before.txt
```

## Step-by-step tasks

1. **Define the scope and threat model.** Write a short document: what data the bucket is meant to hold, who should read it, what the IAM policy is for, and what the security group protects. For each resource, state the confidentiality, integrity, and availability consequence of misuse. Checkpoint: a one-page model that a non-cloud reader can follow, with an explicit statement that the bucket is not intended to be public.

2. **Scan the code before deploying anything.** Trivy evaluates the Terraform source without contacting a cloud API.

```bash
cd ~/cloud-review/before
trivy config --severity HIGH,CRITICAL --format table . | tee ../trivy-before.txt
trivy config --format json -o ../trivy-before.json .
trivy config --format table . | tail -n 20
```

Checkpoint: findings for public access, missing encryption, missing versioning, wildcard IAM, and an internet-open security group. Record the rule IDs, because you will compare them after remediation.

3. **Deploy only what the emulator supports.** LocalStack Community coverage varies by service and version, so apply the storage and identity resources with targets and leave the security group for static analysis.

```bash
terraform apply -auto-approve \
  -target=aws_s3_bucket.public \
  -target=aws_s3_bucket_ownership_controls.public \
  -target=aws_s3_bucket_acl.public \
  -target=aws_iam_policy.ci_deployer
terraform state list
```

Checkpoint: the bucket and policy exist in LocalStack, and `terraform state list` matches the resources you intended. If an apply fails, read the emulator error before changing the code; unsupported features are an emulator limitation, not necessarily a Terraform bug.

4. **Verify the weak settings through the API, not the plan.** The plan says what Terraform intends; the API says what exists.

```bash
aws --endpoint-url=http://localhost:4566 s3api get-bucket-acl --bucket lab-public-data
aws --endpoint-url=http://localhost:4566 s3api get-public-access-block --bucket lab-public-data || true
aws --endpoint-url=http://localhost:4566 s3api get-bucket-encryption --bucket lab-public-data || true
aws --endpoint-url=http://localhost:4566 s3api get-bucket-versioning --bucket lab-public-data
```

Checkpoint: the ACL grants `AllUsers` read, the public access block is absent (the call errors), encryption is not configured, and versioning is off. Each observation maps to one finding.

5. **Demonstrate anonymous read access with a harmless object.** Upload a synthetic file and fetch it without credentials.

```bash
printf 'synthetic lab object; no real data\n' > sample.txt
aws --endpoint-url=http://localhost:4566 s3 cp sample.txt s3://lab-public-data/sample.txt
curl -s -o /dev/null -w 'anonymous status: %{http_code}\n' http://localhost:4566/lab-public-data/sample.txt
curl -s http://localhost:4566/lab-public-data/sample.txt
```

Checkpoint: HTTP 200 and the file contents without authentication. This is the proof of exposure; a scanner finding alone would not demonstrate it. Note that this is LocalStack on your isolated VM, not a real bucket.

6. **Analyze the IAM policy for blast radius.** Read the policy document and write down what the identity can do if its credentials leak.

```bash
aws --endpoint-url=http://localhost:4566 iam list-policies --scope Local
POLICY_ARN=$(aws --endpoint-url=http://localhost:4566 iam list-policies --scope Local --query 'Policies[0].Arn' --output text)
aws --endpoint-url=http://localhost:4566 iam get-policy-version --policy-arn "$POLICY_ARN" --version-id v1
```

Checkpoint: a paragraph explaining that `Action: "*"` on `Resource: "*"` lets the identity read, modify, and delete any resource the account can reach, including IAM changes that could create persistence. Note that the policy is unattached in this configuration; the risk materializes when it is attached to a CI role or user.

7. **Assess the network exposure statically.** The security group is not deployed, but the plan is enough to reason about it. `0.0.0.0/0` on port 22 means every address on the internet can attempt SSH, and the outcome depends entirely on authentication controls you have not reviewed. Checkpoint: a finding that states exposure, likely attack paths, and the prerequisites for exploitation, without claiming the host is already compromised.

8. **Map findings to controls and rate them.** Use a table with the finding, the affected resource, the CIS AWS Foundations or AWS Foundational Security Best Practices control name, and a severity with rationale. Avoid inventing control numbers; use the control names from the current benchmark version you downloaded.

| ID | Finding | Resource | Control area | Severity |
| --- | --- | --- | --- | --- |
| C-01 | Bucket ACL grants public read | S3 bucket | S3 public access / access control | High |
| C-02 | No public access block | S3 bucket | S3 block public access | High |
| C-03 | No default encryption | S3 bucket | Data encryption at rest | Medium |
| C-04 | Versioning disabled | S3 bucket | Data protection / recovery | Low |
| C-05 | IAM policy allows all actions on all resources | IAM policy | Least privilege | High |
| C-06 | SSH open to 0.0.0.0/0 | Security group | Network ingress | Medium |

9. **Remediate the code.** Change the ACL, add a public access block, enable encryption and versioning, scope the IAM policy, and restrict the security group. Apply the changes in a copy, `after/`, so you can diff before and after.

```hcl
resource "aws_s3_bucket_public_access_block" "public" {
  bucket                  = aws_s3_bucket.public.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "public" {
  bucket = aws_s3_bucket.public.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "public" {
  bucket = aws_s3_bucket.public.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

Replace the wildcard policy with specific actions on a specific resource, and add a condition that requires TLS:

```hcl
resource "aws_iam_policy" "ci_deployer" {
  name = "lab-ci-deployer"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject"]
      Resource = "arn:aws:s3:::lab-public-data/*"
      Condition = {
        Bool = { "aws:SecureTransport" = "true" }
      }
    }]
  })
}
```

For the security group, remove the ingress rule entirely or scope it to the lab CIDR with a comment explaining why. Checkpoint: a `terraform plan` that shows only the intended changes, with no unrelated replacements.

10. **Re-scan and redeploy the remediated stack.** Compare the Trivy output with the baseline.

```bash
cd ~/cloud-review/after
terraform init
trivy config --severity HIGH,CRITICAL --format table . | tee ../trivy-after.txt
terraform apply -auto-approve \
  -target=aws_s3_bucket.public \
  -target=aws_s3_bucket_public_access_block.public \
  -target=aws_s3_bucket_server_side_encryption_configuration.public \
  -target=aws_s3_bucket_versioning.public \
  -target=aws_iam_policy.ci_deployer
```

Checkpoint: the specific high and critical findings from the baseline are resolved, or you have a written explanation for any that remain. Do not claim a clean scan if the output still contains findings.

11. **Verify the fix live.** Check the ACL, public access block, encryption, versioning, and anonymous access again.

```bash
aws --endpoint-url=http://localhost:4566 s3api get-public-access-block --bucket lab-public-data
aws --endpoint-url=http://localhost:4566 s3api get-bucket-encryption --bucket lab-public-data
aws --endpoint-url=http://localhost:4566 s3api get-bucket-versioning --bucket lab-public-data
aws --endpoint-url=http://localhost:4566 s3api get-bucket-acl --bucket lab-public-data
curl -s -o /dev/null -w 'anonymous status: %{http_code}\n' http://localhost:4566/lab-public-data/sample.txt
```

Checkpoint: public access block values are `true`, encryption is `AES256`, versioning is `Enabled`, and anonymous access is denied. LocalStack's enforcement of public access blocks can differ from AWS; if the emulator still serves the object, record the discrepancy, rely on the configuration and AWS documentation for the expected production behavior, and state the limitation in the report.

12. **Optionally assess a real sandbox account with Prowler.** Only if you already have a dedicated sandbox account with no data. Create an IAM user with the `SecurityAudit` managed policy, no access keys for root, and a one-dollar budget alert. Never deploy the weak bucket there.

```bash
pipx install prowler
aws configure --profile lab-sandbox
prowler aws --profile lab-sandbox --services s3 iam --severity critical high --output-directory prowler-out
```

Checkpoint: a Prowler report with account-level findings you can compare with the IaC review. Note that Prowler checks the live account, including resources Terraform did not create, so the results are broader than the code review.

13. **Tear down and record the cost.** A lab is not finished until the resources are gone.

```bash
cd ~/cloud-review/after
terraform destroy -auto-approve
docker rm -f localstack
docker volume rm localstack-data
curl -s http://localhost:4566/_localstack/health || echo "localstack stopped"
```

If you used a real sandbox, also verify with `aws s3 ls`, check for running instances, confirm the Terraform state is empty, and record the next-day cost in your log. Checkpoint: zero billable resources, zero spend, and a teardown log with commands and outputs.

## Expected results

- A documented threat model and a reviewed Terraform plan.
- A Trivy baseline with concrete misconfiguration findings.
- A LocalStack deployment where public read access is demonstrated with a harmless object.
- An API-level verification of the weak ACL, missing encryption, missing versioning, and wildcard IAM policy.
- A remediated configuration whose high and critical findings are resolved and whose live settings are verified.
- A destroyed environment and a cost log showing zero spend.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `scope-and-threat-model.md` | Markdown | Data, actors, trust boundaries, impact of misuse |
| `before/main.tf` | HCL | Deliberately weak but explainable configuration |
| `plan-before.txt` | Text | Reviewed plan, not just an apply log |
| `trivy-before.json` | JSON | Machine-readable baseline |
| `findings.csv` | CSV | Finding, resource, control area, severity, evidence, status |
| `after/main.tf` | HCL | Remediated configuration with comments on each control |
| `trivy-after.txt` | Text | Re-scan showing resolved findings |
| `verification.md` | Markdown | API outputs and anonymous-access result before and after |
| `teardown-log.md` | Markdown | Commands, outputs, and confirmation of zero resources |
| `cost-log.md` | Markdown | Expected versus actual spend, with evidence |

## Skills gained

- Reading Terraform plans as security review artifacts.
- Identifying public storage, wildcard IAM, and internet-open network rules.
- Using LocalStack to test cloud behavior safely and cheaply.
- Static IaC scanning with Trivy and interpreting rule output.
- Remediating misconfigurations and verifying the fix at the API level.
- Cost control and teardown discipline for cloud labs.

## Stretch improvements

1. Add an S3 bucket policy that enforces TLS and denies unencrypted uploads, then prove the deny with the CLI.
2. Convert the configuration into a reusable module with secure defaults and a test that fails if a public ACL appears.
3. Scan a Kubernetes manifest with Trivy and compare its findings with the cloud review, using the Kubernetes security documentation as your control reference.
4. Add a CI job that runs `terraform validate`, `trivy config --exit-code 1`, and a plan check on every pull request.
5. Run CloudGoat in a dedicated sandbox account to practice exploitation and detection, and document the full teardown and cost. Do not do this in an account with real data.
6. Write a one-page cloud security standard for your lab that future Terraform must comply with, and map each rule to a Trivy check.

## Troubleshooting

### LocalStack is running but Terraform cannot reach it

Confirm the health endpoint and the port mapping with `curl -s http://localhost:4566/_localstack/health`. Check that the provider block has the `s3`, `iam`, and `sts` endpoints and that `skip_credentials_validation`, `skip_metadata_api_check`, and `skip_requesting_account_id` are set. If the container restarted, the endpoint is still the same but the state may be gone; re-apply.

### The public ACL fails to apply

Modern S3 buckets use bucket-owner-enforced ownership, which disables ACLs. The `aws_s3_bucket_ownership_controls` resource with `ObjectWriter` is required before a public-read ACL can apply. If the emulator still rejects the ACL, use a bucket policy granting `s3:GetObject` to `*` for the lab, and record the deviation.

### Trivy cannot download its database

Trivy needs network access on first run. Use the VM's NAT adapter, or pre-download the database on a connected host and follow the offline instructions. If you are air-gapped, run the scan on a machine with connectivity and transfer only the JSON report.

### `terraform apply` fails on the security group in LocalStack

LocalStack Community coverage for EC2 security groups varies by version. Apply only the S3 and IAM targets, as shown, and evaluate the security group from the plan and static scan. Do not conclude that the Terraform code is invalid because the emulator lacks a feature.

### Prowler fails with access-denied errors

The scanning identity needs the `SecurityAudit` managed policy and, for some checks, additional read-only permissions. Confirm the profile with `aws sts get-caller-identity --profile lab-sandbox`, and check `prowler --help` for the severity flag syntax in your version. Never grant `AdministratorAccess` to a scanner for convenience.

## Portfolio presentation

Publish the before and after Terraform, the Trivy comparison, the verification outputs, and the findings table with the emulator limitation stated. This project demonstrates secure-by-design thinking, which is more valuable than a list of scanner alerts. Remove account IDs, ARNs containing account numbers, access keys, and any real resource names. The LocalStack endpoint and dummy credentials are safe to show because they are not secrets. Do not publish a working public bucket, even in an emulator, without the surrounding explanation that it was destroyed.

## References

1. Terraform AWS provider documentation — <https://registry.terraform.io/providers/hashicorp/aws/latest/docs>
2. LocalStack documentation — <https://docs.localstack.cloud/>
3. Trivy documentation, including misconfiguration scanning — <https://trivy.dev/>
4. Prowler documentation — <https://docs.prowler.com/>
5. CIS Benchmarks — <https://www.cisecurity.org/cis-benchmarks>
6. AWS S3 security best practices — <https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html>
7. Kubernetes security concepts — <https://kubernetes.io/docs/concepts/security/>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
