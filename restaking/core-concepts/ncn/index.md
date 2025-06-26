---
title: "NCN"
subtitle: "An overview of the Node Consensus Network (NCN) component."
section_type: "page"
order: 30
---

## Overview

A Node Consensus Network (NCN) is a decentralized service or network that reaches onchain consensus on offchain data or workloads. This may include oracles, DePIN services, bridges, co-processors, or new chains. NCNs represent one of the core components in the Jito Restaking ecosystem, alongside Operators and Vaults.

It is one of typical NCN design (On-Chain NCN Program), so every NCN does not have to follow this design.

### Key functionalities include:

- **Authority Management**: Designate and validate admins for various NCN operations
- **Operator and Vault Tracking**: Manage relationships with operators and vaults through mutual opt-in mechanisms
- **Consensus Coordination**: Facilitate onchain consensus on offchain execution results
- **Reward Distribution**: Calculate and distribute rewards to participating operators, vaults and stakers
- **Asset Weight Management**: Define supported tokens and their respective weights in the network

## On-Chain NCN Program Components

NCN consists of several key components that work together to provide decentralized services:

### Pricing
- Defines supported tokens and their respective weights in the network, determining how different assets are valued within the NCN ecosystem
- Manages token weight tables that influence voting power and reward distribution
- Controlled by the `weight_table_admin` role

### Snapshot
- Captures the current state of Vaults, Operators, and Operator Stake Weights at specific intervals to establish consensus baselines
- Creates a frozen, point-in-time view of the network's state for consistent voting
- Includes `EpochSnapshot` accounts to track total stake weight and participant counts
- Records individual `OperatorSnapshot` accounts for each operator's delegated stake weights

### Core Logic
- Implements the fundamental consensus mechanisms that govern how nodes participate and validate output within the network
- Handles vote tallying and determines when consensus thresholds are reached
- Manages epoch transitions and consensus finalization
- Defines slashing conditions and enforcement logic

### Reward Payments
- Manages how rewards are calculated and distributed to participating operators, vaults and stakers based on their contributions to the network
- Implements stake-weighted reward distribution mechanisms
- Handles fee collection and distribution according to NCN-specific logic
- Coordinates with the restaking program for reward processing

## Key Components

### 1. NCN Structure

The NCN account structure is designed to handle various administrative and operational roles within the network:

| Field               | Type   | Description                                          |
| ------------------- | ------ | ---------------------------------------------------- |
| base                | Pubkey | The base account used as a PDA seed.                 |
| admin               | Pubkey | Overall administrator of the NCN.                    |
| operator_admin      | Pubkey | Admin responsible for managing operators.            |
| vault_admin         | Pubkey | Admin responsible for managing vaults.               |
| slasher_admin       | Pubkey | Admin responsible for managing slashers.             |
| delegate_admin      | Pubkey | Admin for delegating assets of NCN account.          |
| metadata_admin      | Pubkey | Admin responsible for NCN metadata updates.          |
| weight_table_admin  | Pubkey | Admin for managing asset weight tables.              |
| ncn_program_admin   | Pubkey | Admin for on-chain programs associated with the NCN. |
| index               | u64    | Index of the NCN account.                            |
| operator_count      | u64    | Number of operators registered with the NCN.         |
| vault_count         | u64    | Number of vaults registered with the NCN.            |
| slasher_count       | u64    | Number of slashers registered with the NCN.          |

### Finding NCN PDA

```rust
use jito_restaking_core::ncn::Ncn;

let program_id = jito_restaking_program::id();
let base_pubkey = pubkey!("base pubkey here");
let ncn_pubkey = Ncn::find_program_address(&program_id, &base_pubkey).0;
```

## Node Operator Client

The Node Operator Client represents the core off-chain logic of the NCN. This is where the actual work and computation happens that the NCN is designed to coordinate and secure.

Key characteristics:
- Runs arbitrary computation as defined by the NCN's specific requirements
- Posts data on-chain through custom instructions
- Signs transactions using the operator keypair
- Executes the offchain services that the NCN was designed to provide

### Sample Node Operator Clients:

- [Tip Router Operator Client](https://github.com/jito-foundation/jito-tip-router/blob/master/tip-router-operator-cli/Cargo.toml) - Handles tip routing calculations and submissions
- [Solana Merkle Root Uploader](https://github.com/jito-foundation/jito-solana/blob/master/tip-distributor/src/bin/merkle-root-uploader.rs) - Uploads merkle roots for tip distribution
- [Stakenet Keeper](https://github.com/jito-foundation/stakenet/blob/master/keepers/stakenet-keeper/src/main.rs) - Manages stakenet operations and state transitions

## Permissionless Cranker

For all of the permissionless operations that need to occur on a regular cycle, NCNs require a client that continually executes instructions to maintain network health and progression.

Functions include:
- Triggering epoch transitions and snapshots
- Processing routine maintenance operations
- Executing time-sensitive consensus operations
- Managing account cleanup and optimization

### Sample Permissionless Cranker:

- [Jito Tip Router Keeper](https://github.com/jito-foundation/jito-tip-router/blob/master/cli/src/keeper/mod.rs) - Automated keeper for tip router operations

## NCN Operation Cycle

NCNs operate in continuous cycles that involve:

1. **Setup Phase**: Establishing relationships with operators and vaults through mutual opt-in
2. **Snapshot Phase**: Capturing network state for consistent consensus baselines
3. **Execution Phase**: Operators perform offchain work and submit results
4. **Consensus Phase**: Onchain vote tallying and consensus determination
5. **Reward Phase**: Distribution of rewards based on performance and stake weights
6. **Maintenance Phase**: Account cleanup and network parameter updates

## Administrative Roles

NCNs use a sophisticated role-based access control system:

- **Primary Admin**: Overall control and high-level governance
- **Operator Admin**: Manages operator approvals and relationships
- **Vault Admin**: Manages vault approvals and delegation relationships
- **Slasher Admin**: Manages slashing logic and enforcement
- **Delegate Admin**: Handles asset delegation from NCN accounts
- **Metadata Admin**: Updates NCN configuration and metadata
- **Weight Table Admin**: Manages token weights and pricing parameters
- **NCN Program Admin**: Controls associated onchain programs
