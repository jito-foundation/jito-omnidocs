---
title: NCN Components
order: 20
subtitle: The three essential components that work together to create a Node Consensus Network
section_type: page
---

## NCN Components

To run an NCN, you need one or more of each of the following three components, which interact with each other: Vaults, Operators, and the NCN Program itself.

### 1. Vaults

Vaults are accounts that hold tokens and delegate them to operators. They play a crucial role in the NCN by:

1. Holding the tokens used for staking.
2. Delegating stake (voting power) to chosen operators.
3. Enabling stake-weighted participation in the network's governance.

### 2. Operators

Operators are accounts that receive delegated stake from vaults and actively participate in the voting process. Their key functions are:

1. Receiving stake delegations from one or more vaults.
2. Casting votes on behalf of the delegated stake during consensus rounds.
3. Forming the network of active participants who drive the consensus process.

### 3. NCN Program

The NCN Program is the core on-chain component of the system. It's the smart contract that NCN developers build and deploy. Its main responsibilities are:

1. Storing the global configuration parameters for the NCN instance.
2. Maintaining the registry of participating vaults and supported token types.
3. Managing the state for each voting epoch (consensus cycle). 