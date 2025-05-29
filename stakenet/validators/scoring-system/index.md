---
title: Scoring System
order: 0
subtitle: 'How StakeNet score validators'
section_type: page
---

# Scoring System

[In-depth explanation of the scoring system in progress. For now, see Program Overview.]

## MEV Commission Score

```
mev_commission_score = {
  1.0  if max(mev_commission[t1, t2]) ≤ mev_commission_bps_threshold
  0.0  otherwise
}

where:
  t1 = current_epoch - mev_commission_range
  t2 = current_epoch
```

---

## Running Jito Score

```
running_jito_score = {
  1.0  if any MEV commission exists in t1 to t2
  0.0  otherwise
}

where:
  t1 = current_epoch - mev_commission_range
  t2 = current_epoch
```

---

## Delinquency Score

```
delinquency_score = {
  1.0  if (vote_credits[t] / total_blocks[t]) > scoring_delinquency_threshold_ratio 
       for all t1 ≤ t ≤ t2
  0.0  otherwise
}

where:
  t1 = current_epoch - epoch_credits_range
  t2 = current_epoch - 1
```

---

## Commission Score

```
commission_score = {
  1.0  if max(commission[t1, t2]) ≤ commission_threshold
  0.0  otherwise
}

where:
  t1 = current_epoch - commission_range
  t2 = current_epoch
```

---

## Historical Commission Score

```
historical_commission_score = {
  1.0  if max(historical_commission[t1, t2]) ≤ historical_commission_threshold
  0.0  otherwise
}

where:
  t1 = first_reliable_epoch = 520
  t2 = current_epoch
```

---

## Blacklisted Score

```
blacklisted_score = {
  0.0  if blacklisted in current epoch
  1.0  otherwise
}
```

---

## Superminority Score

```
superminority_score = {
  0.0  if in superminority in current epoch
  1.0  otherwise
}
```

---

## Vote Credits Ratio

```
vote_credits_ratio = sum(vote_credits[t] for t in t1 to t2) / sum(total_blocks[t] for t in t1 to t2)

where:
  t1 = current_epoch - epoch_credits_range
  t2 = current_epoch - 1
```

**Note:** total_blocks is the field in ClusterHistory that tracks how many blocks were created by the cluster in a given epoch. This represents the maximum number of vote credits that a validator can earn. Vote credits are synonymous with epoch credits.

---

## Yield Score

```
yield_score = vote_credits_ratio × (1 - max(commission[t1, t2]))

where:
  t1 = current_epoch - commission_range
  t2 = current_epoch
```

**Note:** Yield score is a relative measure of the yield returned to stakers by the validator, not an exact measure of its APY.

---

## Final Score

```
final_score = mev_commission_score × commission_score × historical_commission_score × 
              blacklisted_score × superminority_score × delinquency_score × 
              running_jito_score × yield_score
```