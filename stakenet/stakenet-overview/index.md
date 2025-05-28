---
title: Steward Program Documentation
order: 0
subtitle: ''
section_type: page
---

_Note: documentation for the Validator History program is a work in progress. Please see the top level [README](https://github.com/jito-foundation/stakenet/blob/master/README.md) for more information._

# Steward Program

The Steward Program is an Anchor program designed to manage the staking authority for a SPL Stake Pool. Using on-chain [validator history](https://github.com/jito-foundation/stakenet) the steward selects a set of high-performing validators to delegate to, maintains the desired level of stake on those validators over time, and continuously monitors and re-evaluates the validator set at a set cadence. Initially, the validator selection is customized for the JitoSOL stake pool criteria and will be deployed to manage that stake pool. Additionally, the steward surfaces this staking algorithm through variable parameters to be decided by [Jito DAO](https://gov.jito.network/dao/Jito). In turn, this greatly decentralizes the stake pool operations.

The core operations of the Steward Program are permissionless such that any cranker can operate the system. However there are some admin abilities that allow for tweaking parameters and system maintenance.

## Table of Contents

1. [Program Overview](/stakenet/program-overview/)
2. [Terminology](/stakenet/terminology/)
3. [Parameters](/stakenet/parameters/)
4. [StakeNet UI](/stakenet/ui/) (work in progress)
5. Developers
   - [Command-line interface](/stakenet/developers/cli/)
   - [Events API](/stakenet/developers/api/)
   - [Running a Keeper](/stakenet/developers/keeper-bot-quick-start/)
6. Advanced Concepts
   - [SPL Stake Pool Internals](/stakenet/advanced/spl-stake-pool-internals/)
   - [Validator States](/stakenet/advanced/managing-validator-states/)
7. [Governance](/stakenet/governance/)
8. [Validator FAQ](/stakenet/faq/) (work in progress)
