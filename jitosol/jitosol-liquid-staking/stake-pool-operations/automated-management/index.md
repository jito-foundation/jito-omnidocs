---
title: 'Automated Management via Stakenet'
order: 1
section_type: 'page'
subtitle: 'How JitoSOL stake moves automatically'
---

Over time, as people deposit SOL into the reserve, or as validator performance varies, it becomes necessary to move stake around. Jito now uses **Stakenet** – a blend of on-chain programs and off-chain "keepers" – to automatically manage JitoSOL's stake distribution across validators.

## Design Principles

**On-chain decision making**  
The Steward and Validator History programs manage stake allocation decisions directly on Solana, ensuring transparency and verifiability.

**Community governance**  
All system parameters can be adjusted through Jito DAO governance, allowing the community to influence delegation criteria and safety mechanisms.

**Decentralized execution**  
Multiple independent keepers execute the system's decisions, removing single points of failure while maintaining network health and optimal yields.

## Evolution from the previous stake-bot

The original **Kobe** system was an automated off-chain service that stored network information about validators and delegated stake according to each validator's performance. While functional, this approach had limitations:

* Centralized signing authority  
* Off-chain logic that was harder to audit  
* Limited community visibility into decision-making

Stakenet addresses these limitations with an on-chain-first design where logic is transparent and keepers are permissionless.

## Stakenet architecture

| Component | Function | Location |
|-----------|----------|----------|
| Validator History Program | Stores up to 512 epochs of validator performance, commission, and MEV data | On-chain program |
| Steward Program | Evaluates validators, determines target stake allocations, and manages rebalancing via a state machine | On-chain program |
| Keeper Bot | Executes the permissionless transactions required by the Steward and uploads validator data | Off-chain service (Docker or binary) |

The system operates with on-chain programs making decisions and off-chain keepers executing those decisions.

## How stake rebalancing works

1. **Scoring phase** – Every 10 epochs, the Steward evaluates over 1,000 validators
2. **Target calculation** – The top 400 validators (configurable) are selected, each receiving an equal target allocation
3. **Monitoring** – Keepers continuously update validator performance data
4. **Instant unstake evaluation** – Each epoch, validators that meet certain negative criteria are marked for immediate removal from the pool
5. **Rebalancing** – Keepers execute stake delegation and undelegation transactions to move validators toward their targets, subject to safety caps
6. **Cycle repetition** – The process continues until the next scoring phase

All parameters governing this process are stored on-chain and can be modified through Jito DAO governance.

## Running a keeper 

Community members can optionally run their own keepers. See the [Keeper Quick-Start guide](/stakenet/jito-steward/developers/keeper-bot-quick-start/) for detailed setup instructions.

## Monitoring and transparency

* Current parameters: <https://www.jito.network/stakenet/steward/config/>  
* StakeNet Steward dashboard: <https://www.jito.network/stakenet/steward/>
* StakeNet History dashboard: <https://www.jito.network/stakenet/history/>
* Event API: `https://kobe.mainnet.jito.network/api/v1/steward_events` 