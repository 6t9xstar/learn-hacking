[Home](../../README.md) / [Additional topics](../README.md) / Cryptography

# Cryptography

Cryptography is the mathematics and engineering of protecting information: keeping it confidential, proving it has not changed, and establishing who sent it. In practice, most security failures are not broken algorithms. They are broken protocols, reused nonces, disabled certificate checks, weak password hashing, and keys stored in the wrong place.

This guide is for developers, security engineers, and curious administrators who want to use cryptography correctly and recognize misuse. It explains concepts and tradeoffs, not mathematical proofs. Every hands-on exercise uses test keys, local services, and hashes you generate yourself.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Intermediate; the concepts are approachable, the details are deep |
| Realistic time | 2-4 months to build practical literacy; specialization takes much longer |
| Cost | Free; all recommended courses and tools are open or free to access |
| Prerequisites | Basic programming, HTTP and TLS familiarity, comfort with a command line |
| Lab requirement | Helpful. A local Linux VM for OpenSSL exercises and a test web server for TLS inspection |

## Why this field matters

Every login, payment, message, firmware update, and API call depends on cryptography. When it is implemented well, users never notice. When it is implemented badly, the failure is often silent: data decrypts correctly for the attacker, signatures verify when they should not, or a password database falls to an offline attack in minutes.

Security practitioners need enough cryptography to review a design, ask the right questions, and recognize when a library is being used unsafely. They also need to communicate with cryptographers and auditors without pretending to be one. The most useful skill is not inventing a cipher; it is choosing the right primitive, using a well-reviewed library, and managing keys over time.

## What you will learn

- The security goals cryptography serves and the attacker models it assumes.
- How symmetric encryption, hashes, MACs, signatures, and key exchange fit together.
- How password hashing differs from general-purpose hashing.
- How TLS 1.3 and public key infrastructure establish trust.
- How keys should be generated, stored, rotated, and retired.
- The most common cryptographic misuse patterns and how to spot them in code review.
- What post-quantum cryptography changes and what it does not.
- How to plan crypto agility so algorithms can be replaced without a rewrite.

## Prerequisites and honest expectations

You should understand what a hash function is, what a digital signature does at a high level, and how HTTPS works from a user's perspective. Basic Python or Go helps for the exercises. You do not need linear algebra or number theory to use cryptography safely, but you do need discipline: cryptography punishes improvisation.

Expect acronyms and competing recommendations. Expect that "military-grade encryption" is marketing, not a security property. Expect to spend more time on key management and protocol design than on choosing an algorithm. And expect that the correct answer is often "use a maintained library or protocol, not custom code".

## Core concepts

### 1. Security goals and attacker models

Cryptography provides confidentiality (only authorized parties can read), integrity (changes are detectable), authenticity (the sender is who they claim), and non-repudiation (a signer cannot easily deny signing). Different mechanisms provide different subsets. Encryption alone does not provide integrity; a MAC alone does not hide data.

The attacker model matters. Are they passive on the network, active in the middle, able to steal a database, able to run code on the server, or able to compel a provider to hand over keys? A design that protects against a passive network attacker may fail completely against someone with database access. Write the threat model before choosing primitives.

### 2. Symmetric encryption and authenticated encryption

Symmetric encryption uses the same key to encrypt and decrypt. AES is the standard block cipher; ChaCha20 is a stream cipher widely used on mobile and constrained devices. Block ciphers are used in modes: ECB encrypts identical blocks identically and should never be used for data with structure; CBC requires a random IV and a separate MAC; CTR turns a block cipher into a stream and fails catastrophically if a nonce repeats.

Modern practice is authenticated encryption with associated data (AEAD), such as AES-GCM or ChaCha20-Poly1305. AEAD provides confidentiality and integrity in one construction, but it still requires a unique nonce per key. Nonce reuse in GCM can leak authentication keys. Use a library's high-level AEAD interface rather than assembling modes manually.

### 3. Hashes, MACs, and signatures

A cryptographic hash maps arbitrary input to a fixed-size digest and should be collision-resistant and preimage-resistant. SHA-256 and SHA-3 are standard; MD5 and SHA-1 are broken for security purposes. Hashes are used for integrity checks, fingerprints, and as building blocks, not for hiding low-entropy secrets.

A message authentication code (MAC), such as HMAC-SHA-256, proves integrity and authenticity when both parties share a key. A digital signature uses a private key to sign and a public key to verify, providing authenticity without sharing a secret. Ed25519 is a modern signature scheme; RSA-PSS remains common. Do not confuse a checksum with a MAC: a checksum detects accidents, not adversaries.

### 4. Password hashing and key derivation

Passwords are low-entropy secrets. Store them with a password-hashing function that is deliberately slow and memory-hard: Argon2id is the current recommendation, with scrypt and PBKDF2 as acceptable alternatives depending on constraints. Always use a unique random salt per password. Never store passwords encrypted or hashed with a fast general-purpose hash such as SHA-256 alone.

Key derivation functions (KDFs) turn a secret or key material into keys. HKDF is for deriving keys from high-entropy input; it is not a password hash. Argon2, scrypt, and PBKDF2 are password-based KDFs. Tune cost parameters so verification takes a measurable but acceptable time on your hardware, and plan to increase them over time.

### 5. Asymmetric cryptography and key exchange

Asymmetric cryptography uses a key pair: a public key that can be shared and a private key that must be protected. RSA is used for encryption and signatures but requires large keys and careful padding. Elliptic curve cryptography (ECC) provides equivalent security with smaller keys; X25519 is common for key exchange, Ed25519 for signatures.

Key exchange lets two parties derive a shared secret over an untrusted channel. Diffie-Hellman and its elliptic-curve variants provide forward secrecy when ephemeral keys are used: compromising a long-term key later does not decrypt past sessions. In practice, protocols combine asymmetric key exchange with symmetric AEAD, because symmetric encryption is much faster.

### 6. TLS 1.3

TLS protects data in transit. TLS 1.3 simplified the handshake, removed legacy algorithms, requires forward secrecy for the main handshake, and encrypts more of the handshake metadata than earlier versions. A typical flow: client hello with key share, server hello and certificate, certificate verification, key derivation, finished messages, then application data.

Operational concerns remain: certificate validation, hostname verification, protocol version and cipher policy, session resumption, 0-RTT replay risk, and middlebox interference. TLS does not protect data at rest, does not authenticate users by itself, and does not hide traffic analysis completely. Configure it with a modern profile and test it rather than assuming defaults are safe.

### 7. PKI and certificate validation

Public key infrastructure binds public keys to identities through certificates signed by certificate authorities (CAs). A certificate contains a subject, public key, validity period, key usage, and extensions such as subject alternative names (SANs). Clients build a chain to a trusted root and check revocation, name constraints, and usage.

Most real-world failures are validation failures: disabled verification, incorrect hostname checks, trusting user-supplied certificates, or a compromised CA. Certificate Transparency logs make issuance auditable. Revocation is imperfect; short-lived certificates and OCSP stapling reduce the window. Never disable certificate validation to make an error go away.

### 8. Key management

Keys are the weakest link. Generate them with a cryptographically secure random number generator, store them in a secrets manager or hardware security module when possible, restrict access, and separate keys by purpose and environment. Never commit keys to source control; rotate any key that has been exposed.

Envelope encryption wraps data keys with a master key, so large data sets do not need to be re-encrypted when the master key rotates. Key rotation needs a plan for old data, versioning, and rollback. Delete keys with the same care as data, and document who can recover them after an employee leaves.

### 9. Randomness and nonces

Cryptography depends on unpredictability. Use the operating system's CSPRNG (`/dev/urandom`, `getrandom`, `crypto/rand`, `secrets` in Python) rather than a general-purpose random function. A predictable seed can reveal keys, tokens, and session identifiers.

A nonce must never repeat under the same key for a given algorithm. Random 96-bit nonces are standard for GCM, but the birthday bound means very high message volumes can risk collision; deterministic construction or key rotation may be needed. IV reuse in CBC or CTR is a classic catastrophic bug. Treat nonce generation as security-critical code.

### 10. Common misuse patterns

Recurring mistakes: ECB mode for structured data, static or reused IVs, unauthenticated CBC, encrypting without a MAC, rolling your own cipher or protocol, using a fast hash for passwords, hardcoding keys, deriving keys from passwords without a salt, comparing secrets with non-constant-time equality, and disabling certificate verification.

Also watch for "encryption" that only obfuscates: base64 is not encryption, XOR with a repeating key is trivial to break, and custom token formats often leak structure. In code review, look for library calls with suspicious parameters, deprecated APIs, and comments such as "temporary" or "we will fix this later".

### 11. Post-quantum awareness

Large-scale quantum computers would break RSA and elliptic-curve cryptography via Shor's algorithm and weaken symmetric security via Grover's algorithm. NIST has standardized post-quantum algorithms, including ML-KEM for key encapsulation and ML-DSA and SLH-DSA for signatures. Hybrid schemes combine classical and post-quantum key exchange so that a failure in either does not immediately break the connection.

The practical risk today is "harvest now, decrypt later": an adversary records encrypted traffic and waits for a future quantum computer. Organizations with long-lived secrets should inventory where public-key cryptography is used, test hybrid TLS, and plan migration. Post-quantum changes key sizes and performance, so crypto agility is a prerequisite.

### 12. Crypto agility and migration

Crypto agility is the ability to replace algorithms, keys, protocols, and certificate authorities without rewriting applications. It requires inventory: where is cryptography used, which libraries and versions, which keys, which protocols, and who owns them. Without inventory, migration becomes an archaeology project.

Design for versioned cipher suites, configurable trust stores, and abstraction layers that do not leak algorithm details into business logic. Deprecate SHA-1, TLS 1.0/1.1, RSA keys below current guidance, and weak password hashing on a schedule. Test interoperability before switching, and keep a rollback path.

## Legal and safe practice

Cryptography is dual-use. Encrypting your own data is normal; using cryptography to hide criminal activity is not. Some jurisdictions regulate the import, export, or use of cryptographic products. Check local law and organizational policy if you build products for distribution.

Password cracking is legal only on hashes you own or are authorized to test. Generate your own hashes for practice, or use public challenge sets designed for training. Never attack a production password database or use recovered credentials to access systems.

Use test keys and local services for the exercises. Do not disable certificate validation on systems that handle real data, even temporarily. If you find a cryptographic weakness in a product, report it privately and follow coordinated disclosure.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations | Goals and primitives | Read Crypto101 and complete the first CryptoHack sections | A one-page map of primitive to security goal |
| 2. Applied use | Libraries and protocols | Build a small app that encrypts, hashes, and verifies with libsodium | Working code plus a review of nonce and key handling |
| 3. TLS and PKI | Certificates and trust | Run a local CA, issue certificates, inspect a TLS handshake | A PKI diagram and a verified mTLS connection |
| 4. Password security | Hashing and parameters | Implement Argon2id storage and benchmark cost settings | A design memo with parameters and migration plan |
| 5. Review | Misuse detection | Audit an open-source project for crypto misuse | A findings report with severity and fixes |
| 6. Agility | PQC and migration | Inventory a small system's cryptography and propose a migration | A crypto inventory and phased migration plan |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Crypto101](https://www.crypto101.io/) | Crypto101 | Beginner | Free | No | A concise, practical introduction to cryptographic concepts |
| [CryptoHack](https://cryptohack.org/) | CryptoHack | Beginner to advanced | Free account | Yes | Interactive challenges from XOR basics to advanced constructions |
| [Dan Boneh's online cryptography course](https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/) | Stanford University | Intermediate | Free | No, exercises in the book | Rigorous explanations of encryption, authentication, and protocols |
| [Practical Cryptography for Developers](https://cryptobook.nakov.com/) | Svetlin Nakov | Beginner to intermediate | Free | Some examples | Developer-oriented guidance on hashes, ciphers, and key exchange |
| [Cryptopals challenges](https://cryptopals.com/) | Cryptopals | Intermediate to advanced | Free | Yes | A legendary sequence of attacks that teaches why misuse breaks systems |
| [NIST cryptographic standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) | NIST | Advanced | Free | No | Primary-source standards for algorithms and modes |

## Official documentation and standards

- [NIST Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines) — the index of FIPS and SP documents.
- [FIPS 140-3](https://csrc.nist.gov/pubs/fips/140-3/final) — the standard for cryptographic module validation.
- [NIST SP 800-57 Part 1 Revision 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final) — key management guidance.
- [NIST SP 800-52 Revision 2](https://csrc.nist.gov/pubs/sp/800/52/r2/final) — TLS configuration guidance for government systems and a useful baseline elsewhere.
- [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) — the protocol specification.
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) — practical storage and key handling advice.
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) — password hashing parameters and migration guidance.
- [NIST Post-Quantum Cryptography project](https://csrc.nist.gov/projects/post-quantum-cryptography) — standardization status and migration resources.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [CryptoHack](https://cryptohack.org/) | Interactive challenges | Free account | Platform-hosted challenges; no real systems |
| [Cryptopals](https://cryptopals.com/) | Programming challenges | Free | Run attacks against your own implementations |
| Local OpenSSL CA | Self-hosted PKI | Free | Test certificates only; never use for production trust |
| [testssl.sh](https://testssl.sh/) | TLS configuration testing | Free | Scan only servers you own or are authorized to test |
| [CyberChef](https://gchq.github.io/CyberChef/) | Browser-based data transformation | Free | Useful for decoding and inspection, not for protecting secrets |

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| OpenSSL | TLS toolkit, certificate operations, and cryptographic primitives | [openssl.org](https://www.openssl.org/) |
| age | Simple, modern file encryption with small keys | [age-encryption.org](https://age-encryption.org/) |
| GnuPG | OpenPGP encryption and signing for files and email | [gnupg.org](https://gnupg.org/) |
| libsodium | High-level, misuse-resistant cryptographic library | [doc.libsodium.org](https://doc.libsodium.org/) |
| testssl.sh | TLS/SSL configuration and vulnerability checks | [testssl.sh](https://testssl.sh/) |
| Hashcat | Password recovery and auditing, for authorized hashes only | [hashcat.net](https://hashcat.net/hashcat/) |
| John the Ripper | Password auditing and hash analysis, authorized use only | [openwall.com/john](https://www.openwall.com/john/) |

## Practical projects and exercises

### Exercise 1: Build a small certificate authority

Objective: create a root CA and an intermediate, issue a server certificate and a client certificate, and test mutual TLS locally.

Constraints: use a local VM or container; keep the root key offline after signing the intermediate; use short validity periods and test certificates only.

Deliverable: a PKI design document with key sizes, validity, extensions, and storage locations; the OpenSSL configuration and commands; a successful mTLS connection; a failed connection using an expired or wrong-name certificate; and a verification log. Include a revocation test and explain what the client checks.

### Exercise 2: Audit TLS on a server you control

Objective: configure a local web server for TLS 1.3 with a modern cipher profile, then audit it.

Constraints: scan only your own VM or a domain you are authorized to test; do not scan third parties.

Deliverable: a before/after testssl.sh report, the server configuration diff, an explanation of every remaining warning, and a client compatibility note. Add a section on certificate chain construction and what happens when an intermediate is missing.

### Exercise 3: Password storage design memo

Objective: design and benchmark a password storage scheme for a small application.

Constraints: use Argon2id or scrypt; do not store real user passwords; benchmark on hardware similar to production.

Deliverable: working code that hashes and verifies passwords with a unique salt, measured time and memory for at least three parameter sets, a recommendation with justification, a migration plan from an older hash, and a threat model covering offline attack and database breach. Optionally, measure how long a GPU-based cracker takes against a deliberately weak password hash you generated, and use the result to justify the parameters.

## Common mistakes and misconceptions

1. **Using ECB mode.** Identical plaintext blocks produce identical ciphertext, leaking structure. It should not be used for arbitrary data.
2. **Reusing an IV or nonce.** This can be catastrophic, especially with stream ciphers and GCM. Generate nonces with a CSPRNG and respect the algorithm's limits.
3. **Encrypting without authentication.** Confidentiality without integrity allows tampering. Use AEAD or encrypt-then-MAC.
4. **Hashing passwords with SHA-256.** Fast hashes are easy to brute-force. Use Argon2id, scrypt, or PBKDF2 with appropriate cost.
5. **Inventing your own crypto or protocol.** Even experts get this wrong. Use vetted libraries and standard protocols.
6. **Disabling certificate validation.** It turns TLS into encryption without identity. Fix the trust store instead.
7. **Hardcoding keys or committing them to Git.** Secrets in source control are effectively public. Use a secrets manager and rotate.
8. **Treating base64 as encryption.** Encoding does not protect data. It is reversible by anyone.
9. **Ignoring post-quantum migration.** Long-lived secrets are at risk from harvest-now-decrypt-later. Inventory public-key usage now.
10. **Assuming "encrypted" means "secure".** Encryption without key management, authentication, and correct configuration is not security.

## Career paths and roles

Cryptography appears in security engineering, application security, cloud security, PKI operations, and product engineering. Dedicated cryptographer roles usually require advanced mathematics or a research background, but many well-paid roles need applied crypto literacy: reviewing designs, implementing libraries correctly, and managing keys.

What employers value: evidence of shipping secure systems, code review skill, familiarity with TLS and PKI, and the judgment to escalate to specialists. A public write-up of a crypto misuse finding, a well-documented PKI project, or a password migration plan demonstrates practical ability.

Adjacent roles include identity engineer, secrets management specialist, and compliance auditor for FIPS or PCI requirements. Certifications exist but are optional; a solid portfolio and careful reasoning matter more.

## Next steps

1. Complete the first ten CryptoHack challenges and write up what each taught you.
2. Build the local CA in Exercise 1 and test mTLS end to end.
3. Audit a server you control with testssl.sh and fix the top finding.
4. Read the OWASP password storage guidance and benchmark Argon2id on your hardware.
5. Review the [intermediate training grounds](../../resources/training-grounds/intermediate.md) and the [ethics policy](../../ETHICS.md) before expanding your practice.

## References

1. NIST, [Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines).
2. NIST, [FIPS 140-3](https://csrc.nist.gov/pubs/fips/140-3/final).
3. NIST, [SP 800-57 Part 1 Revision 5](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final).
4. IETF, [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).
5. OWASP, [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html).
6. OWASP, [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
7. NIST, [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography).
8. Crypto101, [free introduction to cryptography](https://www.crypto101.io/).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
