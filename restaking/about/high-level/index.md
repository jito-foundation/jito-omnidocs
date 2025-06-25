---
title: "High-Level Overview"
subtitle: "A high-level overview of the Jito Restaking architecture."
section_type: "page"
order: 1
---

## Jito Restaking Architecture Overview

The Jito (Re)Staking protocol facilitates the relationship between three components:

- [NCN](/restaking/ncn)
- [Operator](/restaking/operator)
- [Vault](/restaking/vault)

![Active](/shared/images/restaking/active_stake.png)
*Figure 1: Active Relationship State - Visual representation of the three-way relationship between NCN, Operator, and Vault components when all have opted in, resulting in activated stake.*

All three components must opt-in to a three-way relationship in order to warm-up and activate a staked relationship.

If any of the three components is not "opt-in", there is no stake i.e. the relationship between each component is inactive. 
Additionally, any component can opt-out of active staked relationships, in which case the protocol will cool down the relationship in the next epoch and deactivate stake. 
Conversely, relationships can be warmed up.

![Inactive](/shared/images/restaking/inactive.png)
*Figure 2: Inactive Relationship State - Visual representation of what happens when one or more components haven't opted in or have opted out, resulting in a deactivated stake.*

Jito (Re)staking is a multi-asset staking protocol for node consensus networks. The system is made of two programs: the
restaking program and the vault program.

The restaking program acts as a node consensus network and operator registry. The program leverages a flexible system of
admins so NCNs can customize the operators and vaults supported and operators can customize the NCNs they stake to and vaults
they can receive delegations from.

The vault program manages the minting and burning of vault receipt tokens (VRTs). VRTs are SPL tokens that represent
a pro-rata stake of assets in the vault. VRTs provide enhanced liquidity, composability, and interoperability with other
Solana programs. The program also leverages a flexible system of admins so vaults can customize the capacity, operators
that can receive delegations from the vault, the NCNs supported by the vault, and the fee structure for staking and unstaking.

### Key Features

- Universal framework for (re)staking SPL tokens to node consensus networks on Solana and SVM chains.
- Staked assets are tokenized into Vault Receipt Tokens (VRT)
- Flexible opt-in from node consensus networks, operators, and vaults for staking.

### Entity Opt-in

The restaking and vault programs are designed to be flexible and allow for easy opt-in from node consensus networks,
operators, and vaults. The following diagram shows the opt-in process for the Jito Restaking Ecosystem:

![alt text](/shared/images/restaking/opt_in.png)
*Figure: Overview of the Jito Restaking Ecosystem*

When a NCN, operator, and vault have all opted-in to each other and the vault has staked assets to the operator, those
assets are considered staked to the NCN. The operator will then be able to participate in the NCN's consensus protocol.
Assuming the vault has opted-in to the slasher.

### Vault Interactions

The following diagram shows the interactions between users, admins, and the vault:

![Vault interactions](/shared/images/restaking/vault_interactions.png)
*Figure: Overview of the Vault Interactions*
