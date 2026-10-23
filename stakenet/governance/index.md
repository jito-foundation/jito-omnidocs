---
title: StakeNet Governance
order: 2
subtitle: ''
section_type: page
---

## JIP-33

JIP-33 proposes a strategic partnership between Jito Network and Coinbase to integrate JitoSOL into Coinbase's product ecosystem.
Key components include mint/burn functionality for SOL-to-JitoSOL conversion in the Coinbase app, USD loan products against JitoSOL collateral, JitoSOL availability on the Base network, and directed stake to Coinbase-operated validators under the JIP-27 framework.
Coinbase validators would run the BAM client with relaxed commission restrictions (5% on rewards, 10% on tips).

Proposal: [JIP-33 Forum Post](https://forum.jito.network/t/jip-33-a-jito-x-coinbase-collaboration/923)

---

## JIP-28

JIP-28 proposes accelerating BAM (Block Assembly Marketplace) adoption by allocating JitoSOL stake to validators running BAM software.
It introduces a tiered delegation schedule that increases BAM stake allocations as network adoption grows, ultimately transitioning to 100% BAM stake once full adoption is reached.
This proposal motivated the introduction of the `running_bam_score` binary eligibility criterion in the Steward program.

Proposal: [JIP-28 Forum Post](https://forum.jito.network/t/jip-28-accelerate-bam-adoption/904)

---


## JIP-27

JIP-27 introduces directed staking to the JitoSOL stake pool, allowing large JitoSOL holders (initially ≥100k JitoSOL) and whitelisted DeFi protocols to direct their stake to specific validators of their choice.
Validators must meet objective eligibility criteria to qualify for directed stake. A protective floor ensures a minimum amount of SOL remains in non-directed, permissionless delegation.
See [Directed Staking](/stakenet/jito-steward/directed-staking/) for how this is implemented in the Steward program.

Proposal: [JIP-27 Forum Post](https://forum.jito.network/t/jip-27-introduce-directed-staking-to-the-jito-stake-pool/903)

---

## JIP-25

JIP-25 expands and reforms the JitoSOL validator delegation system.
Key changes include: expanding the active validator set from 200 to 400, revising the ranking criteria to prioritize commission rate, MEV commission, and validator age (with vote credits as a final tiebreaker), extending the MEV commission reference period from 10 to 30 epochs to reduce gaming, and pausing the priority fee sharing implementation from JIP-16.

Proposal: [JIP-25 Forum Post](https://forum.jito.network/t/jip-25-expand-the-validator-set-and-modify-jito-stake-pool-eligibility-and-ranking-criteria/877)

---


## JIP-16

JIP-16 upgrades TipRouter to distribute Solana priority fees (in addition to MEV tips) and adjusts StakeNet to factor in priority fee sharing as a delegation eligibility criterion.
It introduces Tip Distribution Account v2 (TDA v2) to handle priority fee collection and distribution, and requires validators to share at least 50% of priority fees to qualify for JitoSOL delegation.
The DAO receives 1.5% of distributed priority fees.

Proposal: [JIP-16 Forum Post](https://forum.jito.network/t/jip-16-tiprouter-and-stakenet-adjustments-for-priority-fees/640)

---


## JIP-3

JitoSOL was transitioned to management by StakeNet via the JIP-3 proposal. This proposal includes information on the motivation, transition plan, costs, and community discussion.

Proposal: [JIP-3 Forum Post](https://forum.jito.network/t/jip-3-transfer-of-jito-stake-pool-management-to-stakenet-protocol-development/309)

DAO Vote: [JIP-3 Realms](https://gov.jito.network/dao/Jito/proposal/CTaYLKaPw7gexrjp8gi2aDkG8QJuWzqz6LrySCJoRhyt)
