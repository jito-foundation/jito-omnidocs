---
title: "Operator"
subtitle: "Learn how to interact with the Operator account"
section_type: "page"
order: 3
---

## Basic Operator Operations

### Creating an Operator

```bash
# Initialize operator with 5% fee (500 basis points)
jito-restaking-cli restaking operator initialize 500

# The command will output your operator pubkey - save this!
# Example output: "Operator initialized: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRv"
```

### Viewing Operator Information

```bash
# Get operator details
jito-restaking-cli restaking operator get <OPERATOR_PUBKEY>

# List all operators (market research)
jito-restaking-cli restaking operator list

# JSON output for automation
jito-restaking-cli --print-json restaking operator get <OPERATOR_PUBKEY>
```

### Updating Operator Fees

```bash
# Update to 4% fee (400 basis points)
jito-restaking-cli restaking operator operator-set-fees \
  <OPERATOR_PUBKEY> 400

# Best practice: announce fee changes in advance to delegators
```

## Managing Vault Relationships

### Connecting to Vaults

Operators must establish relationships with vaults to receive delegations:

```bash
# Step 1: Initialize the relationship
jito-restaking-cli restaking operator initialize-operator-vault-ticket \
  <OPERATOR_PUBKEY> <VAULT_PUBKEY>

# Step 2: Activate the relationship (warmup period)
jito-restaking-cli restaking operator warmup-operator-vault-ticket \
  <OPERATOR_PUBKEY> <VAULT_PUBKEY>
```


### Removing Vault Connections

```bash
# Initiate cooldown (gradual disconnection)
jito-restaking-cli restaking operator cooldown-operator-vault-ticket \
  <OPERATOR_PUBKEY> <VAULT_PUBKEY>
```

## Joining NCN Networks

### Joining an NCN

```bash
# Request to join an NCN (operator-initiated)
jito-restaking-cli restaking operator operator-warmup-ncn \
  <OPERATOR_PUBKEY> <NCN_PUBKEY>

# Note: NCN must also approve the relationship from their side
```

### Monitoring NCN Participation

```bash
# View all NCN participations
jito-restaking-cli restaking operator list-ncn-operator-state <OPERATOR_PUBKEY>

# Check participation status
jito-restaking-cli --print-json restaking operator list-ncn-operator-state <OPERATOR_PUBKEY> | \
  jq '.[] | {ncn: .ncn, status: .status, warmup_complete: .warmup_complete}'
```

### Leaving an NCN

```bash
# Initiate departure from NCN
jito-restaking-cli restaking operator operator-cooldown-ncn \
  <OPERATOR_PUBKEY> <NCN_PUBKEY>
```

## Token Delegation Management

### Setting Up Token Accounts

Operators can manage delegated token accounts for various purposes:

```bash
# Create delegated token account
jito-restaking-cli restaking operator operator-delegate-token-account \
  <OPERATOR_PUBKEY> \
  <DELEGATE_PUBKEY> \
  <TOKEN_MINT> \
  --should-create-token-account
```

## Administrative Management

### Setting Up Admin Roles

Distribute operational responsibilities across your team:

```bash
# Set NCN admin (manages NCN relationships)
jito-restaking-cli restaking operator operator-set-secondary-admin \
  --set-ncn-admin \
  <OPERATOR_PUBKEY> <NCN_ADMIN_PUBKEY>

# Set vault admin (manages vault relationships)
jito-restaking-cli restaking operator operator-set-secondary-admin \
  --set-vault-admin \
  <OPERATOR_PUBKEY> <VAULT_ADMIN_PUBKEY>

# Set voter admin (handles governance)
jito-restaking-cli restaking operator operator-set-secondary-admin \
  --set-voter-admin \
  <OPERATOR_PUBKEY> <GOVERNANCE_ADMIN_PUBKEY>

# Set multiple roles for operational efficiency
jito-restaking-cli restaking operator operator-set-secondary-admin \
  --set-delegate-admin \
  --set-metadata-admin \
  <OPERATOR_PUBKEY> <OPERATIONS_ADMIN_PUBKEY>
```

**Admin Role Descriptions:**

| Role | Responsibilities | Use Case |
|------|-----------------|----------|
| `ncn-admin` | NCN relationship management | Business development team |
| `vault-admin` | Vault connection management | Partnership team |
| `voter-admin` | Governance participation | Strategy team |
| `delegate-admin` | Token delegation operations | Operations team |
| `metadata-admin` | Operator information updates | Marketing team |

### Transferring Ownership

```bash
# Transfer primary ownership
jito-restaking-cli restaking operator operator-set-admin \
  --old-admin-keypair ./current-admin.json \
  --new-admin-keypair ./new-admin.json \
  <OPERATOR_PUBKEY>
```

**When to transfer ownership:**
- Organizational restructuring
- Security key rotation schedule
- Succession planning
- Emergency situations


## Quick Reference

| Task | Command |
|------|---------|
| Initialize operator | `restaking operator initialize <FEE_BPS>` |
| Update fees | `restaking operator operator-set-fees <OPERATOR> <FEE_BPS>` |
| Connect to vault | `initialize-operator-vault-ticket` → `warmup-operator-vault-ticket` |
| Join NCN | `restaking operator operator-warmup-ncn <OPERATOR> <NCN>` |
| Set admin roles | `restaking operator operator-set-secondary-admin --set-<ROLE>-admin` |
| View operator | `restaking operator get <OPERATOR>` |
| List vault connections | `restaking operator list-operator-vault-ticket <OPERATOR>` |
| List NCN participations | `restaking operator list-ncn-operator-state <OPERATOR>` |