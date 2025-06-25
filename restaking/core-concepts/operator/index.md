---
title: "Operator"
subtitle: "An overview of the Operator component."
section_type: "page"
order: 2
---

## Overview

### The Operator Account:

- Stores global metadata for a specific operator.
- Tracks the relationship between the operator and other NCN components (e.g. Vaults, NCNs).
- Manages administrative roles, including adding/removing support for NCNs and Vaults.

### Key functionalities include:

- Admin Role Management: Allows for delegating responsibilities to specialized admin roles.
- Operator Fee Management: Tracks fees charged by operators.
- NCN and Vault Indexing: Maintains counts of linked NCNs and Vaults for efficient indexing.

## Key Components

### 1. Operator Structure

| Field               | Type   | Description                                           |
| ------------------- | ------ | ----------------------------------------------------- |
| base                | Pubkey | The base account used as a PDA seed.                  |
| admin               | Pubkey | Overall administrator of the operator.                |
| ncn_admin           | Pubkey | Admin responsible for managing NCNs.                  |
| vault_admin         | Pubkey | Admin responsible for managing Vaults.                |
| delegate_admin      | Pubkey | Admin for delegating asssets from the operator.       |
| metadata_admin      | Pubkey | Admin authorized to update operator metadata.         |
| voter               | Pubkey | Pubkey used to sign transactions for NCN interaction. |
| index               | u64    | Index of the operator account.                        |
| ncn_count           | u64    | Number of NCNs associated with the operator.          |
| vault_count         | u64    | Number of Vaults associated with the operator.        |
| operator_fee_bps    | u64    | Operator fee in basis points.                         |

Operator's PDA

```rust
use jito_restaking_core::operator::Operator;

let program_id = jito_restaking_program::id();
let base_pubkey = pubkey!("base pubkey here");
let operator_pubkey = Operator::find_program_address(&program_id, &base_pubkey).0;
```

## References
- [Restaking Accounts](/restaking/core-concepts/restaking-accounts)
