[Repository home](../../README.md) / Additional topics / Blockchain security

# Blockchain and Smart Contract Security

Blockchain security covers two connected problems: securing the distributed system itself (consensus, wallets, keys, bridges) and securing the programs that run on it (smart contracts). This guide focuses on the second, because it is where most learners can build practical skill quickly, while explaining enough of the first to avoid dangerous misunderstandings. It is written for developers and security learners who can already program and want to audit Solidity contracts rather than trade tokens.

Smart contracts are unusually unforgiving. Code is public, transactions are irreversible, and a single missing check can drain a protocol in seconds. That makes the field a superb place to learn rigorous review: you cannot patch an incident away, so you must reason about every state transition before deployment.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Intermediate to advanced; programming experience required |
| Realistic time | 120–200 hours to audit simple contracts with supervision |
| Cost | Free on local chains and testnets; paid only for optional tooling or audits |
| Prerequisites | Solidity or another typed language, Git, basic cryptography, JavaScript helps |
| Lab requirement | Local chain (Anvil/Hardhat) or public testnet only; no mainnet attacks |
| Best for | Developers moving into security, auditors, protocol engineers |

## Why this field matters

Decentralized finance, NFTs, DAOs, and tokenized assets concentrate real value in code that anyone can call. Unlike a bank, there is no chargeback and often no administrator who can reverse a bad transaction. Bridges and lending pools have lost nine-figure sums to bugs that fit on a few lines: a missing state update before an external call, a price read from a manipulable pool, or an initializer anyone could call.

Defensively, the demand for people who can read Solidity and reason about economic incentives far exceeds supply. Auditors, protocol security engineers, and incident responders all need the same foundation: the ability to trace value and authority through a contract system, then prove a weakness with a local test. That proof discipline is also what distinguishes a credible audit finding from a speculative comment.

## What you will learn

- Explain how accounts, transactions, gas, and the EVM execute a contract call.
- Identify the major Solidity vulnerability classes and the conditions that make them exploitable.
- Apply secure patterns: checks-effects-interactions, pull payments, access control, and guarded upgrades.
- Write Foundry tests, fuzz tests, and invariants that encode what must never break.
- Run static analysis and property-based tools and triage their output.
- Follow a professional audit workflow from scope to report and fix review.
- Handle keys, upgrades, and disclosure responsibly in a high-value environment.

## Prerequisites and honest expectations

You should be able to write and test a small Solidity contract before focusing on security. If you have never used a wallet, deployed to a testnet, or read a transaction on a block explorer, do that first. You do not need deep cryptography, but you must understand hashes, public-key signatures, and why a private key is the entire account.

Expect tooling friction. Foundry and Node.js environments change quickly, fork tests need an RPC endpoint, and static analyzers produce many false positives. Auditing is also slow: a careful review of a few hundred lines can take a full day. The reward is a skill set that is hard to fake and easy to demonstrate with public write-ups.

## Core concepts

### Blockchain fundamentals and the trust model

A blockchain is a replicated state machine. Nodes agree on an ordered sequence of transactions, each of which changes global state; consensus rules decide which chain is canonical. Public chains assume some participants are dishonest, while permissioned chains often trust a known validator set. Neither model removes the need to secure application code.

For a security reviewer, the important properties are transparency, immutability, and atomicity. Anyone can read your bytecode and simulate calls. A reverting transaction rolls back all state changes, which helps safety but also enables all-or-nothing attacks such as flash-loan-funded manipulation. "Code is law" is a design claim, not a legal shield; governance and upgrade keys usually exist somewhere.

### Accounts, transactions, and gas

There are two account types. Externally owned accounts (EOAs) are controlled by a private key and have a nonce. Contract accounts have code and storage but no key. A transaction specifies a recipient, value, calldata, gas limit, and fee fields; the signature authorizes it, and the nonce prevents replay.

Gas is the metering unit for computation. A simple transfer costs 21,000 gas; storage writes are expensive, and refunds are limited. If gas runs out, the transaction reverts but the fee is still paid. This creates denial-of-service opportunities: a loop over an array that grows without bound can make a function uncallable. Reviewers should look for unbounded loops, push payments to many recipients, and external calls that can consume all forwarded gas.

### The EVM execution model

The Ethereum Virtual Machine is a stack machine with 256-bit words, volatile memory, persistent storage, and per-call calldata. Contract storage is a key-value map of 32-byte slots; mappings and dynamic arrays are laid out by hashing, which matters for proxy storage collisions. Calls can be `call`, `staticcall`, `delegatecall`, or `callcode`; each has different context and state permissions.

Understanding the call context is essential. `msg.sender` is the immediate caller, which may be a contract. `tx.origin` is the original EOA and should almost never be used for authorization. A `delegatecall` executes another contract's code in the caller's storage, which is powerful for libraries and proxies but catastrophic when the target is untrusted or storage layouts diverge.

### Contract lifecycle and upgradeability

Contracts are deployed, optionally initialized, used, and sometimes upgraded or destroyed. Constructors run once at deployment; proxy patterns run an initializer instead, and an unprotected initializer lets an attacker become the owner. Upgrades introduce storage-layout risk: if a new implementation reorders or inserts variables, existing values are reinterpreted.

Common patterns include transparent proxies, UUPS proxies, and minimal clones. Each has tradeoffs around admin privileges, upgrade authorization, and storage slots (EIP-1967 defines standard slots). A secure upgrade design uses a timelock, multisig control, storage-layout checks, and a documented rollback plan. Ask who can upgrade, how quickly, and what happens if that key is compromised.

### Reentrancy

Reentrancy occurs when a contract calls an external address before finishing its own state update, and the callee calls back into the original function. The classic drain loops: withdraw balance, call attacker, attacker re-enters withdraw before the balance is zeroed. Variants include cross-function reentrancy, cross-contract reentrancy, and read-only reentrancy where a view function reports inconsistent state to a third-party protocol.

The primary defense is checks-effects-interactions: validate inputs, update state, then interact. A reentrancy guard is a useful backstop but not a substitute for correct ordering. Pull payments, where users withdraw funds themselves, avoid pushing Ether to arbitrary contracts. Remember that receiving Ether can execute code through `receive` or `fallback`, and that ERC-777 and callback-style tokens introduce hooks.

The vulnerable ordering is easy to spot once you have seen it:

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "transfer failed");
    balances[msg.sender] = 0; // too late: the callee already re-entered
}
```

Moving the balance update above the call fixes the classic case. It does not fix a second function that reads the stale balance, which is why reviewers trace every path that touches the same state.

### Access control and authorization

Access control bugs are boring and devastating. Missing modifiers, overly broad roles, unprotected `selfdestruct`, public mint functions, and ownership transferred to `address(0)` all appear in real incidents. Role-based systems should follow least privilege: separate admin, operator, and emergency roles, and make privileged functions emit events.

Review every state-changing function and ask who should be allowed to call it. Check that modifiers are applied on all paths, including initializer and upgrade functions. Avoid `tx.origin` for authorization, and be careful with `onlyOwner` functions that can change critical parameters instantly. A timelock turns a compromised admin key from an instant catastrophe into a detectable event.

### Oracle manipulation and economic attacks

Protocols often need external prices. If a contract reads a spot price from a constant-product automated market maker, an attacker can borrow a large amount through a flash loan, move the price, trigger the mispriced action, and repay within one transaction. Time-weighted average prices, multiple independent sources, sanity bounds, and circuit breakers raise the cost of manipulation.

Economic security also includes front-running and maximal extractable value. A pending transaction that reveals a profitable trade can be sandwiched by a searcher who moves the price before and after it. Slippage limits, commit-reveal schemes, and private transaction channels mitigate specific cases. Reviewers should model incentives, not just code: who profits from a state transition, and what does it cost them?

### Integer and type pitfalls

Solidity 0.8 and later reverts on overflow and underflow by default, but `unchecked` blocks restore the old wrapping behavior. Precision loss is still common: dividing before multiplying, using integer math for shares, or assuming 18 decimals. Casting a larger type into a smaller one truncates silently, and block timestamps are not precise enough for fine-grained accounting.

Look for conversions between `uint256`, `uint128`, and `int256`, and for assumptions about token decimals. ERC-20 tokens are not all identical: fee-on-transfer tokens deliver less than the amount sent, rebasing tokens change balances, and some return `false` instead of reverting. A vault that credits the requested amount rather than the measured balance can be drained or become insolvent.

### delegatecall, proxies, and libraries

`delegatecall` preserves the caller's storage, `msg.sender`, and `msg.value` while running foreign code. It is the basis of upgradeable proxies and libraries. The dangers are untrusted targets, storage layout mismatches, and function-selector clashes between proxy admin functions and implementation functions.

A proxy admin function that shares a selector with an implementation function can be shadowed or accidentally invoked. Transparent proxies route admin calls to the proxy and user calls to the implementation; UUPS puts upgrade logic in the implementation and must include a `proxiableUUID` check. Libraries should be stateless or explicitly designed for the delegatecall context. Never delegatecall to an address a user can influence.

### Randomness and time

On-chain randomness is a classic trap. `block.timestamp`, `block.number`, `blockhash`, and `prevrandao` are visible to miners/validators and predictable within a range. Using them for lotteries, NFT traits, or winner selection invites manipulation. Commit-reveal schemes hide the choice until after the commitment, but they have their own issues: the last revealer can abort, and the commit must bind the sender and a nonce.

Verifiable random functions from an oracle provide stronger randomness at a cost and with a trust assumption. For many applications, the honest answer is to avoid on-chain randomness entirely and use an off-chain process with a clear trust model. Reviewers should ask what an attacker gains by predicting or biasing the value.

### Signatures, replay, and front-running

Contracts often verify signatures for meta-transactions, permits, or off-chain orders. `ecrecover` returns `address(0)` for invalid signatures, so a missing zero-address check can authorize anyone. Signatures can be replayed across chains, contracts, or nonces unless the signed payload includes a domain separator and a nonce, as EIP-712 and EIP-2612 do.

Malleability of ECDSA signatures means a third party can alter a valid signature without changing the signer, so do not use the signature itself as a unique identifier. For order books, front-running a revealed order is possible; use nonces, deadlines, and cancellation. The general rule: every signed message needs a purpose, a chain, a contract, and an expiry.

### Secure patterns, testing, and invariants

Secure contracts are built from a small set of habits. Use OpenZeppelin's audited implementations for tokens, access control, and guards instead of writing your own. Apply checks-effects-interactions, prefer pull payments, cap privileged actions with timelocks, and keep upgrade authority in a multisig.

Testing should encode invariants: total shares times price per share should equal assets, no user should withdraw more than they deposited, and the sum of balances should never exceed the contract's token balance. Foundry supports unit tests, fuzzing, and invariant testing against a stateful target; Echidna is a dedicated property-based fuzzer. Static tools such as Slither and Mythril find known patterns but do not understand your protocol's economics.

## The audit workflow

A professional audit is a process, not a tool run.

1. **Scope and context.** Record commit hashes, contracts in scope, out-of-scope dependencies, and the threat model. Read the documentation and ask what the protocol should never do.
2. **Architecture review.** Draw the contracts, roles, assets, and trust boundaries. Identify privileged keys, oracles, and external calls.
3. **Manual review.** Read every function in scope. Trace state transitions and value flows. Compare implementation against the specification.
4. **Tooling.** Run Slither, Mythril, and tests. Treat every alert as a lead, not a finding. Write a proof-of-concept test for anything credible.
5. **Severity and report.** Classify impact and likelihood, cite exact lines, explain the exploit path, and propose a fix. Distinguish critical, high, medium, low, and informational.
6. **Fix review and disclosure.** Re-test the patch, check for regressions, and coordinate disclosure. Publish a postmortem only after users are safe.

The SWC registry is a useful taxonomy for known weakness classes, but it is not exhaustive. Your report should explain the issue in your own words and show why the specific protocol is affected. For practice, audit a deliberately vulnerable contract set and have someone review your findings for quality.

## Legal and safe practice

> Audit only contracts you wrote or are authorized to assess. Deploying an exploit against mainnet is a crime in many jurisdictions, even if you return the funds.

Use a local chain (Anvil, Hardhat, or a Remix VM) for experiments. Public testnets are acceptable for deployment practice, but never send attack transactions to a contract you do not control. Fork tests that simulate a historical exploit must run locally and must not interact with live protocols or real funds.

If you discover a vulnerability in a deployed contract, do not exploit it. Contact the team through a published security contact or a bug bounty platform, provide a minimal reproduction, and give them time to respond. Never publish a working drain before funds are safe. Handle any user data or private keys you encounter as sensitive, and remember that blockchain analytics can link addresses to people. Read [ETHICS.md](../../ETHICS.md) before any engagement.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Blockchain basics | Accounts, transactions, gas, testnets, explorers | A testnet transaction you can explain line by line |
| 2. Solidity and the EVM | Storage, calls, events, proxies, ABI | A small contract with tests and a written call trace |
| 3. Vulnerability classes | Reentrancy, access control, oracles, integers | Five solved Ethernaut levels with explanations |
| 4. Tooling and testing | Foundry, fuzzing, invariants, Slither, Echidna | A repo with invariant tests and a triage note |
| 5. Audit practice | Scope, manual review, report, fix review | A full audit report on a deliberately vulnerable codebase |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Cyfrin Updraft](https://updraft.cyfrin.io/) | Cyfrin | Beginner to advanced | Free account | Yes | Solidity, Foundry, and smart contract security courses in sequence |
| [Ethernaut](https://ethernaut.openzeppelin.com/) | OpenZeppelin | Intermediate | Free, browser | Yes | Twenty-plus levels that teach one vulnerability class each |
| [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) | The Red Guild | Advanced | Free, self-hosted | Yes | DeFi-specific attack scenarios with Foundry/Hardhat |
| [Foundry Book](https://book.getfoundry.sh/) | Foundry | Beginner to intermediate | Free docs | Yes, local | Testing, fuzzing, scripting, and local chain workflow |
| [Ethereum developer tutorials](https://ethereum.org/en/developers/docs/) | Ethereum Foundation | Beginner | Free | Some | The canonical mental model for accounts, transactions, and the EVM |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [Smart contract security](https://ethereum.org/en/developers/docs/smart-contracts/security/) | Ethereum Foundation | A structured overview of risks and defensive patterns |
| [Security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html) | Solidity team | Language-level pitfalls every auditor must know |
| [Smart Contract Weakness Classification](https://swcregistry.io/) | SWC registry | A shared taxonomy for weakness classes and examples |
| [OpenZeppelin Contracts 5.x](https://docs.openzeppelin.com/contracts/5.x/) | OpenZeppelin | Audited building blocks for access control, tokens, and guards |
| [Building Secure Contracts](https://secure-contracts.com/) | Trail of Bits | A free book on secure development and verification |
| [ConsenSys smart contract best practices](https://consensys.github.io/smart-contract-best-practices/) | ConsenSys | Practical guidance on known attack patterns |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [Ethernaut](https://ethernaut.openzeppelin.com/) | OpenZeppelin | Free | Browser-based levels; deploy only to testnets or the provided instance |
| [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) | The Red Guild | Free | Local challenges; fund accounts only with test tokens |
| [Capture the Ether](https://capturetheether.com/) | Capture the Ether | Free | Deliberately vulnerable challenges; use a disposable test wallet |
| [Remix VM](https://remix.ethereum.org/) | Remix | Free | In-browser simulated chain; ideal for quick experiments |
| [Foundry + Anvil](https://github.com/foundry-rs/foundry) | Foundry | Free | Local chain; fork tests must never broadcast transactions |

## Essential open-source tools

Tools accelerate review, but a clean Slither run is not an audit. Understand each finding and prove it with a test.

| Tool | Purpose | Link |
| --- | --- | --- |
| Foundry | Solidity testing, fuzzing, invariants, and local chain | [book.getfoundry.sh](https://book.getfoundry.sh/) |
| Slither | Static analysis with detectors and a Python API | [github.com/crytic/slither](https://github.com/crytic/slither) |
| Mythril | Symbolic execution and security analysis | [github.com/ConsenSys/mythril](https://github.com/ConsenSys/mythril) |
| Echidna | Property-based fuzzing for Solidity contracts | [github.com/crytic/echidna](https://github.com/crytic/echidna) |
| OpenZeppelin Contracts | Audited implementations and security utilities | [github.com/OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) |
| Remix | Browser IDE with a simulated chain and debugger | [remix.ethereum.org](https://remix.ethereum.org/) |

## Practical projects and exercises

### Project 1: Vulnerability audit of five Ethernaut levels

Objective: produce a short audit report for five levels you have solved, written as if the level author were a client.

Constraints: use a local or testnet instance, include the exact vulnerable line, and explain the invariant that the exploit violates. Do not copy the official walkthrough; write your own reproduction.

Deliverable: a PDF or Markdown report with summary, severity table, per-finding root cause, proof-of-concept test, and recommended fix. This is portfolio-worthy because it shows communication, not just exploitation.

### Project 2: Build a vault with invariants and fuzz tests

Objective: implement a tokenized vault and prove its core invariants with Foundry and Echidna.

Constraints: support deposits, withdrawals, and an exchange rate; include a fee-on-transfer token in tests; keep the code small enough to review. Write invariants such as "no user can withdraw more than their shares are worth" and "total assets equal the measured token balance."

Deliverable: a public repository with the contract, unit tests, fuzz tests, invariant tests, a short threat model, and a README explaining which invariants passed and which exposed bugs. This demonstrates engineering maturity and is the strongest entry-level artifact for audit roles.

### Project 3: Historical incident reconstruction on a local fork

Objective: study a public postmortem of a DeFi incident and reproduce the root cause on a local fork at a historical block.

Constraints: never interact with mainnet contracts or real funds; use a public RPC only to read state; keep the exploit high-level and focused on the missing check. Do not publish a step-by-step drain against a live protocol.

Deliverable: a write-up that maps the incident to a vulnerability class, shows the vulnerable code path, proposes two independent mitigations, and lists detection signals that would have caught it. End with a disclosure and ethics note.

## Common mistakes and misconceptions

- Believing that "the compiler checks it" means the contract is safe. Logic and economics are not compiler concerns.
- Using `tx.origin` for authorization, which enables phishing-style relay attacks.
- Adding a reentrancy guard but leaving state updates after external calls in other functions.
- Trusting a spot price from a single AMM pool without considering flash-loan manipulation.
- Writing an upgradeable contract without checking storage layout or protecting the initializer.
- Treating a static analyzer's output as a finished audit, or ignoring false positives without triage.
- Testing only the happy path and never encoding invariants that must hold under arbitrary call orders.
- Deploying to mainnet to "test" with real funds, or exploiting a live bug instead of disclosing it.

## Career paths and roles

Smart contract auditors review code for protocols, usually on a project or contest basis. Protocol security engineers work inside a team on reviews, monitoring, incident response, and tooling. Blockchain security researchers study novel attack classes and publish analyses. Application security engineers with Web3 experience cover wallets, custody, and backend services. Compliance and investigations roles focus on tracing and policy rather than code.

Entry is possible without a formal security title if you can show audit reports and test code. Competitive audit platforms let you practice on real code with public findings, but read their rules and never disclose a live bug outside the program. Expect interviews to include a code review exercise, a Foundry test, and questions about a historical exploit.

## Next steps

- Complete ten Ethernaut levels and write a short report for each.
- Set up Foundry, deploy to a local Anvil chain, and rewrite one exercise with invariant tests.
- Read the Solidity security considerations and the SWC entries for reentrancy, access control, and delegatecall.
- Audit a small open-source contract with permission or a deliberately vulnerable codebase, then request peer review.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and [practical projects](../../practical-projects/README.md).

## References

- Ethereum Foundation, [Smart contract security](https://ethereum.org/en/developers/docs/smart-contracts/security/).
- Solidity team, [Security considerations](https://docs.soliditylang.org/en/latest/security-considerations.html).
- SWC Registry, [Smart Contract Weakness Classification](https://swcregistry.io/).
- Trail of Bits, [Building Secure Contracts](https://secure-contracts.com/).
- OpenZeppelin, [Contracts documentation](https://docs.openzeppelin.com/contracts/5.x/).
- Foundry, [Foundry Book](https://book.getfoundry.sh/).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
