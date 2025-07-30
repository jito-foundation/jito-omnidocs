---
title: 'Restaking Overview'
subtitle: 'Understanding Jito Restaking, vaults, NCNs, and node operators'
section_type: 'page'
order: 1
---

## What is Jito Restaking?

Jito Restaking allows you to stake your assets across multiple networks simultaneously. Your staked assets provide security to these networks and earn rewards in return, creating opportunities for additional yield beyond traditional staking.

## Key Concepts

### Vaults
**What are Vaults?**
- Smart contracts that hold and manage restaked assets
- Each vault supports specific Node Consensus Networks (NCNs) with their own operators, security parameters, and potential rewards
- Users deposit assets and receive Vault Receipt Tokens (VRTs) representing their share

**Vault Types:**
- Single-asset vaults (e.g., SOL-only, JitoSOL-only)
- Multi-asset vaults supporting multiple token types
- Specialized strategy vaults with different risk/reward profiles

**Vault Receipt Tokens (VRTs)**
- Represent your proportional ownership of the vault
- Required for withdrawals and position management
- Can be transferred between wallets
- May be usable in supported DeFi applications
- Are burned when you withdraw your original assets

### NCNs (Node Consensus Networks)
**What are NCNs?**
- Services that provide blockchain infrastructure such as validators, oracles, bridges, and Layer 2 solutions
- Networks that your restaked assets help secure
- Use staking mechanisms to ensure network security and proper operation

**How NCNs Work:**
- Restaked assets provide economic security to these networks
- NCNs pay rewards to stakers for this security service
- Each NCN has specific slashing conditions for operator misbehavior
- Rewards vary based on network usage and demand for security

### Node Operators
**Role of Node Operators:**
- Run infrastructure and software for Node Consensus Networks (NCNs)
- Execute NCN-specific services (validators, oracles, bridges, etc.)
- Receive delegated assets from vaults to secure NCN operations
- Must complete warmup periods before becoming fully active

**Operator Selection:**
- Through restaking, operators can choose to support multiple networks and vault managers
- Performance and reliability are key criteria for selection
- Operators must maintain good behavior to avoid slashing penalties

## Current Supported Assets

Currently you can stake:
- **JitoSOL** - Jito's liquid staking token
- **mSOL** - Marinade's liquid staking token  
- **SOL** - Native SOL
- **bSOL** - Binance staked SOL
- **Note:** Asset support varies by vault - check individual vault details
Additional assets will be supported as the network expands.

## Using the Restaking Interface

### Accessing Restaking
1. Navigate to [jito.network/restaking/](https://jito.network/restaking/)
2. Connect your Solana wallet (Phantom, Solflare, etc.)
3. Review available vaults and their strategies

![Restaking Home Page - Vaults View](/shared/images/jitosol/restaking-home-vaults-view.png)

### Deposit Process Overview

**Two Approaches:**
The restaking interface provides a toggle to choose your deposit method:

![Restaking Home Page - Assets View](/shared/images/jitosol/restaking-home-assets-view.png)

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
- **Base staking yields** from the underlying staked assets
- **Additional rewards from NCNs** for providing security services
- Exact reward structure varies by vault strategy and supported NCNs

### Fee Structure
**Restaking Program Fees:**
- **4% fee on rewards** to fund protocol development
- **0.1% (10 bps) withdrawal fee** for exiting positions

**Vault-Specific Fees:**
- Each vault has different deposit, withdrawal, and reward fee structures
- Always check the specific fee structure before depositing
- Fees vary based on vault strategy and complexity

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
Jito Restaking has been audited by multiple security firms:
- **Ottersec** - Comprehensive restaking audit
- **Offside Labs** - Restaking vault audit  
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
- Understanding of restaking risks and **two-epoch withdrawal cooldown**

### Useful Resources
- [Restaking Dashboard](https://jito.network/restaking/dashboard/) - Monitor your positions
- [Vault Explorer](https://jito.network/restaking/vaults/) - Browse available vaults
- [NCN Directory](https://jito.network/restaking/ncns/) - View supported networks
- [Node Operator List](https://jito.network/restaking/node-operators/) - See infrastructure providers

This overview provides the foundation for understanding Jito Restaking. For specific instructions on using the interface, see the individual user guides for depositing and withdrawing. 