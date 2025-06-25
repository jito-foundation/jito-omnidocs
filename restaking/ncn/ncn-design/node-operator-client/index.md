---
title: "Node Operator Client"
subtitle: "The core off-chain logic of the NCN."
section_type: "page"
order: 1
---

This is the core off-chain logic of the NCN. It will run some arbitrary computation, and post some data on chain to a custom instruction, signing the transaction with the operator keypair.

Sample Node Operator Client:

- [Jito Tip Router Operator Client](https://github.com/jito-foundation/jito-tip-router/tree/master/tip-router-operator-cli)
- [solana-merkle-root-uploader](https://github.com/jito-foundation/jito-solana/blob/837300fa58cb450e041443bafc6e21a7ee8f15b7/tip-distributor/src/bin/merkle-root-uploader.rs)
- [stakenet-keeper](https://github.com/jito-foundation/stakenet/blob/master/keepers/stakenet-keeper/src/main.rs)
