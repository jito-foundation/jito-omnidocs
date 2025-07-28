---
title: "NCN Operations"
subtitle: "Learn how to interact with the NCN account"
section_type: "page"
order: 2
---

Node Consensus Networks (NCNs) coordinate validation services between operators and vaults in the Jito (Re)staking ecosystem. 
NCNs manage which operators can participate in validation and which vaults can delegate stake to the network.

## Basic NCN Operations

### Creating an NCN

```bash
# Generate keypair for your NCN
solana-keygen new --outfile ./my-ncn-keypair.json

# Initialize the NCN
jito-restaking-cli restaking ncn initialize \
  --path-to-base-keypair ./my-ncn-keypair.json
```

### Viewing NCN Information

```bash
# Get NCN details
jito-restaking-cli restaking ncn get <NCN_PUBKEY>

# List all NCNs
jito-restaking-cli restaking ncn list

# JSON output for programmatic access
jito-restaking-cli --print-json restaking ncn get <NCN_PUBKEY>
```

## Managing Operators

### Adding Operators to Your NCN

Operators must go through a two-step process to join an NCN:

```bash
# Step 1: Initialize the relationship
jito-restaking-cli restaking ncn initialize-ncn-operator-state \
  <NCN_PUBKEY> <OPERATOR_PUBKEY>

# Step 2: Start the warmup period
jito-restaking-cli restaking ncn ncn-warmup-operator \
  <NCN_PUBKEY> <OPERATOR_PUBKEY>
```

### Monitoring Operators

```bash
# View all operators in your NCN
jito-restaking-cli restaking ncn list-ncn-operator-state <NCN_PUBKEY>

# Check operator status and warmup progress
jito-restaking-cli --print-json restaking ncn list-ncn-operator-state <NCN_PUBKEY>
```

### Removing Operators

```bash
# Initiate operator removal (cooldown period)
jito-restaking-cli restaking ncn ncn-cooldown-operator \
  <NCN_PUBKEY> <OPERATOR_PUBKEY>
```


## Managing Vault Connections

### Connecting Vaults to Your NCN

Vaults provide the staked tokens that operators use for validation:

```bash
# Step 1: Create the vault ticket
jito-restaking-cli restaking ncn initialize-ncn-vault-ticket \
  <NCN_PUBKEY> <VAULT_PUBKEY>

# Step 2: Activate the connection
jito-restaking-cli restaking ncn warmup-ncn-vault-ticket \
  <NCN_PUBKEY> <VAULT_PUBKEY>
```

### Vault Relationship Benefits

**For the NCN:**
- Access to delegated stake for validation
- Diversified funding sources
- Reduced dependency on single vault

**For Vaults:**
- Access to professional validation services
- Diversified staking opportunities
- Enhanced yield potential

### Monitoring Vault Connections

```bash
# View all connected vaults
jito-restaking-cli restaking ncn list-ncn-vault-ticket <NCN_PUBKEY>

# Check vault connection status
jito-restaking-cli --print-json restaking ncn list-ncn-vault-ticket <NCN_PUBKEY>
```

### Removing Vault Connections

```bash
# Disconnect a vault (cooldown period)
jito-restaking-cli restaking ncn cooldown-ncn-vault-ticket \
  <NCN_PUBKEY> <VAULT_PUBKEY>
```

## Delegation and Token Management

### Setting Up Token Delegation

NCNs can manage token delegation:

```bash
# Create delegated token account
jito-restaking-cli restaking ncn ncn-delegate-token-account \
  <NCN_PUBKEY> \
  <DELEGATE_PUBKEY> \
  <TOKEN_MINT> \
  --should-create-token-account
```

**Common delegation scenarios:**
- **Operator rewards** - Distributing earned fees to operators
- **Network incentives** - Managing token incentives for participants
- **Governance tokens** - Coordinating voting across operators
- **Reserve funds** - Managing emergency or development funds


## Administrative Operations

### Setting Up Admin Roles

Distribute administrative responsibilities across your team:

```bash
# Set operator admin (manages operator relationships)
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-operator-admin \
  <NCN_PUBKEY> <OPERATOR_ADMIN_PUBKEY>

# Set vault admin (manages vault connections)
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-vault-admin \
  <NCN_PUBKEY> <VAULT_ADMIN_PUBKEY>

# Set multiple roles for one admin
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-slasher-admin \
  --set-delegate-admin \
  <NCN_PUBKEY> <EMERGENCY_ADMIN_PUBKEY>
```

### Transferring Ownership

```bash
# Transfer primary admin rights
jito-restaking-cli restaking ncn ncn-set-admin \
  --old-admin-keypair ./current-admin.json \
  --new-admin-keypair ./new-admin.json \
  <NCN_PUBKEY>
```

**When to transfer ownership:**
- Organizational changes
- Security key rotation
- Decentralization initiatives
- Emergency situations

## NCN Governance Patterns

### Democratic Governance

Distribute control across multiple admins:

```bash
# Operations team manages day-to-day operations
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-operator-admin \
  --set-vault-admin \
  <NCN_PUBKEY> <OPERATIONS_TEAM>

# Security team handles slashing and emergencies
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-slasher-admin \
  <NCN_PUBKEY> <SECURITY_TEAM>

# Community representatives manage metadata and governance
jito-restaking-cli restaking ncn ncn-set-secondary-admin \
  --set-metadata-admin \
  --set-weight-table-admin \
  <NCN_PUBKEY> <COMMUNITY_REPRESENTATIVE>
```

## Quick Reference

| Task | Command |
|------|---------|
| Create NCN | `restaking ncn initialize --path-to-base-keypair <KEYPAIR>` |
| View NCN | `restaking ncn get <NCN_PUBKEY>` |
| Add operator | `initialize-ncn-operator-state` → `ncn-warmup-operator` |
| Add vault | `initialize-ncn-vault-ticket` → `warmup-ncn-vault-ticket` |
| Set admin role | `restaking ncn ncn-set-secondary-admin --set-<ROLE>-admin` |
| Transfer ownership | `restaking ncn ncn-set-admin --old-admin-keypair --new-admin-keypair` |
| List operators | `restaking ncn list-ncn-operator-state <NCN_PUBKEY>` |
| List vaults | `restaking ncn list-ncn-vault-ticket <NCN_PUBKEY>` |