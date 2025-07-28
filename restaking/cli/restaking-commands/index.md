---
title: "Restaking Commands"
subtitle: "Overview of restaking program operations"
section_type: "page"
order: 1
---

The restaking commands manage the core restaking infrastructure, including system configuration, NCN (Node Consensus Network) operations, and operator management.
These commands form the foundation of the Jito restaking ecosystem.

## Command Structure

All restaking commands follow this pattern:

```bash
jito-restaking-cli restaking <COMPONENT> <ACTION> [OPTIONS]
```

Where:

- COMPONENT: `config`, `ncn`, or `operator`
- ACTIONS: Specific operation to perform
- OPTIONS: Command-specific parameters

## Core Components

### 1. Configuration Management

```bash
# Initialize restaking system (one-time setup)
jito-restaking-cli restaking config initialize

# View current configuration
jito-restaking-cli restaking config get

# Change system administrator
jito-restaking-cli restaking config set-admin <NEW_ADMIN_PUBKEY>
```

### 2. NCN Operations

```bash
# Create a new NCN
jito-restaking-cli restaking ncn initialize

# View NCN details
jito-restaking-cli restaking ncn get <NCN_PUBKEY>

# List all NCNs
jito-restaking-cli restaking ncn list
```

### 3. Operator Management

```bash
# Register a new operator
jito-restaking-cli restaking operator initialize <FEE_BPS>

# View operator details
jito-restaking-cli restaking operator get <OPERATOR_PUBKEY>

# List all operators
jito-restaking-cli restaking operator list
```

## Relationship Management

The restaking system manages complex relationships between NCNs, operators, and vaults through ticket systems and warmup/cooldown periods.

