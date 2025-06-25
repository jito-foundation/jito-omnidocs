---
title: Operators Overview
order: 0
subtitle: 'Infrastructure providers that run NCN software and manage delegated assets in the Jito Restaking ecosystem'
section_type: page
---

## What is an Operator?

An **Operator** is an entity responsible for running Node Consensus Network (NCN) software and managing delegated assets from vaults. Operators serve as the infrastructure providers in the Jito Restaking ecosystem, executing the actual work required by NCNs while being held accountable through economic incentives and slashing mechanisms.

## Key Responsibilities

- **NCN Software Execution**: Run and maintain software for various NCNs they opt into
- **Asset Management**: Manage delegated assets from vaults with proper security measures  
- **Fee Collection**: Earn fees (in basis points) for providing services to NCNs
- **Slashing Risk**: Accept slashing risk for misbehavior or poor performance

## Operator Account Structure

The Operator account stores global metadata and configuration:

| Field | Type | Description |
|-------|------|-------------|
| `base` | Pubkey | Base account used as PDA seed |
| `admin` | Pubkey | Primary administrator with full control |
| `ncn_admin` | Pubkey | Admin for managing NCN relationships |
| `vault_admin` | Pubkey | Admin for managing vault relationships |
| `delegate_admin` | Pubkey | Admin for asset delegation operations |
| `metadata_admin` | Pubkey | Admin for updating operator metadata |
| `voter` | Pubkey | Key used for signing NCN transactions |
| `index` | u64 | Unique operator index |
| `ncn_count` | u64 | Number of associated NCNs |
| `vault_count` | u64 | Number of associated vaults |
| `operator_fee_bps` | u16 | Operator fee in basis points |

## Admin Role Separation

Operators use role-based access control for security:

- **Primary Admin**: Full control over the operator account
- **NCN Admin**: Can add/remove NCN support and manage NCN relationships
- **Vault Admin**: Can add/remove vault support and manage vault relationships  
- **Delegate Admin**: Can delegate assets from operator token accounts
- **Metadata Admin**: Can update operator metadata and configuration
- **Voter**: Can sign transactions for NCN interactions

## Relationship Management

### Vault Relationships
Operators create **OperatorVaultTickets** to establish relationships with vaults:
- Operators opt into vaults they want to receive delegation from
- Tickets track the state of the relationship (inactive, warming up, active, cooling down)
- Only the operator's `vault_admin` can manage these relationships

### NCN Relationships  
Operators participate in **NcnOperatorState** for mutual opt-in with NCNs:
- Both the NCN and operator must opt into each other
- Enables operators to provide services to specific NCNs
- Managed through the operator's `ncn_admin` role

## Operator Lifecycle

### 1. Initialization
```rust
// Find operator PDA
let operator_pubkey = Operator::find_program_address(&program_id, &base_pubkey).0;
```

### 2. Vault Opt-in
- Create OperatorVaultTicket to signal interest in a vault
- Warmup period before relationship becomes active
- Begin receiving delegated assets from the vault

### 3. NCN Participation
- Opt into NCNs to provide services
- Run required NCN software infrastructure
- Earn fees based on `operator_fee_bps` setting

### 4. Asset Management
- Receive delegated assets from vaults
- Use `delegate_admin` to manage token accounts
- Subject to slashing for misbehavior
