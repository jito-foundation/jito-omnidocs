---
title: "Overview"
subtitle: "An overview of the NCN design."
section_type: "page"
order: 0
---

It is one of typical NCN design (On-Chain NCN Program), so every NCN does not have to follow this design.

## On-Chain NCN Program

NCN consisits of several components:

- [Pricing](/restaking/ncn-design/on-chain-ncn/pricing)
    - Defines supported tokens and their respective weights in the network, determining how different assets are valued within the NCN ecosystem.
- [Snapshot](/restaking/ncn-design/on-chain-ncn/snapshot)
    - Captures the current state of Vaults, Operators, and Operator Stake Weights at specific intervals to establish consensus baselines.
- [Core Logic](/restaking/ncn-design/on-chain-ncn/core-logic)
    - Implements the fundamental consensus mechanisms that govern how nodes participate and validate output within the network.
- [Reward Payments](/restaking/ncn-design/on-chain-ncn/reward-payments)
    - Manages how rewards are calculated and distributed to participating operators, vaults and stakers based on their contributions to the network.


## Node Operator Client

This is the core off-chain logic of the NCN. 
It will run some arbitrary computation, and post some data on chain to a custom instruction, signing the transaction with the operator keypair.

Sample Node Operator Client:

- [Tip Router Operator Client](https://github.com/jito-foundation/jito-tip-router/blob/master/tip-router-operator-cli/Cargo.toml)
- [Solana Merkle Root Uploader](https://github.com/jito-foundation/jito-solana/blob/master/tip-distributor/src/bin/merkle-root-uploader.rs)
- [Stakenet Keeper](https://github.com/jito-foundation/stakenet/blob/master/keepers/stakenet-keeper/src/main.rs)


## Permissionless Cranker

For all of the permissionless operations that need to occur on a regular cycle, we need a client that is continually executing instructions.

Sample Permissionless Cranker:

- [Jito Tip Router Keeper](https://github.com/jito-foundation/jito-tip-router/blob/master/cli/src/keeper/mod.rs)
