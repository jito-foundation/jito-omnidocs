---
title: Introduction
order: 0
subtitle: Overview of Node Consensus Networks and the NCN template
section_type: page
---

## Introduction

The Node Consensus Network (NCN) is a robust blockchain consensus system built on Solana. It enables network participants to agree on critical network decisions using a secure, stake-weighted voting mechanism. This system utilizes Jito's restaking infrastructure, allowing operators with delegated tokens to vote on network parameters and states.

This tutorial will focus on a [pre-built NCN program](https://github.com/jito-foundation/ncn-template) that acts like a template or base that you can use to create your own NCN program. To help you understand how it works, we will walk through building a simulation test that covers the majority of its setup and functionality. We do not recommend most NCN developers build an NCN from scratch. Rather, we suggest using this prebuilt program as a starting point and customizing it according to your needs.

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

#### 3. NCN program

The NCN Program is the core on-chain component of the system. It's the smart contract that NCN developers build and deploy. Its main responsibilities are:

1. Storing the global configuration parameters for the NCN instance.
2. Maintaining the registry of participating vaults and supported token types.
3. Managing the state for each voting epoch (consensus cycle).