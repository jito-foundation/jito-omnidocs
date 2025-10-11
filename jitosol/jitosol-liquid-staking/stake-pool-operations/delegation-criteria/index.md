---
title: 'Delegation Criteria'
order: 2
section_type: 'page'
subtitle: 'JitoSOL delegation criteria and methodology'
---

## Overview

The aim of Jito's Liquid Staking is to decentralize the network and improve the performance of the Solana blockchain. Validators that meet the minimum criteria may become eligible for a stake delegation. Stakenet automates this process using transparent scoring algorithms and safety mechanisms.

See current delegates at [jito.network/stakepool](https://www.jito.network/stakepool/Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb/).

## Delegation requirements

Validators must meet all of the following binary criteria to be eligible for delegation (subject to change):

- Run the Jito MEV-enabled client (have MEV commission in the last 30 epochs)
- MEV commission ≤ 10% (evaluated over the last 30 epochs)
- Validator commission ≤ 5% (evaluated over the last 30 epochs)
- Historical commission ≤ 50% (across all validator history)
- Not belong to the validator superminority (top 33.3% of total stake)
- Not run unsafe consensus modifications
- Using acceptable Tip Distribution merkle root upload authority (TipRouter or OldJito)
- Using acceptable Priority Fee merkle root upload authority
- Not blacklisted by governance
- Maintain ≥ 5 epochs of continuous voting with ≥ 5,000 SOL minimum stake
- Vote on ≥ 97% of expected slots in each of the last 30 epochs

Failing any single criterion results in an overall score of zero, making the validator ineligible for delegation.

## Scoring mechanism

Validators that pass all binary criteria are ranked using a 4-tier hierarchical scoring system. The score is encoded as a 64-bit value with the following priority order:

1. **Inflation commission** (highest priority): Lower commission validators are always preferred
2. **MEV commission**: Among validators with equal inflation commission, lower MEV commission is preferred
3. **Validator age**: Among validators equal on commissions, older validators (more epochs with vote credits) are preferred
4. **Vote credits ratio**: Among validators equal on all above, higher performance is preferred

The 4-tier score ensures that differences in higher-priority tiers (like inflation commission) always dominate lower-priority tiers. This raw score is then multiplied by all binary eligibility factors - if any factor is zero, the final score becomes zero.

The top 400 validators by overall score are selected for delegation in each 10-epoch cycle.

## Delegation methodology

- Each selected validator receives a target allocation of 1/400th of the total pool
- Target allocations are percentage-based and scale automatically with pool growth
- New deposits increase all validators' target stake proportionally

## Rebalancing and safety caps

To protect JitoSOL yield, the system limits the amount of stake that can be moved per cycle:

| Rebalancing type | Maximum unstake per cycle |
|------------------|---------------------------|
| Performance-based rebalancing | 7.5% of total pool |
| Instant unstake triggers | 10% of total pool |
| Stake deposit management | 10% of total pool |

Priority is given to removing stake from the lowest-performing validators first.

## Instant unstaking criteria

The system evaluates validators each epoch for immediate removal based on:

- Delinquency: Voting on less than 70% of expected slots (lower threshold than the 97% scoring requirement)
- Commission manipulation: Increasing commission above 5% or MEV commission above 10%
- Blacklist addition by governance
- Using unacceptable Tip Distribution merkle root upload authority
- Using unacceptable Priority Fee merkle root upload authority

Validators meeting any of these criteria are unstaked within the same epoch, subject to the 10% cap.

## Parameters and transparency

All delegation parameters are stored on-chain and can be viewed at [jito.network/stakenet/steward/config](https://www.jito.network/stakenet/steward/config) or queried using the steward CLI.

Changes to delegation requirements and parameters may occur based on Jito DAO governance decisions. The community will be notified in advance of any significant changes.

## Questions

For questions or feedback on the delegation process, please visit the #stake-pool-delegation channel on [Jito's Discord](https://discord.gg/jito). 