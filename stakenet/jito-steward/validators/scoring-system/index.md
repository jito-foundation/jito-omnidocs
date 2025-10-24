---
title: Scoring System
order: 0
subtitle: 'How StakeNet scores validators'
section_type: page
---

# Scoring System

The Steward program uses a 4-tier hierarchical scoring system combined with binary eligibility criteria to rank validators for stake delegation. This page provides detailed formulas and explanations for each component.

## Overview

The scoring system has two main components:

1. **Binary Eligibility Criteria**: Pass/fail checks (score of 1.0 or 0.0) that ensure validators meet minimum requirements
2. **4-Tier Hierarchical Ranking**: A tiered scoring system that ranks eligible validators with commission being most important, followed by age and performance

## Binary Eligibility Criteria

All validators must pass ALL of the following binary checks to be eligible for delegation. Each criterion evaluates to 1.0 (pass) or 0.0 (fail).

### MEV Commission Score

```
mev_commission_score = {
  1.0  if max(mev_commission[t1, t2]) ≤ mev_commission_bps_threshold
  0.0  otherwise
}

where:
  t1 = current_epoch - mev_commission_range
  t2 = current_epoch
  mev_commission_bps_threshold = 1000 (10%)
```

**Purpose**: Ensures validators don't charge excessive MEV commissions.

---

### Commission Score

```
commission_score = {
  1.0  if max(commission[t1, t2]) ≤ commission_threshold
  0.0  otherwise
}

where:
  t1 = current_epoch - commission_range
  t2 = current_epoch
  commission_threshold = 5%
```

**Purpose**: Ensures validators don't charge excessive inflation commissions in recent epochs.

---

### Historical Commission Score

```
historical_commission_score = {
  1.0  if max(historical_commission[t1, t2]) ≤ historical_commission_threshold
  0.0  otherwise
}

where:
  t1 = first_reliable_epoch = 520
  t2 = current_epoch
  historical_commission_threshold = 50%
```

**Purpose**: Bans validators who have performed commission manipulation (rug pulls) at any point in their history.

---

### Running Jito Score

```
running_jito_score = {
  1.0  if any MEV commission exists in [t1, t2]
  0.0  otherwise
}

where:
  t1 = current_epoch - mev_commission_range
  t2 = current_epoch
```

**Purpose**: Ensures validators are running the Jito MEV-enabled client.

---

### Delinquency Score

```
delinquency_score = {
  1.0  if (vote_credits[t] / (total_blocks[t] × TVC_MULTIPLIER)) ≥ scoring_delinquency_threshold_ratio
       for all t in [t1, t2]
  0.0  otherwise
}

where:
  t1 = current_epoch - epoch_credits_range
  t2 = current_epoch - 1
  scoring_delinquency_threshold_ratio = 0.97
  TVC_MULTIPLIER = 1000 (Turbine Vote Credits multiplier)
```

**Purpose**: Ensures validators maintain high uptime and vote participation. The ratio measures what fraction of possible votes were cast.

**Note**: `total_blocks` is the field in ClusterHistory that tracks how many blocks were created by the cluster in a given epoch. This represents the maximum number of vote credits a validator can earn. Vote credits are synonymous with epoch credits.

---

### Blacklisted Score

```
blacklisted_score = {
  0.0  if blacklisted in current epoch
  1.0  otherwise
}
```

**Purpose**: Allows governance to manually exclude validators for security or policy reasons.

---

### Superminority Score

```
superminority_score = {
  0.0  if in superminority in current epoch
  1.0  otherwise
}
```

**Purpose**: Prevents concentration of stake by excluding validators in the top 33.3% of total network stake, promoting decentralization.

---

### Merkle Root Upload Authority Score

```
merkle_root_upload_authority_score = {
  1.0  if authority is TipRouter or OldJito
  0.0  otherwise (including Unset, DNE, or other values)
}
```

**Purpose**: Ensures validators are using an acceptable Tip Distribution merkle root upload authority for MEV distribution.

---

### Priority Fee Commission Score

```
priority_fee_commission_score = {
  1.0  if avg_realized_commission[t1, t2] ≤ max_avg_commission OR current_epoch < priority_fee_scoring_start_epoch
  0.0  otherwise
}

where:
  avg_realized_commission = ceiling(sum(realized_commission[t] for valid t in [t1, t2]) / count(valid t))
  realized_commission[t] = ((total_fees[t] - tips[t]) × 10000) / total_fees[t]  (in basis points)
  t1 = current_epoch - priority_fee_commission_range
  t2 = current_epoch

  valid t = epochs where priority_fee_merkle_root_upload_authority is not Unset

Special cases:
  - If tips is None, default to 0 (assumes not distributing priority fees, commission = 10000 bps)
  - If total_fees is None or 0, return 0 bps (no data available yet)
  - If total_fees is None when tips exists, default to u64::MAX (forces commission to max)
```

**Purpose**: Ensures validators distribute priority fees to stakers and don't keep excessive amounts. Uses ceiling division to be more strict (rounds up commission).

---

### Priority Fee Merkle Root Upload Authority Score

```
priority_fee_merkle_root_upload_authority_score = {
  1.0  if authority is TipRouter or OldJito
  0.0  otherwise (including Unset, DNE, or other values)
}
```

**Purpose**: Ensures validators are using an acceptable authority for priority fee distribution.

---

## 4-Tier Hierarchical Ranking

Validators that pass all binary criteria are ranked using a 4-tier system encoded as a 64-bit value. Higher tiers always dominate lower tiers.

### Score Encoding

The score is encoded as a u64 with the following bit layout:

```
Bits 56-63 (8 bits):  Tier 1 - Inflation Commission (inverted)
Bits 42-55 (14 bits): Tier 2 - MEV Commission (inverted)
Bits 25-41 (17 bits): Tier 3 - Validator Age
Bits 0-24 (25 bits):  Tier 4 - Vote Credits Ratio
```

This encoding ensures that when comparing scores as u64 values, differences in higher tiers always dominate lower tiers.

### Tier 1: Inflation Commission (Highest Priority)

```
tier1_score = 100 - min(commission_max, 100)

where:
  commission_max = max(commission[t] for t in [t1, t2])
  t1 = current_epoch - commission_range
  t2 = current_epoch
```

**Range**: 0-100 (8 bits)

**Inverted**: Lower commission = higher score

**Purpose**: Prioritizes validators with lower inflation commissions. A validator with 0% commission scores 100, while 5% commission scores 95.

---

### Tier 2: MEV Commission

```
tier2_score = 10000 - min(mev_commission_avg, 10000)

where:
  mev_commission_avg = ceiling(sum(mev_commission[t] for valid t in [t1, t2]) / count(valid t))
  t1 = current_epoch - mev_commission_range
  t2 = current_epoch
  valid t = epochs where mev_commission is not None

  If no valid epochs exist, default to 10000 (BASIS_POINTS_MAX)
```

**Range**: 0-10000 basis points (14 bits)

**Inverted**: Lower commission = higher score

**Purpose**: Among validators with equal inflation commission, prefers those with lower MEV commissions. Uses ceiling division to be more strict.

---

### Tier 3: Validator Age

```
tier3_score = min(validator_age, 131071)

where:
  validator_age = count of epochs with non-zero vote credits
```

**Range**: 0-131,071 epochs (17 bits, ~716 years max)
**Direct**: Older validators score higher
**Purpose**: Among validators equal on commissions, rewards longevity and operational track record.

---

### Tier 4: Vote Credits Ratio

```
tier4_score = min(vote_credits_avg_scaled, 33554431)

where:
  vote_credits_avg_scaled = vote_credits_ratio × VOTE_CREDITS_RATIO_MAX
  vote_credits_ratio = (sum(vote_credits[t] for t in [t1, t2]) / count[t1, t2]) /
                       (sum(total_blocks[t] for t in [t1, t2]) / count[t1, t2]) /
                       TVC_MULTIPLIER

  t1 = current_epoch - epoch_credits_range
  t2 = current_epoch - 1
  VOTE_CREDITS_RATIO_MAX = 10,000,000 (for precision)
  TVC_MULTIPLIER = 1000 (Turbine Vote Credits multiplier)
```

**Range**: 0-33,554,431 (25 bits)

**Direct**: Higher performance = higher score

**Purpose**: Among validators equal on all other tiers, rewards better performance. This is a relative measure of validator reliability and vote participation, not an exact APY measure.

---

## Final Score Calculation

The final score combines the 4-tier raw score with all binary eligibility factors:

```rust
// Step 1: Encode 4-tier raw score
raw_score = (tier1_score << 56) | (tier2_score << 42) | (tier3_score << 25) | tier4_score

// Step 2: Apply binary filters
final_score = raw_score
  × mev_commission_score
  × commission_score
  × historical_commission_score
  × blacklisted_score
  × superminority_score
  × delinquency_score
  × running_jito_score
  × merkle_root_upload_authority_score
  × priority_fee_commission_score
  × priority_fee_merkle_root_upload_authority_score
```

**Result**: If any binary criterion fails (= 0), the final score becomes 0, making the validator ineligible. Otherwise, the final score equals the raw_score, which can be compared directly as a u64 to rank validators hierarchically.

---

## Example Comparison

Here's how two validators would be ranked:

**Validator A**: 1% commission, 5% MEV commission, 100 epochs old, 0.95 vote ratio
**Validator B**: 2% commission, 3% MEV commission, 200 epochs old, 0.98 vote ratio

Despite Validator B having better MEV commission, age, and performance, **Validator A ranks higher** because Tier 1 (inflation commission) dominates all other factors. The 1% vs 2% difference in inflation commission overrides all other advantages.

---

## Implementation Reference

See the full implementation in [score.rs](https://github.com/jito-foundation/stakenet/blob/master/programs/steward/src/score.rs) in the StakeNet repository.