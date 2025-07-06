---
title: Instant Unstaking
order: 2
subtitle: 'Automated validator removal based on performance and fee criteria'
section_type: page
---

All validators are checked for a set of Instant Unstaking criteria, like commission thresholds, delinquency, etc. If they hit the criteria, they are marked for the rest of the cycle.

## Overview

The system automatically identifies validators that should be unstaked immediately based on 4 criteria:

1. **Delinquency**: Poor block production performance
2. **High Commission**: Commission rates above threshold
3. **High MEV Commission**: MEV commission above threshold
4. **Blacklisted**: Validator is on a blacklist

## Example Scenario

Let's say we're in epoch 500, and we want to evaluate validator at index 42.

### Initial Setup

```rust
// Current state
let current_epoch = 500;
let epoch_start_slot = 216_000_000; // First slot of epoch 500
let current_slot = 216_100_000; // We're partway through the epoch

// Validator we're evaluating
let validator_index = 42;
let validator_vote_account = "Vote111111111111111111111111111111111111111";
```

### Step 1: Instruction Call

```rust
// Keeper calls the compute_instant_unstake instruction
compute_instant_unstake(
    ctx: Context<ComputeInstantUnstake>,
    validator_list_index: 42 // Index of validator to evaluate
)
```

### Step 2: State and Input Validation

```rust
// Check we're in the right state
assert_eq!(state_account.state.state_tag, StewardStateEnum::ComputeInstantUnstake);

// Check we're past the minimum epoch progress (90% through epoch)
let epoch_progress = (current_slot - epoch_start_slot) as f64 / slots_in_epoch as f64;
assert!(epoch_progress >= 0.90); // instant_unstake_epoch_progress = 90%

// Check validator hasn't been processed yet
assert!(!state_account.state.progress.get(42)?); // false = not processed

// Check validator data is recent enough (50% through epoch minimum)
let min_acceptable_slot = epoch_start_slot + (slots_in_epoch as f64 * 0.50).round() as u64;
assert!(validator_history.vote_account_last_update_slot >= min_acceptable_slot);
assert!(cluster_history.cluster_history_last_update_slot >= min_acceptable_slot);
```

### Step 3: Instant Unstake Calculation

```rust
// Calculate shared values
let cluster_history_slot_index = cluster_history_last_update_slot - epoch_start_slot;
// = 216_090_000 - 216_000_000 = 90_000

let validator_history_slot_index = vote_account_last_update_slot - epoch_start_slot;
// = 216_085_000 - 216_000_000 = 85_000

let total_blocks_latest = 85_000; // Total blocks produced by cluster
let epoch_credits_latest = 450;   // Credits earned by this validator
```

### Step 4: Compute Checks

#### Delinquency Check

```rust
// Calculate rates for cluster and validator
let blocks_produced_rate = total_blocks_latest as f64 / cluster_history_slot_index as f64;
// = 85_000 / 90_000 = 0.944 blocks per slot

let vote_credits_rate = epoch_credits_latest as f64 / validator_history_slot_index as f64;
// = 450 / 85_000 = 0.00529 credits per slot

// Calculate delinquency ratio using TVC multiplier (16)
const TVC_MULTIPLIER: u32 = 16;
let delinquency_ratio = vote_credits_rate / (blocks_produced_rate * (TVC_MULTIPLIER as f64));
// = 0.00529 / (0.944 * 16.0) = 0.00529 / 15.104 = 0.00035

let delinquency_check = delinquency_ratio < 0.85; // Vote Credits Delinquency Threshold = 85%
// 0.00035 < 0.85 = true (FAIL - validator is severely delinquent)
```

#### Commission Check

```rust
let commission = validator.history.commission_latest().unwrap_or(100); // COMMISSION_MAX = 100%
// = 8 (8% - stored as integer, not basis points)

let commission_check = commission > 5; // Commission Threshold = 5%
// 8 > 5 = true (FAIL - commission too high)
```

#### MEV Commission Check

```rust
let previous_epoch = current_epoch.saturating_sub(1); // = 499
let current_epoch = 500;

// Get MEV commission for previous and current epoch, take the maximum
let mev_commission_range = validator.history.mev_commission_range(previous_epoch, current_epoch);
// Returns [Some(1000), Some(1200)] for epochs 499 and 500

let mev_commission_bps = mev_commission_range
    .iter()
    .filter_map(|&i| i)
    .max()
    .unwrap_or(0);
// = max(1000, 1200) = 1200 basis points (12.00%)

let mev_commission_check = mev_commission_bps > 1000; // MEV Commission Threshold = 10%
// 1200 > 1000 = true (FAIL - MEV commission too high)
```

#### Blacklist Check

```rust
let is_blacklisted = config.validator_history_blacklist.get(validator_index)?;
// = config.validator_history_blacklist.get(42) = false
```

### Step 5: Final Result

```rust
let instant_unstake = delinquency_check || commission_check || mev_commission_check || is_blacklisted;
// = true || true || true || false = true

// This validator SHOULD be unstaked because:
// - Severely delinquent (performance ratio 0.00035 vs 0.85 threshold)
// - Commission too high (8% vs 5% threshold)  
// - High MEV commission (12% vs 10% threshold)
```

### Step 6: State Update and Event Emission

```rust
// Update the state
state_account.instant_unstake.set(42, true)?;  // Mark for unstaking
state_account.progress.set(42, true)?;         // Mark as processed

// Emit the result event
emit!(InstantUnstakeComponentsV2 {
    instant_unstake: true,
    delinquency_check: true,   // FAIL - 0.00035 << 0.85 threshold
    commission_check: true,    // FAIL - 8% > 5% threshold
    mev_commission_check: true, // FAIL - 12% > 10% threshold
    is_blacklisted: false,
    vote_account: validator_vote_account,
    epoch: 500,
    details: InstantUnstakeDetails {
        epoch_credits_latest: 450,
        vote_account_last_update_slot: 216_085_000,
        total_blocks_latest: 85_000,
        cluster_history_slot_index: 90_000,
        commission: 8,        // 8% (stored as integer)
        mev_commission: 1200, // 12.00% (in basis points)
    },
});
```

## Key Calculation Details

### Delinquency Formula

The delinquency check uses a sophisticated formula that accounts for the TVC (Tip, Vote, Commission) multiplier:


```rust
delinquency_ratio = vote_credits_rate / (blocks_produced_rate * TVC_MULTIPLIER)
```

Where:

- `vote_credits_rate`: validator's credits earned per slot
- `blocks_produced_rate`: cluster's blocks produced per slot

### MEV Commission Logic

MEV commission checks the maximum commission between the previous and current epoch, ensuring validators can't game the system by temporarily lowering rates.

### Commission Storage

Regular commission is stored as an integer percentage (8 = 8%), while MEV commission uses basis points (1200 = 12.00%).

## Example Results for Different Validators

Using the actual Steward configuration thresholds:

- Delinquency Threshold: 85% (Vote Credits Delinquency Threshold)
- Commission Threshold: 5% (Commission Threshold)
- MEV Commission Threshold: 10% (MEV Commission Threshold)


| Validator | Delinquency | Commission | MEV Commission | Blacklisted | Result |
|-----------|-------------|------------|----------------|-------------|---------|
| A         | ✅ 98%      | ✅ 3%      | ✅ 8%          | ❌          | Keep    |
| B         | ❌ 80%      | ✅ 4%      | ✅ 9%          | ❌          | Unstake |
| C         | ✅ 90%      | ❌ 7%      | ✅ 6%          | ❌          | Unstake |
| D         | ✅ 95%      | ✅ 4%      | ❌ 12%         | ❌          | Unstake |
| E         | ✅ 88%      | ✅ 2%      | ✅ 5%          | ✅          | Unstake |

## Key Points

1. **Timing**: Only runs after 90% progress through the epoch (Instant Unstake Epoch Progress)
2. **Data Freshness**: Requires validator/cluster data updated after 50% epoch progress (Instant Unstake Inputs Epoch Progress)
3. **One Shot**: Each validator is processed only once per cycle
4. **Multiple Criteria**: Any single failure triggers instant unstake
5. **Strict Thresholds**: Commission >5%, MEV Commission >10%, Delinquency <85%
6. **State Management**: Tracks progress and results in persistent state
7. **Event Driven**: Emits detailed events for monitoring and debugging

This system helps maintain stake pool health by automatically removing underperforming validators without manual intervention.

