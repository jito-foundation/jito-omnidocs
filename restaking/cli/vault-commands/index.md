---
title: "Vault Commands"
subtitle: "Overview of vault program operations"
section_type: "page"
order: 4
---

# Vault Commands

The vault commands manage the core functionality of restaking vaults, including global configuration, vault creation and management, user operations, and administrative functions. Vaults are the primary interface for users to participate in restaking and earn rewards.

## Command Structure

All vault commands follow this pattern:

```bash
jito-restaking-cli vault <COMPONENT> <ACTION> [OPTIONS]
```

Where:
- **COMPONENT**: `config` or `vault`
- **ACTION**: Specific operation to perform
- **OPTIONS**: Command-specific parameters

## Core Components

### 1. Global Configuration Management

System-wide configuration for all vaults:

```bash
# View global configuration
jito-restaking-cli vault config get

# Update global settings (admin only)
jito-restaking-cli vault config set-program-fee <NEW_FEE_BPS>
jito-restaking-cli vault config set-program-fee-wallet <NEW_WALLET>
jito-restaking-cli vault config set-admin <NEW_ADMIN>
```

**When to use:** Initial system setup, global fee adjustments, administrative changes.

### 2. Individual Vault Operations

Creating and managing specific vaults:

```bash
# Create a new vault
jito-restaking-cli vault vault initialize <TOKEN_MINT> <DEPOSIT_FEE> <WITHDRAWAL_FEE> <REWARD_FEE> <DECIMALS> <INITIAL_AMOUNT>

# View vault details
jito-restaking-cli vault vault get <VAULT_PUBKEY>

# List all vaults
jito-restaking-cli vault vault list
```

**When to use:** Creating investment products, managing vault portfolios, user research.

## Global Configuration

Global configuration affects all vaults in the system and is typically managed by the protocol administrators.

### Configuration Management

```bash
# View current global settings
jito-restaking-cli vault config get

# Update program fee (affects all vaults)
jito-restaking-cli vault config set-program-fee 150  # 1.5%

# Change fee collection wallet
jito-restaking-cli vault config set-program-fee-wallet <NEW_WALLET_PUBKEY>

# Transfer global admin rights
jito-restaking-cli vault config set-admin <NEW_ADMIN_PUBKEY>
```

**Global configuration controls:**
- **Program fees** - Base fee collected from all vault operations
- **Fee wallet** - Where program fees are deposited
- **Global admin** - Who can modify system-wide settings

## Vault Creation and Management

### Creating Vaults

Vaults are created for specific tokens with defined fee structures:

```bash
# Create JitoSOL restaking vault
jito-restaking-cli vault vault initialize \
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn \
  50 \
  50 \
  300 \
  9 \
  1000000000

# Create USDC restaking vault
jito-restaking-cli vault vault initialize \
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v \
  25 \
  25 \
  200 \
  6 \
  1000000

# Create custom token vault
jito-restaking-cli vault vault initialize \
  <CUSTOM_TOKEN_MINT> \
  <DEPOSIT_FEE_BPS> \
  <WITHDRAWAL_FEE_BPS> \
  <REWARD_FEE_BPS> \
  <TOKEN_DECIMALS> \
  <INITIAL_AMOUNT>
```

**Parameter explanation:**
- **Token mint** - The SPL token that can be deposited
- **Deposit fee** - Fee charged on deposits (basis points)
- **Withdrawal fee** - Fee charged on withdrawals (basis points)
- **Reward fee** - Fee taken from earned rewards (basis points)
- **Decimals** - Number of decimal places for the token
- **Initial amount** - Bootstrap liquidity amount

### Vault Configuration

```bash
# Set deposit capacity limit
jito-restaking-cli vault vault set-capacity <VAULT_PUBKEY> <MAX_AMOUNT>

# Update fee structure
jito-restaking-cli vault vault set-fees \
  --deposit-fee-bps 75 \
  --withdrawal-fee-bps 75 \
  --reward-fee-bps 400 \
  <VAULT_PUBKEY>

# Pause/resume vault operations
jito-restaking-cli vault vault set-is-paused --set-pause <VAULT_PUBKEY>
jito-restaking-cli vault vault set-is-paused <VAULT_PUBKEY>  # Resume
```

### Token Metadata Management

```bash
# Create VRT token metadata
jito-restaking-cli vault vault create-token-metadata \
  <VAULT_PUBKEY> \
  "Jito SOL Vault Token" \
  "jitoSOL-VRT" \
  "https://metadata.example.com/vault.json"

# Update existing metadata
jito-restaking-cli vault vault update-token-metadata \
  <VAULT_PUBKEY> \
  "Updated Vault Name" \
  "NEW-VRT" \
  "https://new-metadata-url.com/vault.json"
```

## User Operations

### Deposits (Minting VRT)

Users deposit tokens and receive Vault Receipt Tokens (VRT):

```bash
# Deposit tokens and mint VRT
jito-restaking-cli vault vault mint-vrt \
  <VAULT_PUBKEY> \
  <AMOUNT_IN> \
  <MIN_AMOUNT_OUT>

# Example: Deposit 10 SOL, expect at least 9.9 VRT
jito-restaking-cli vault vault mint-vrt \
  <VAULT_PUBKEY> \
  10000000000 \
  9900000000
```

**Slippage protection:**
- `MIN_AMOUNT_OUT` protects against unfavorable exchange rates
- Accounts for deposit fees and current vault exchange rate
- Transaction fails if minimum output not achievable

### Withdrawals

Two-step withdrawal process for security:

```bash
# Step 1: Enqueue withdrawal (burns VRT, creates ticket)
jito-restaking-cli vault vault enqueue-withdrawal \
  <VAULT_PUBKEY> \
  <VRT_AMOUNT>

# Step 2: Complete withdrawal after cooldown period
jito-restaking-cli vault vault burn-withdrawal-ticket \
  <VAULT_PUBKEY>
```

### Withdrawal Ticket Management

```bash
# Check withdrawal ticket status
jito-restaking-cli vault vault get-withdrawal-ticket \
  <VAULT_PUBKEY> \
  <STAKER_PUBKEY>

# Transfer withdrawal ticket to another user
jito-restaking-cli vault vault change-withdrawal-ticket-owner \
  --old-ticket-owner-keypair ./current-owner.json \
  <VAULT_PUBKEY> \
  <NEW_OWNER_PUBKEY>
```

## Delegation Management

### Operator Delegation

Vaults delegate tokens to operators for validation services:

```bash
# Initialize delegation relationship
jito-restaking-cli vault vault initialize-operator-delegation \
  <VAULT_PUBKEY> \
  <OPERATOR_PUBKEY>

# Delegate tokens to operator
jito-restaking-cli vault vault delegate-to-operator \
  <VAULT_PUBKEY> \
  <OPERATOR_PUBKEY> \
  <AMOUNT>

# Reduce delegation (cooldown period)
jito-restaking-cli vault vault cooldown-operator-delegation \
  <VAULT_PUBKEY> \
  <OPERATOR_PUBKEY> \
  <AMOUNT>
```

### Delegation Monitoring

```bash
# View all operator delegations
jito-restaking-cli vault vault get-operator-delegations <VAULT_PUBKEY>

# View specific operator delegation
jito-restaking-cli vault vault get-operator-delegation \
  <VAULT_PUBKEY> \
  <OPERATOR_PUBKEY>
```

## NCN Integration

### Vault-NCN Relationships

Connect vaults to Node Consensus Networks for coordinated validation:

```bash
# Initialize vault-NCN relationship
jito-restaking-cli vault vault initialize-vault-ncn-ticket \
  <VAULT_PUBKEY> \
  <NCN_PUBKEY>

# Activate the relationship
jito-restaking-cli vault vault warmup-vault-ncn-ticket \
  <VAULT_PUBKEY> \
  <NCN_PUBKEY>

# Deactivate the relationship
jito-restaking-cli vault vault cooldown-vault-ncn-ticket \
  <VAULT_PUBKEY> \
  <NCN_PUBKEY>
```

**Benefits of NCN integration:**
- Coordinated delegation strategies across operators
- Enhanced security through network coordination
- Optimized reward distribution mechanisms
- Shared governance and decision-making

## Vault Update Cycles

### Managing Update Cycles

Vault update cycles synchronize state changes and reward distribution:

```bash
# Start an update cycle
jito-restaking-cli vault vault initialize-vault-update-state-tracker \
  <VAULT_PUBKEY>

# Process each operator in the update
jito-restaking-cli vault vault crank-vault-update-state-tracker \
  <VAULT_PUBKEY> \
  <OPERATOR_PUBKEY>

# Complete the update cycle
jito-restaking-cli vault vault close-vault-update-state-tracker \
  <VAULT_PUBKEY>
```

### Update Cycle Monitoring

```bash
# Check update cycle status
jito-restaking-cli vault vault get-vault-update-state-tracker <VAULT_PUBKEY>

# Monitor progress with JSON output
jito-restaking-cli --print-json vault vault get-vault-update-state-tracker <VAULT_PUBKEY>
```

**Update cycle purposes:**
- Synchronize delegation changes across operators
- Distribute earned rewards to depositors
- Update vault exchange rates and balances
- Process any pending state transitions

## Administrative Operations

### Admin Role Management

```bash
# Transfer primary vault ownership
jito-restaking-cli vault vault set-admin \
  --old-admin-keypair ./current-admin.json \
  --new-admin-keypair ./new-admin.json \
  <VAULT_PUBKEY>

# Set specialized admin roles
jito-restaking-cli vault vault set-secondary-admin \
  --set-delegation-admin \
  <VAULT_PUBKEY> <DELEGATION_ADMIN_PUBKEY>

jito-restaking-cli vault vault set-secondary-admin \
  --set-operator-admin \
  <VAULT_PUBKEY> <OPERATOR_ADMIN_PUBKEY>

# Set multiple roles at once
jito-restaking-cli vault vault set-secondary-admin \
  --set-fee-admin \
  --set-capacity-admin \
  --set-metadata-admin \
  <VAULT_PUBKEY> <MULTI_ROLE_ADMIN_PUBKEY>
```

**Available admin roles:**
- `--set-delegation-admin` - Manage delegation operations
- `--set-operator-admin` - Manage operator relationships  
- `--set-ncn-admin` - Manage NCN connections
- `--set-slasher-admin` - Handle slashing operations
- `--set-capacity-admin` - Manage deposit limits
- `--set-fee-wallet` - Change fee collection address
- `--set-mint-burn-admin` - Manage VRT minting/burning
- `--set-delegate-asset-admin` - Manage asset delegation
- `--set-fee-admin` - Update fee structures
- `--set-metadata-admin` - Manage token metadata

### Advanced Token Operations

```bash
# Update vault balance calculations
jito-restaking-cli vault vault update-vault-balance <VAULT_PUBKEY>

# Delegate token account control
jito-restaking-cli vault vault delegate-token-account \
  <VAULT_PUBKEY> \
  <DELEGATE_PUBKEY> \
  <TOKEN_MINT> \
  <TOKEN_ACCOUNT>

# Transfer tokens via delegated authority
jito-restaking-cli vault vault delegated-token-transfer \
  <TOKEN_ACCOUNT> \
  <RECIPIENT_PUBKEY> \
  <AMOUNT>
```

## Monitoring and Information

### Vault Information Retrieval

```bash
# Basic vault information
jito-restaking-cli vault vault get <VAULT_PUBKEY>

# Detailed JSON output for automation
jito-restaking-cli --print-json vault vault get <VAULT_PUBKEY>

# List all vaults in the system
jito-restaking-cli vault vault list

# Enhanced JSON output with reserved space details
jito-restaking-cli --print-json-with-reserves vault vault get <VAULT_PUBKEY>
```


## Quick Reference

| Category | Command |
|----------|---------|
| **Global Config** | |
| Initialize system | `vault config initialize <FEE_BPS> <FEE_WALLET>` |
| View config | `vault config get` |
| Update fee | `vault config set-program-fee <FEE_BPS>` |
| **Vault Management** | |
| Create vault | `vault vault initialize <MINT> <DEPOSIT_FEE> <WITHDRAWAL_FEE> <REWARD_FEE> <DECIMALS> <INITIAL>` |
| View vault | `vault vault get <VAULT>` |
| Set capacity | `vault vault set-capacity <VAULT> <AMOUNT>` |
| Update fees | `vault vault set-fees <OPTIONS> <VAULT>` |
| **User Operations** | |
| Deposit | `vault vault mint-vrt <VAULT> <AMOUNT_IN> <MIN_OUT>` |
| Start withdrawal | `vault vault enqueue-withdrawal <VAULT> <AMOUNT>` |
| Complete withdrawal | `vault vault burn-withdrawal-ticket <VAULT>` |
| **Delegation** | |
| Delegate to operator | `vault vault delegate-to-operator <VAULT> <OPERATOR> <AMOUNT>` |
| View delegations | `vault vault get-operator-delegations <VAULT>` |
| **NCN Integration** | |
| Connect to NCN | `vault vault initialize-vault-ncn-ticket` → `warmup-vault-ncn-ticket` |
| **Maintenance** | |
| Update balance | `vault vault update-vault-balance <VAULT>` |
| Start update cycle | `vault vault initialize-vault-update-state-tracker <VAULT>` |