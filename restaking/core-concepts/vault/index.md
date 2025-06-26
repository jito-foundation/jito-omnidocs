---
title: "Vault"
subtitle: "An overview of the Vault component."
section_type: "page"
order: 10
---

## Overview

### The Vault Account:

- Serves as the repository for supported token and VRT (Vault Receipt Token).
- Tracks the state of tokens deposits, withdrawals, and delegate assets.
- Manages a set of administrative roles, responsible for different aspects of vault operations.

### Key functionalities include:

- Token Management: Handles deposits, withdrawals, and minting/burning of VRT tokens with fee calculations and slippage protection.
- Fee Management: Supports dynamic fee adjustments (deposit, withdrawal, reward) with built-in validation and limits.
- Delegation Management: Tracks and manages the delegation of assets to operators, ensuring sufficient reserves for withdrawals.
- State Tracking: Maintains a detailed record of vault activity, including cooldowns, ready-to-claim amounts, and delegation states.
- Administrative Role Management: Assigns and verifies various admin roles (e.g., delegation admin, fee admin) for secure and efficient operations.


## Key Components

### 1. Vault Structure

#### General Information

| Field                             | Type            | Description                                                                            |
| --------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| base                              | Pubkey          | The base account used as a PDA seed.                                                   |

#### Token Information and Accounting

| Field                             | Type            | Description                                                                            |
| --------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| vrt_mint                          | Pubkey          | The pubkey of VRT's mint account.                                                      |
| supported_mint                    | Pubkey          | The pubkey of supported_mint's mint account.                                           |
| vrt_supply                        | u64             | The total number of VRT in circulation.                                                |
| tokens_deposited                  | u64             | The total number of tokens deposited.                                                  |
| deposit_capacity                  | u64             | The total number of tokens deposited.                                                  |
| delegation_state                  | DelegationState | Rolled-up stake state for all operators in the set.                                    |
| additional_asssets_need_unstaking | u64             | The amount of additional assets that need unstaking to fulfill VRT withdrawals.        |
| vrt_enqueued_for_cooldown_amount  | u64             | The amount of VRT tokens in VaultStakerWithdrawalTickets enqueued for cooldown.        |
| additional_asssets_need_unstaking | u64             | The amount of VRT tokens cooling down.                                                 |
| vrt_ready_to_claim_amount         | u64             | The amount of VRT tokens ready to claim.                                               |

#### Admins

| Field                             | Type            | Description                                                                            |
| --------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| admin                             | Pubkey          | Vault admin.                                                                           |
| delegation_admin                  | Pubkey          | The delegation admin responsible for adding and removing delegations from operators.   |
| operator_admin                    | Pubkey          | The operator admin responsible for adding and removing operators.                      |
| ncn_admin                         | Pubkey          | The node consensus network admin responsible for adding and removing support for NCNs. |
| slasher_admin                     | Pubkey          | The admin responsible for adding and removing slashers.                                |
| capacity_admin                    | Pubkey          | The admin responsible for setting the capacity.                                        |
| fee_admin                         | Pubkey          | The admin responsible for setting the fees.                                            |
| delegate_asset_admin              | Pubkey          | The delegate_admin responsible for delegating assets.                                  |
| fee_wallet                        | Pubkey          | Fee wallet account.                                                                    |
| mint_burn_admin                   | Pubkey          | Optional mint signer.                                                                  |
| metadata_admin                    | Pubkey          | Authority to update the vault's metadata.                                              |


#### Indexing and Counters

| Field                             | Type            | Description                                                                            |
| --------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| vault_index                       | u64             | The index of the vault in the vault list.                                              |
| ncn_count                         | u64             | Number of VaultNcnTicket accounts tracked by this vault.                               |
| operator_count                    | u64             | Number of VaultOperatorDelegation accounts tracked by this vault.                      |
| slasher_count                     | u64             | Number of VaultNcnSlasherTicket accounts tracked by this vault.                        |
| last_fee_change_slot              | u64             | The slot of the last fee change.                                                       |
| last_full_state_update_slot       | u64             | The slot of the last time the delegations were updated.                                |
| deposit_fee_bps                   | u16             | The deposit fee in basis points.                                                       |
| withdrawal_fee_bps                | u16             | The withdrawal fee in basis points.                                                    |
| next_withdrawal_fee_bps           | u16             | The next epoch's withdrawal fee in basis points.                                       |
| reward_fee_bps                    | u16             | Fee for each epoch.                                                                    |
| program_fee_bps                   | u16             | The program fee in basis points.                                                       |
| is_paused                         | bool            | Pause flag.                                                                            |

Vault's PDA

```rust
use jito_restaking_core::operator::Operator;

let program_id = jito_restaking_program::id();
let base_pubkey = pubkey!("base pubkey here");
let vault_pubkey = Vault::find_program_address(&program_id, &base_pubkey).0;
```
