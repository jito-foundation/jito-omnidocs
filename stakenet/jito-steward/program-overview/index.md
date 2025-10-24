---
title: Program Overview
order: 1
subtitle: ''
section_type: page
---

# Program Overview

The Steward Program's main functions include:

1. **Validator Selection and Management**: The program selects validators, monitors their performance, and adjusts stake allocations to maintain optimal performance.
2. **[State Machine](#state-machine)**: A state machine representing the progress throughout a cycle (10-epoch period) for scoring and delegations.
3. **[Adding and Removing Validators](#validator-management)**: Automatically handles the addition and removal of validators based on predefined criteria.
4. **[Admin Abilities](#admin-abilities)**: Allows administrators to update parameters, manage a blacklist, pause/unpause the state machine, and execute passthrough instructions for SPL Stake Pool.

## State Machine

The state machine represents the progress throughout a cycle (10-epoch period for scoring and delegations).

### Compute Scores

At the start of a 10 epoch cycle ("the cycle"), all validators are scored. The scoring system uses a 4-tier hierarchical ranking combined with binary eligibility criteria.

#### Binary Eligibility Criteria

All validators must meet the following binary criteria to be eligible for delegation (each is scored as 1.0 if passing, 0.0 if failing):

- `mev_commission_score`: If max MEV commission in `mev_commission_range` epochs is less than or equal to threshold, score is 1.0, else 0.0
- `commission_score`: If max commission in `commission_range` epochs is less than or equal to threshold, score is 1.0, else 0.0
- `historical_commission_score`: If any commission within the validator's entire history exceeds the `historical_commission_threshold`, score is 0.0, else 1.0. This effectively bans validators who have performed commission manipulation.
- `blacklisted_score`: If validator is blacklisted, score is 0.0, else 1.0
- `superminority_score`: If validator is not in the superminority (top 33.3% by stake), score is 1.0, else 0.0
- `delinquency_score`: If delinquency is not greater than threshold in any epoch within `epoch_credits_range`, score is 1.0, else 0.0
- `running_jito_score`: If validator has a MEV commission in the last `mev_commission_range` epochs, score is 1.0, else 0.0
- `merkle_root_upload_authority_score`: If validator is using an acceptable Tip Distribution merkle root upload authority (TipRouter or OldJito), score is 1.0, else 0.0
- `priority_fee_commission_score`: If validator's average realized priority fee commission is less than or equal to threshold, score is 1.0, else 0.0
- `priority_fee_merkle_root_upload_authority_score`: If validator is using an acceptable priority fee merkle root upload authority, score is 1.0, else 0.0

> Note: All data comes from the `ValidatorHistory` account for each validator.

#### 4-Tier Hierarchical Ranking

Validators that pass all binary criteria are ranked using a 4-tier hierarchical scoring system encoded as a 64-bit value:

1. **Inflation Commission** (Tier 1 - Highest Priority, bits 56-63): Lower validator commission is always preferred. This tier uses the maximum commission observed in the `commission_range`, inverted so lower commission = higher score.

2. **MEV Commission** (Tier 2, bits 42-55): Among validators with equal inflation commission, lower MEV commission is preferred. This tier uses the average MEV commission over `mev_commission_range` epochs, inverted so lower commission = higher score.

3. **Validator Age** (Tier 3, bits 25-41): Among validators equal on commissions, older validators (more epochs with non-zero vote credits) are preferred. This rewards validator longevity and reliability.

4. **Vote Credits Ratio** (Tier 4 - Lowest Priority, bits 0-24): Among validators equal on all above tiers, higher performance (vote credits relative to total blocks) is preferred.

The 4-tier score ensures that differences in higher-priority tiers always dominate lower-priority tiers. For example, a validator with 1% commission will always rank higher than one with 2% commission, regardless of their MEV commission, age, or performance.

#### Final Score Calculation

The final score is calculated by multiplying the 4-tier raw score by all binary eligibility factors:

```rust
// Calculate 4-tier raw score (encoded as u64)
let raw_score = encode_validator_score(
    commission_max,      // Tier 1: Max commission (0-100)
    mev_commission_avg,  // Tier 2: Avg MEV commission (0-10000 bps)
    validator_age,       // Tier 3: Age in epochs
    vote_credits_avg     // Tier 4: Normalized vote credits
);

// Apply binary filters
let score = raw_score
    * mev_commission_score
    * commission_score
    * historical_commission_score
    * blacklisted_score
    * superminority_score
    * delinquency_score
    * running_jito_score
    * merkle_root_upload_authority_score
    * priority_fee_commission_score
    * priority_fee_merkle_root_upload_authority_score;
```

If any binary criterion fails (score = 0), the final score becomes zero, making the validator ineligible for delegation. This ensures all validators in the pool meet essential requirements for decentralization, network health, operator quality, and MEV/priority fee sharing.

The hierarchical ranking ensures that validators are compared fairly across multiple dimensions, with the most important factors (commissions) taking precedence over secondary factors (age, performance). This creates strong incentives for validators to maintain low commissions while rewarding longevity and performance as tiebreakers.

For a detailed breakdown of the formulas used for each score component, see the [Scoring System](../validators/scoring-system/index.md) page.

Take a look at the implementation in [score.rs](https://github.com/jito-foundation/stakenet/blob/master/programs/steward/src/score.rs)

### Compute Delegations

Once all the validators are scored, we need to calculate the stake distribution we will be aiming for during this cycle.

The top validators by overall score will become our validator set (the number is configurable via the `num_delegation_validators` parameter, currently set to 400). Each selected validator receives an equal share of the pool (1/400th when 400 validators are selected). If there are fewer eligible validators (having a non-zero score) than the target number, all eligible validators are included in the delegation set.

At the end of this step, we have a list of target delegations, representing proportions of the share of the pool, not fixed lamport amounts.

### Idle

Once the delegation amounts are set, the Steward waits until we’ve reached the 95% point of the epoch to run the next step.

### Compute Instant Unstake

All validators are checked for a set of Instant Unstaking criteria, like commission rugs, delinquency, etc. If they hit the criteria, they are marked for the rest of the cycle.

The following criteria are used to determine if a validator should be instantly unstaked:

- `delinquency_check`: Checks if validator has missed > `instant_unstake_delinquency_threshold_ratio` of votes this epoch
- `commission_check`: Checks if validator has increased commission > `commission_threshold`
- `mev_commission_check`: Checks if validator has increased MEV commission > `mev_commission_bps_threshold`
- `is_blacklisted`: Checks if validator was added to blacklist blacklisted

If any of these criteria are true, we mark the validator for instant unstaking:

```rust
let instant_unstake =
    delinquency_check || commission_check || mev_commission_check || is_blacklisted;
```

Take a look at the implementation in [score.rs](https://github.com/jito-foundation/stakenet/blob/master/programs/steward/src/score.rs#L474)

### Rebalance

One instruction is called for each validator, to increase or decrease stake if a validator is not at the target delegation.

For each validator, we first check if the target balance is greater or less than the current balance.

If the target is less, we attempt to undelegate stake:

When undelegating stake, we want to protect against massive unstaking events due to bugs or network anomalies, to preserve yield. There are two considerations with this:
There are 3 main reasons we may want to unstake. We want to identify when each of these cases happen, and let some amount of unstaking happen for each case throughout a cycle.

- the pool is out of line with the ideal validator set (top N validators by score, configurable) and should be rebalanced,
- a validator is marked for instant unstake, or
- a validator gets a stake deposit putting it far above the target delegation.

We want to run the rebalance step in parallel across all validators, meaning these instructions can be run in any order, but we need to have some notion of the unstaking priority/ordering so the worst validators can be unstaked before the cap is hit. Pre-calculating the balance changes is difficult since balances can change at any time due to user stake deposits and withdrawals, and the total lamports of the pool can change at any time.

To address 1: we set a cap for each unstake condition, and track the amount unstaked for that condition per cycle. (scoring_unstake_cap, instant_unstake_cap, stake_deposit_unstake_cap)

To address 2: in each instruction, we calculate how much this validator is able to be unstaked in real-time, based on the current balances of all validators, unstaking caps, and which validators would be "ahead" in priority for unstaking before caps are hit. (Lower raw_score = higher unstaking priority). If all the "worse" validators will be unstaked and hit the caps before this one can, no unstaking is done on this validator.

For each validator, its active stake balance in lamports is then saved. In the next epoch, any lamports above this can be assumed to be a stake deposit, and can be unstaked.

If the target is greater, we attempt to delegate stake:

In a similar vein to unstaking, we want to be able to customize the priority of staking so that instructions can be run in any order, but stake is going to better validators given a limited pool reserve.

We calculate how much this validator is able to be staked in real time, given the number of validators “ahead” in priority (based on overall score). If all validators who need stake are able to be filled and there is still stake left over in the reserve, this validator gets the stake it needs, either up to the target or until the reserve is empty, whichever is first.

If stake was delegated, the balance is updated.

Note that because of the 1-epoch delay in cooling down stake that’s unstaked from validators, there will be many instances where the reserve won’t have enough balance to match the stake needs for everyone, but the following epoch, it will (assuming no withdrawals).

If we are already at the target, nothing happens.

Progress is marked so this validator won’t be adjusted again this epoch. After all validators’ progress is marked “true”, we transition to idle.

### Rest of the cycle

After unstaking is done, the state machine moves back into Idle. In next epoch and in the rest of the epochs for the cycle, it repeats these steps:

- Compute Instant Unstake
- Rebalance
- Idle

At the start of the next cycle, we move back to Compute Scores, and all those pieces of state are reset to 0.

### Diagram

[View in Figma](https://www.figma.com/board/zBcpTOu1zqKIoEnd54sWqH/Steward-Program?node-id=0-1&t=1FK9C2TtNvFEfOU6-1)

![State Machine Diagram](/shared/images/stakenet/state-machine-diagram.png)

## Validator Management

### Adding Validators

The JitoSOL pool aims to have as many active validators as possible in the pool, meaning they are able to get scored and considered for delegation. This does NOT mean they are guaranteed stake (see the State Machine section above for how validators receive stake). Validators are added permissionlessly if they meet the following criteria:

- At least 5 epochs of voting.
- Minimum SOL stake of 5000.

There are approximately 1300 validators that meet these criteria today, with a capacity for 5000 validators.

### Removing Validators

Validators are removed if:

- The validator’s vote account closes.
- The validator stops voting for 5 epochs, leading to the deactivation of the stake account in the stake pool.

## Admin Abilities

There are 3 authorities. `blacklist_authority`, `parameters_authority`, and `admin`.

`blacklist_authority` is used to add/remove validators to/from the blacklist to prevent delegation.

`parameters_authority` is used to update the parameters, which affects scoring and delegation.

`admin` is used for all other perimissioned actions, including updating authorities, pausing the state machine, and executing passthrough instructions for SPL Stake Pool that require the staker as a signer.
