---
title: 'Stake Delegation'
order: 2
section_type: 'page'
subtitle: 'JitoSOL is delegated to validators based on high performance and network resiliency'
---


### Overview

The aim of Jito Foundation's Liquid Staking is to decentralize the network and improve the performance of the Solana Blockchain. Validators which meet the minimum criteria may become eligible for a stake delegation.

See the current delegates [here](https://www.jito.network/stakepool/Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb/).

### Delegation Goals
- Support high quality network operators.
- Improve Solana's decentralization. Jito does not delegate within the superminority.
- Deliver high yields to JitoSOL holders to incentivize increasing stake on the network
- Encourage the adoption of the Jito-Solana's validator client. This client benefits the network by increasing staking yields and discouraging spam

### Delegation Requirements

There may be changes to the delegation requirements and/or weights over time based on tokenholder voting. Changes will be communicated in advance along with significant shifts in stake weight.

High level, validators must meet a set of binary criteria (step 1). The top 200 validators meeting those criteria will then be selected for delegation (step 2).

In order to receive a delegation, validators must meet the following requirements: 

- Run MEV-enabled client
- Retain a MEV commission rate ≤ 10%
- Not belong to the validator superminority
- Not run unsafe consensus modifications

### Scoring Mechanism
- Validators that pass the above criteria will be ranked on performance. The top 200 will be chosen for delegation. If 200 validators do not meet the binary criteria, the pool will be split across all those who do.
- The performance score is average epoch credits for the last 20 epochs, adjusted for max validator commission during that period.

### Rebalancing

Pool churn is capped at 7.5% of TVL per every 10 epoch cycle based on performance-based rebalancing. This is required since each stake movement has a negative impact on JitoSOL yield. Unstaking for non-performance reasons has a higher limit.

Criteria for immediate exclusion from the pool

- 0 epoch credits (i.e. delinquent for an entire epoch)
- MEV or validator commission increased to greater than 10%
- Validators behaving maliciously. This includes tip stealing and vote lagging

Performance Rebalancing

- Unstake up to 7.5% of the pool in the following order: (i) Validators no longer ineligible, (ii) lowest performance score
- Stake application: Using the available deposits from unstaking, stake is applied in order of performance score to the highest rated validators based on performance until each is at the target delegation (JitoSOL TVL / 200).

<u>Sample Scores:</u>

Here are scores for all validators starting from epoch 480 ([<u>link</u>](https://docs.google.com/spreadsheets/d/1EIqeYB323f2JppzB49bZlEg0XfjfH02882GNMKgcEKA/edit?usp=sharing)). This sheet will be updated every 10 epochs. You can check your fulfillment of the binary criteria and performance rank versus others. A more formal UI will be developed over time but this should provide transparency in the interim.

### StakeNet

JitoSOL is moving to a novel stake pool management product: Jito StakeNet. Please see this [blog post](https://www.jito.network/blog/a-deep-dive-into-stakenet/) for details. This will be transitioned in over the next 1-2 months.

### Questions

For questions or feedback on this process, please ask in the #stake-pool-delegation channel of Jito’s Discord ([<u>link</u>](https://discord.gg/jito)). We’d like to understand how validators feel about this system and how it could be improved.

