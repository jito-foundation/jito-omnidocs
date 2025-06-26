---
title: Introduction
order: 0
subtitle: Overview of Node Consensus Networks and the NCN template
section_type: page
---

## Introduction

Node Consensus Networks (NCN) are robust consensus networks built on Solana. They enables network participants to leverage staked assets to agree on critical network decisions. NCNs utilize Jito's restaking infrastructure, allowing operators with delegated tokens to vote on network parameters and states.

This tutorial focuses on a [pre-built NCN program](https://github.com/jito-foundation/ncn-template) that serves as a template or base that you can use to create your own NCN program. To help you understand how it works, we will walk through building a simulation test that covers the majority of its setup and functionality. We do not recommend most NCN developers build an NCN from scratch. Rather, we suggest using this prebuilt program as a starting point and customizing it according to your needs.

By following the simulation test setup in this guide, you will gain hands-on experience with the entire NCN lifecycle: initializing vaults and operators using Jito's restaking and vault programs, configuring the NCN program, and executing the full voting process.

### The purpose of NCNs

Decentralized networks require reliable mechanisms for participants to reach consensus without central authorities. The NCN addresses this need by:

1. Providing a secure voting framework where influence is proportional to the amount of stake held.
2. Supporting multiple token types with configurable voting weights, allowing flexibility in how voting power is assigned.
3. Creating verifiable and immutable records of consensus decisions on the blockchain.
4. Establishing a solid foundation for network governance and parameter setting.

### NCN components

To run an NCN, you need one or more of each of the following three components, which interact with each other: Vaults, Operators, and the NCN Program itself.

#### 1. Vaults

Vaults are accounts that hold tokens and delegate them to operators. They play a crucial role in the NCN by:

1. Holding the tokens used for staking.
2. Delegating stake (voting power) to chosen operators.
3. Enabling stake-weighted participation in the network's governance.

#### 2. Operators

Operators are accounts that receive delegated stake from vaults and actively participate in the voting process. Their key functions are:

1. Receiving stake delegations from one or more vaults.
2. Casting votes on behalf of the delegated stake during consensus rounds.
3. Forming the network of active participants who drive the consensus process.

#### 3. Keepers

Keepers are offchain agents that monitor the network and submit onchain instructions to advance the NCN through its lifecycle. They operate autonomously and are fully permissionless. Their responsibilities include:

1. Monitoring the current onchain state.
2. Executing program instructions to progress through state like voting, post-vote logging and epoch finalization.
3. Emitting metrics or logs to external systems for observability.

#### 4. NCN program

The NCN Program is the core on-chain component of the system. It's the smart contract that NCN developers build and deploy. Its main responsibilities are:

1. Storing the global configuration parameters for the NCN instance.
2. Maintaining the registry of participating vaults and supported token types.
3. Managing the state for each voting epoch (consensus cycle).

### NCN Lifecycle

The Node Consensus Network operates in a well-defined lifecycle that consists of three main phases:

1. **Initial Setup (One-time)**: This phase involves establishing the foundational infrastructure of the NCN. It includes:

   - Configuring the NCN parameters
   - Initializing the vault registry
   - Registering supported token types and assigning weights

     The initial setup is performed only once when the NCN is first deployed, with occasional administrative updates as needed (such as adjusting token weights or adding new supported tokens).

2. **Snapshotting (Recurring)**: At the beginning of each consensus cycle (epoch), the system captures the current state of all participants:

   - Creating epoch state and weight tables
   - Taking snapshots of operator stake weights
   - Recording vault-operator delegations
   - Calculating total voting power distribution

     This phase ensures that voting is based on a consistent, point-in-time view of the network, preventing manipulation during the voting process.

3. **Voting (Recurring)**: After snapshotting is complete, operators can cast their votes:
   - Operators submit their choices (e.g., weather status)
   - Votes are weighted according to the operator's stake
