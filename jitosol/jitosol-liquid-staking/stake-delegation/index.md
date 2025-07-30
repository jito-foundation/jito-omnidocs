---
title: 'Stake Delegation'
order: 2
section_type: 'page'
subtitle: 'JitoSOL delegation criteria and methodology'
---

## Overview

The aim of Jito's Liquid Staking is to decentralize the network and improve the performance of the Solana blockchain. Validators that meet the minimum criteria may become eligible for a stake delegation. Stakenet automates this process using transparent scoring algorithms and safety mechanisms.

See current delegates at [jito.network/stakepool](https://www.jito.network/stakepool/Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb/).

## Delegation requirements

Validators must meet all of the following binary criteria to be eligible for delegation (subject to change):

- Run the Jito MEV-enabled client (have MEV commission in the last 10 epochs)
- MEV commission ≤ 10% (evaluated over the last 10 epochs)
- Validator commission ≤ 5% (evaluated over the last 30 epochs)
- Historical commission ≤ 50% (across all validator history)
- Not belong to the validator superminority (top 33.3% of total stake)
- Not run unsafe consensus modifications
- Not blacklisted by governance
- Maintain ≥ 5 epochs of continuous voting with ≥ 5,000 SOL minimum stake
- Vote on ≥ 85% of expected slots (evaluated over the last 30 epochs)

Failing any single criterion results in an overall score of zero, making the validator ineligible for delegation.

## Scoring mechanism

Validators that pass all binary criteria are ranked using a performance-based yield score:

```
yield_score = (average_vote_credits / average_blocks) * (1 - commission)
```

Where:
- `average_vote_credits` = vote credits earned over the last 30 epochs
- `average_blocks` = total blocks produced by the cluster over the last 30 epochs  
- `commission` = maximum commission over the last 30 epochs (as decimal, e.g., 0.05 for 5%)

The overall score is calculated as the product of all binary eligibility factors and the yield score. The top 200 validators by overall score are selected for delegation in each 10-epoch cycle.

## Delegation methodology

- Each selected validator receives a target allocation of 1/200th of the total pool
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

- Delinquency: Voting on less than 70% of expected slots (lower threshold than the 85% scoring requirement)
- Commission manipulation: Increasing commission above 5% or MEV commission above 10%
- Blacklist addition by governance

Validators meeting these criteria are unstaked within the same epoch, subject to the 10% cap.

## Parameters and transparency

All delegation parameters are stored on-chain and can be viewed at [jito.network/stakenet/steward/config](https://jito.network/stakenet/steward/config) or queried using the steward CLI.

Changes to delegation requirements and parameters may occur based on Jito DAO governance decisions. The community will be notified in advance of any significant changes.

## Questions

For questions or feedback on the delegation process, please visit the #stake-pool-delegation channel on [Jito's Discord](https://discord.gg/jito).

