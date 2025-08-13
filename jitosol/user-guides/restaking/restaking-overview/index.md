---
title: '(Re)staking Overview'
subtitle: 'Understanding Jito (Re)staking, vaults, NCNs, and node operators'
section_type: 'page'
order: 1
---

## What is Jito (Re)staking?

Jito (Re)staking is liquid staking infrastructure on Solana. It allows external networks to build staking protocol on Solana and enables users to (re)stake JitoSOL and other SPL tokens across these networks, simultaneously. (Re)staked assets provide economic security to these networks and earn rewards, creating opportunities for additional yield beyond traditional staking.

## Terminology

- **Delegation**: The act of assigning staked assets to specific operators within the network.
- **Epoch**: A fixed period in the blockchain during which staking rewards are calculated and distributed.
- **Multi-Asset Staking**: The ability to stake various types of SPL tokens, not limited to native blockchain tokens.
- **Liquid Staking**: A form of staking that provides liquidity to Solana stakers.
- **Node Consensus Network (NCN)**: A set of node operators running software for the same network, working together to achieve consensus and provide services.
- **Node Operator (or Operator)**: A specialized party who runs core functionalities for NCNs, such as performing specific offchain computations and participating in consensus 
- **(Re)staking**: The process of staking already-staked assets, such as liquid staking tokens. E.g. Whereas users can “stake” SOL to NCNs, users can “(re)stake” JitoSOL to NCNs.
- **Staking**: The process of collateraliziung assets to support network operations and earn rewards.
- **Slashing**: A penalty mechanism where a portion of staked assets and/or expected rewards are forfeited if an operator misbehaves or fails to meet performance requirements.
- **SPL Token**: Solana Program Library Token, a standard for creating and managing tokens on the Solana blockchain.
- **Vault**: A smart contract that securely holds staked assets and delegates them to operators.
- **Vault Receipt Token (VRT)**: A tokenized representation of staked assets inside a vault, allowing for liquidity and composability.

## Key Concepts

### Vaults
**What are Vaults?**
Vaults serve as deposit pools that hold SPL tokens (e.g. JitoSOL) and issue vault receipt tokens (VRTs) representing those positions. Users retain ownership of their stake via liquid VRTs, enabling utility and composability in Solana's DeFi ecosystem. VRTs are burned when users withdraw their assets from the vault. 

Vaults opt into supporting specific NCNs and delegate stake to approved operators. Each vault defines key parameters, including how much stake is allocated to each node operator and fees.

### NCNs (Node Consensus Networks)
**What are NCNs?**
NCNs are a set of node operators and onchain programs that reach consensus on offchain workloads and enforce onchain state transitions. In most cases, NCNs will include their own custom onchain programs to handle proof submissions, verify work, and distribute rewards. Consensus can take place onchain or offchain. For example, oracle networks, DePINs, bridges, DeFi apps, or entire blockchains can deploy an NCN to achieve consensus on an arbitrary result and finalize and distribute rewards, payments, and penalties. 

NCNs build custom staking mechanisms and use (re)staked assets for economic security, ensuring node operators have an economic commitment to follow protocol and maintain operation. 

**How NCNs Work:**
- NCNs define an offchain protocol, and node operators opt in to service these operations. 
- (Re)staked assets are delegated to node operators to provide economic security to underlying network operations.
- Each NCN has specific penalties or slashing conditions for node operators.
- NCNs pay rewards to (re)stakers and node operators for participating in the network and following protocol according to established standards.

### Node Operators
Node operators are infrastructure providers that run the offchain protocol for NCNs and are delegated stake. They opt in to serve specific NCNs and receive stake from approved vaults. Operators have no direct control of the stake, and they are usually rewarded in proportion to the stake they have. Operators can serve multiple NCNs simultaneously, enabling efficient resource usage and shared security.

**Node Operator Selection:**
- Through (re)staking, node operators can choose to support multiple networks and accept stake from multiple vaults.
- Performance and reliability are key criteria for selection.
- Operators must maintain good behavior to avoid penalties and/or slashing.

## JitoSOL supported NCNs

Currently you can (re)stake JitoSOL to:
- **TipRouter** - Jito's REV distribution protocol
- **Switchboard** - a decentralized oracle network 
- **Note:** Visit the [Jito (Re)staking website](https://www.jito.network/restaking/) to view other supported assets and NCNs. Additional assets and NCNs will be supported as the protocol expands.

## Using the (Re)staking Interface

### Accessing (Re)staking
1. Navigate to [jito.network/restaking/](https://www.jito.network/restaking/)
2. Connect your Solana wallet (Phantom, Solflare, etc.)
3. Review available vaults and their strategies

![(Re)staking Home Page - Vaults View](/shared/images/jitosol/restaking-home-vaults-view.png)

### Deposit Process Overview

**Two Approaches:**
The (re)staking interface provides a toggle to choose your deposit method:

![(Re)staking Home Page - Assets View](/shared/images/jitosol/restaking-home-assets-view.png)

- **Select Asset First (Tokens):** Choose your token, then select a compatible vault
- **Select Vault First (Vaults):** Choose a vault, then deposit compatible assets

**Steps for Depositing:**
1. **Choose where to stake** - Select your preferred approach via the toggle
2. **Select asset/vault** - Pick your token and compatible vault
3. **Enter deposit amount** - Specify how much to deposit
4. **Review and confirm** - Verify details and execute transaction

**What Happens After Deposit:**
- Your assets are stored securely in the vault smart contract
- You receive VRT tokens representing your proportional share
- VRT tokens are required for managing your position and withdrawals

### Understanding Risks

**Vault-Specific Risks:**
- Strategy execution risk based on vault design
- Liquidity and exit risks during high demand periods if using secondary markets for selling
- Slashing due to operator misbehavior
- Custom vault programs
- Vault fees can be updated by admins

**NCN-Related Risks:**
- Network adoption and usage may affect rewards
- Technical implementation risks from new NCNs
- NCNs may cease operations

**Operator Risks:**
- Performance and reliability of infrastructure providers
- Potential fee changes or policy updates

**Slashing Risk:**
- Your vault assets may be slashed if operators delegated to misbehave or fail to follow NCN rules
- This security feature helps ensure the network remains secure
- The slashing feature may or may not be turned on. Check before you deposit if you are concerned.

## Rewards and Economics

### How You Earn Rewards
Rewards are generated through a combination of:
- **Base staking yields** from the underlying staked assets (if they are staked assets)
- **Additional rewards from NCNs** for providing economic security 
- Exact reward structure varies by vault strategy and supported NCNs

### Fee Structure
**(Re)staking Program Fees:**
- **4% fee on rewards** to fund protocol development
- **0.1% (10 bps) withdrawal fee** for exiting positions

**Vault-Specific Fees:**
- Each vault has different deposit, withdrawal, and reward fee structures
- Always check the specific fee structure before depositing
- Fees vary based on vault strategy and complexity

**Node Operator Fees**
- Each node operator can enforce a fee for their services.

### Withdrawal Process

**Standard Withdrawal (Most Common):**
1. **Initiate withdrawal** - Select amount and start the process
2. **Two-epoch cooldown period** - Wait approximately 4-5 days
3. **Complete withdrawal** - Claim your assets after cooldown

**Why the Waiting Period:**
- The protocol requires a two-epoch cooldown for security
- This helps maintain system stability and protects all deposited assets
- Your funds remain locked during this period

## Security and Audits

**Audit History:**
Jito (Re)staking has been audited by multiple security firms:
- **Ottersec** - Comprehensive (re)staking audit
- **Offside Labs** - (Re)staking vault audit  
- **Certora** - Additional security review

**Security Features:**
- Two-epoch cooldown period for withdrawals
- Multi-signature controls for critical functions
- Regular monitoring and security updates

## Getting Started

### Prerequisites
- Solana wallet (Phantom, Solflare, etc.)
- Supported assets (SOL, JitoSOL, mSOL, bSOL)
- Small amount of SOL for transaction fees
- Understanding of (re)staking risks and **two-epoch withdrawal cooldown**

### Useful Resources
- [(Re)staking Dashboard](https://www.jito.network/restaking/dashboard/) - Monitor your positions
- [Vault Explorer](https://www.jito.network/restaking/vaults/) - Browse available vaults
- [NCN Directory](https://www.jito.network/restaking/ncns/) - View supported networks
- [Node Operator List](https://www.jito.network/restaking/node-operators/) - See infrastructure providers

This overview provides the foundation for understanding Jito (Re)staking. For specific instructions on using the interface, see the individual user guides for depositing and withdrawing. 