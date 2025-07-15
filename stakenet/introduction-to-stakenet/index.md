---
title: Introduction to Stakenet
order: 0
subtitle: ''
section_type: page
---

Jito StakeNet is a decentralized Solana stake pool manager, blending Validator History and Steward Programs for secure, transparent validator management and autonomous stake operations.

## Jito Steward Program

The Steward Program is an Anchor program designed to manage the staking authority for a SPL Stake Pool.
Using on-chain [validator history](/stakenet/validator-history/program-overview/) the steward selects a set of high-performing validators to delegate to, maintains the desired level of stake on those validators over time, and continuously monitors and re-evaluates the validator set at a set cadence.
Initially, the validator selection is customized for the JitoSOL stake pool criteria and will be deployed to manage that stake pool.
Additionally, the steward surfaces this staking algorithm through variable parameters to be decided by [Jito DAO](https://gov.jito.network/dao/Jito).
In turn, this greatly decentralizes the stake pool operations.

The core operations of the Steward Program are permissionless such that any cranker can operate the system. However there are some admin abilities that allow for tweaking parameters and system maintenance.

### Table of Contents

1. [Program Overview](/stakenet/jito-steward/program-overview/)
2. [Parameters](/stakenet/jito-steward/parameters/)
3. [StakeNet UI](/stakenet/jito-steward/ui/) (work in progress)
4. Developers
   - [Command-line interface](/stakenet/jito-steward/developers/cli/)
   - [Events API](/stakenet/jito-steward/developers/api/)
   - [Running a Keeper](/stakenet/jito-steward/developers/keeper-bot-quick-start/)
5. Advanced Concepts
   - [SPL Stake Pool Internals](/stakenet/jito-steward/advanced/spl-stake-pool-internals/)
   - [Validator States](/stakenet/jito-steward/advanced/managing-validator-states/)
6. [Governance](/stakenet/jito-steward/governance/)
7. [Validator FAQ](/stakenet/jito-steward/faq/) (work in progress)


## Validator History Program

This program can store three years of history for every validator on the network.
This data currently includes vote credits, commission, MEV commission, validator version, client type, and can be expanded in the future.
By providing a transparent and cryptographically verified record of past actions, it becomes possible both for users and on-chain programs to make informed decisions about validator behavior.

### Table of Contents

1. [Program Overview](/stakenet/validator-history/program-overview/)
2. [Key Features & Capabilities](/stakenet/validator-history/key-features/)
3. [Technical Architecture](/stakenet/validator-history/technical-architecture/)
4. [Data Fields Explained](/stakenet/validator-history/data-fields/)
5. [Integration & Composability](/stakenet/validator-history/integration/)
6. [Developers](/stakenet/validator-history/developers/)

