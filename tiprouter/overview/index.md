---
title: Jito Tip Router
order: 0
subtitle: ''
section_type: page
---

Jito Tip Router NCN will assume programmatic operations related to the distribution of MEV tips generated from the Jito Tip Distribution protocol every epoch, and, as part of these programmatic operations, will route some portion of all MEV tips collected to the DAO treasury and the NCN network participants.

## Overview

Jito Tip Router NCN is handling operation of distribution of MEV tips generated from the Jito Tip Distribution protocol. The system is made of 3 components: 

- Onchain NCN program
- Node Operator Client
- Permissionless Cranker

### Onchain NCN Program (Jito Tip Router Program):

Onchain NCN program has several components:

- Pricing
  - Switchboard determines the relative weight of assets ( JitoSOL, JTO, ... ) deposited in all the Vaults linked to this Jito Tip Router NCN.

- Snapshot
  - Take snapshots of Operator and Vault per epoch.

- Core Logic (Consensus)
  - Prepare Ballot Box, all votes would be collected here. 
  - Each operator calculate the merkle tree to produce merkle root then cast vote with produced merkle root.
  - After consensus reached with more than 2/3, cranker can upload the merkle tree of each validator.

- Reward Payment

### Node Operator Client

- Node operators will compute a `meta merkle root` — a merkle root derived from a new merkle tree containing all validator merkle trees.
- Upload `meta merkle root` on-chain.


### Permissionless Cranker

- Take snapshots of Operator and Vault per epoch.


![alt text](/shared/images/tiprouter/overview.png)
*Figure: Overview of the Jito Tip Router*


## Addresses

| Network | Program    | Address                                      | Version   |
|---------|------------|----------------------------------------------| --------- |
| Mainnet | Tip Router | RouterBmuRBkPUbgEDMtdvTZ75GBdSREZR5uGUxxxpb  | 0.0.1     |


## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE.md](https://github.com/jito-foundation/jito-tip-router/blob/master/LICENSE-MIT) file for details.
