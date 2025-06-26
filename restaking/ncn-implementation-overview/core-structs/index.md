---
title: Core Struct Definitions
order: 70
subtitle: Complete reference for all data structures used by the NCN program
section_type: page
---

## Core struct definitions

Here are the definitions for the core data structures used by the NCN program, typically found in the `/core/src` directory. Understanding these structures is key to understanding the program's logic.

### Config

file: `config.rs`

- **Purpose**: Stores global, long-lived configuration parameters for the NCN program instance.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct Config {
    /// The Pubkey of the associated Jito Restaking NCN account this config belongs to.
    pub ncn: Pubkey,
    /// The admin authorized to update the tie breaker mechanism or parameters.
    pub tie_breaker_admin: Pubkey,
    /// Number of slots after consensus is reached where votes are still accepted
    /// (though they won't change the outcome).
    pub valid_slots_after_consensus: PodU64,
    /// Number of epochs without reaching consensus before the cycle is considered stalled.
    pub epochs_before_stall: PodU64,
    /// Number of epochs to wait after consensus is reached before epoch accounts can be closed.
    pub epochs_after_consensus_before_close: PodU64,
    /// The first epoch number for which voting is considered valid.
    pub starting_valid_epoch: PodU64,
    /// Bump seed for the PDA
    pub bump: u8,
}
```

- **Explanation**: Holds the associated `ncn`, the `tie_breaker_admin`, and various timing/threshold parameters (`valid_slots_after_consensus`, `epochs_before_stall`, `epochs_after_consensus_before_close`, `starting_valid_epoch`).

### Ballot

file: `ballot_box.rs`

- **Purpose**: Represents a single potential outcome in the consensus process, specifically a weather status in this example.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct Ballot {
    /// The weather status value
    weather_status: u8,
    /// Whether the ballot is valid
    is_valid: PodBool,
}
```

- **Explanation**: Holds the numeric `weather_status` being voted on and a boolean `is_valid` flag to ensure it corresponds to a known status.

### BallotTally

file: `ballot_box.rs`

- **Purpose**: Aggregates votes and stake weight for a specific `Ballot`.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct BallotTally {
    /// Index of the tally within the ballot_tallies
    index: PodU16,
    /// The ballot being tallied
    ballot: Ballot,
    /// Breakdown of all of the stake weights that contribute to the vote
    stake_weights: StakeWeights,
    /// The number of votes for this ballot
    tally: PodU64,
}
```

- **Explanation**: Tracks which `ballot` this tally is for, its `index` in the main array, the total `stake_weights` supporting it, and the raw `tally` (count) of votes.

### OperatorVote

file: `ballot_box.rs`

- **Purpose**: Records the vote cast by a single operator within a specific epoch's `BallotBox`.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct OperatorVote {
    /// The operator that cast the vote
    operator: Pubkey,
    /// The slot when the operator voted
    slot_voted: PodU64,
    /// The stake weights of the operator
    stake_weights: StakeWeights,
    /// The index of the ballot in the ballot_tallies array
    ballot_index: PodU16,
}
```

- **Explanation**: Stores the `operator` pubkey, the current `slot`, their `stake_weights`, and the `ballot_index` they voted for.

### BallotBox

file: `ballot_box.rs`

- **Purpose**: The central account for managing the voting process within a specific epoch.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct BallotBox {
    /// The Pubkey of the NCN this ballot box is for
    ncn: Pubkey,
    /// The epoch this ballot box is for
    epoch: PodU64,
    /// Bump seed for the PDA
    bump: u8,
    /// Slot when this ballot box was created
    slot_created: PodU64,
    /// Slot when consensus was reached
    slot_consensus_reached: PodU64,
    /// Number of operators that have voted
    operators_voted: PodU64,
    /// Number of unique ballots
    unique_ballots: PodU64,
    /// The ballot that got at least 66% of votes
    winning_ballot: Ballot,
    /// Operator votes
    operator_votes: [OperatorVote; MAX_OPERATORS],
    /// Mapping of ballots votes to stake weight
    ballot_tallies: [BallotTally; MAX_OPERATORS],
}
```

- **Explanation**: Holds metadata (`ncn`, `epoch`, timestamps), vote counts, and arrays for individual operator votes and aggregated tallies.

### ConsensusResult

file: `consensus_result.rs`

- **Purpose**: A persistent account storing the final, immutable outcome of a consensus cycle for a specific epoch.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct ConsensusResult {
    /// The Pubkey of the NCN this consensus result is for
    ncn: Pubkey,
    /// The epoch this consensus result is for
    epoch: PodU64,
    /// The vote weight that supported the winning status
    vote_weight: PodU64,
    /// The total vote weight in the ballot box
    total_vote_weight: PodU64,
    /// The slot at which consensus was reached
    consensus_slot: PodU64,
    /// Bump seed for the PDA
    bump: u8,
    /// The winning weather status that reached consensus
    weather_status: u8,
}
```

- **Explanation**: Stores the `ncn`, `epoch`, the winning `weather_status`, and the `consensus_slot`.

### AccountPayer

file: `account_payer.rs`

- **Purpose**: An empty, uninitialized system account used solely as a Program Derived Address (PDA) to hold SOL temporarily for paying rent during account creation or reallocation within the NCN program.
- **Definition**:

```rust
pub struct AccountPayer {}
```

- **Explanation**: This is a marker struct with no fields. Its associated functions handle deriving the PDA and performing SOL transfers for rent payments using `invoke_signed`.

### EpochMarker

file: `epoch_marker.rs`

- **Purpose**: An empty account created as a marker to signify that all temporary accounts associated with a specific NCN epoch have been successfully closed.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct EpochMarker {
    ncn: Pubkey,
    epoch: PodU64,
    slot_closed: PodU64,
}
```

- **Explanation**: Contains the `ncn`, the `epoch` that was closed, and the `slot_closed`. Its existence confirms cleanup completion for that epoch.

### EpochSnapshot

file: `epoch_snapshot.rs`

- **Purpose**: Captures the aggregated state of the NCN system at the beginning of a specific epoch snapshot phase.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct EpochSnapshot {
    /// The Pubkey of the NCN this snapshot is for
    ncn: Pubkey,
    /// The epoch this snapshot is for
    epoch: PodU64,
    /// Bump seed for the PDA
    bump: u8,
    /// Slot when this EpochSnapshot account was created
    slot_created: PodU64,
    /// Slot when the snapshotting process (including all operator delegations) was completed
    slot_finalized: PodU64,
    /// Number of operators in the epoch
    operator_count: PodU64,
    /// Number of vaults in the epoch
    vault_count: PodU64,
    /// Keeps track of the number of completed operator registration through `snapshot_vault_operator_delegation` and `initialize_operator_snapshot`
    operators_registered: PodU64,
    /// Keeps track of the number of valid operator vault delegations
    valid_operator_vault_delegations: PodU64,
    /// Tallies the total stake weights for all vault operator delegations
    stake_weights: StakeWeights,
}
```

- **Explanation**: Stores metadata (`ncn`, `epoch`, timestamps), counts (`operator_count`, `vault_count`), progress trackers, and the total aggregated `stake_weights` for the epoch.

### OperatorSnapshot

file: `epoch_snapshot.rs`

- **Purpose**: Captures the state of a single operator for a specific epoch, including their total delegated stake weight and a breakdown of contributions from each vault.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct OperatorSnapshot {
    operator: Pubkey,
    ncn: Pubkey,
    ncn_epoch: PodU64,
    bump: u8,
    slot_created: PodU64,
    slot_finalized: PodU64,
    is_active: PodBool,
    ncn_operator_index: PodU64,
    operator_index: PodU64,
    operator_fee_bps: PodU16,
    vault_operator_delegation_count: PodU64,
    vault_operator_delegations_registered: PodU64,
    valid_operator_vault_delegations: PodU64,
    stake_weights: StakeWeights,
    vault_operator_stake_weight: [VaultOperatorStakeWeight; MAX_VAULTS],
}
```

- **Explanation**: Contains operator/NCN identifiers, timestamps, status, indices, `operator_fee_bps`, delegation counts/progress, the operator's total `stake_weights`, and a detailed breakdown in `vault_operator_stake_weight`.

### VaultOperatorStakeWeight

file: `epoch_snapshot.rs`

- **Purpose**: A helper struct within `OperatorSnapshot` to store the calculated stake weight originating from one specific vault's delegation to that operator.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Zeroable, Pod)]
pub struct VaultOperatorStakeWeight {
    vault: Pubkey,
    vault_index: PodU64,
    stake_weight: StakeWeights,
}
```

- **Explanation**: Links a `vault` pubkey and `vault_index` to the specific `stake_weight` derived from its delegation to the parent `OperatorSnapshot`.

### StMintEntry

file: `vault_registry.rs`

- **Purpose**: Represents a supported token mint within the `VaultRegistry`, storing its address and associated voting weight.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct StMintEntry {
    /// The supported token ( ST ) mint
    st_mint: Pubkey,
    // Either a switchboard feed or a weight must be set
    /// The switchboard feed for the mint
    reserve_switchboard_feed: [u8; 32],
    /// The weight
    weight: PodU128,
}
```

- **Explanation**: Stores the `st_mint` address and its assigned voting `weight`. `reserve_switchboard_feed` is unused here.

### VaultEntry

file: `vault_registry.rs`

- **Purpose**: Represents a registered vault within the `VaultRegistry`.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct VaultEntry {
    /// The vault account
    vault: Pubkey,
    /// The supported token ( ST ) mint of the vault
    st_mint: Pubkey,
    /// The index of the vault in respect to the NCN account
    vault_index: PodU64,
    /// The slot the vault was registered
    slot_registered: PodU64,
}
```

- **Explanation**: Stores the `vault` address, the `st_mint` it holds, its assigned `vault_index`, and the `slot_registered`.

### VaultRegistry

file: `vault_registry.rs`

- **Purpose**: A global account for the NCN program instance that maintains the list of all supported token mints (`StMintEntry`) and all registered vaults (`VaultEntry`).
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct VaultRegistry {
    /// The Pubkey of the associated NCN account this registry belongs to.
    pub ncn: Pubkey,
    /// Bump seed for the PDA
    pub bump: u8,
    /// Array storing entries for each supported token mint
    pub st_mint_list: [StMintEntry; MAX_ST_MINTS],
    /// Array storing entries for each vault
    pub vault_list: [VaultEntry; MAX_VAULTS],
}
```

- **Explanation**: Holds the `ncn` identifier, `bump`, and arrays for `st_mint_list` and `vault_list`.

### WeightTable

file: `weight_table.rs`

- **Purpose**: An epoch-specific account that snapshots the weights of all supported tokens at the beginning of the epoch.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct WeightTable {
    /// The Pubkey of the associated NCN account this account is for.
    ncn: Pubkey,
    /// The epoch this account is for.
    epoch: PodU64,
    /// Slot when this WeightTable account was created.
    slot_created: PodU64,
    /// Number of vaults in tracked mints at the time of creation
    vault_count: PodU64,
    /// Bump seed for the PDA
    bump: u8,
    /// A snapshot copy of the relevant vault entries from the VaultRegistry
    vault_registry: [VaultEntry; MAX_VAULTS],
    /// The weight table
    table: [WeightEntry; MAX_ST_MINTS],
}
```

- **Explanation**: Contains metadata (`ncn`, `epoch`, `slot_created`, `vault_count`), a snapshot of the `vault_registry`, and the main `table` holding `WeightEntry` structs with the frozen weights for the epoch.

### EpochAccountStatus

file: `epoch_state.rs`

- **Purpose**: A helper struct within `EpochState` used to track the lifecycle status of various temporary accounts associated with a specific epoch.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, ShankType, Pod)]
#[repr(C)]
pub struct EpochAccountStatus {
    /// Status of the main EpochState account itself.
    epoch_state: u8,
    /// Status of the WeightTable account for this epoch.
    weight_table: u8,
    /// Status of the main EpochSnapshot account for this epoch.
    epoch_snapshot: u8,
    /// Status array for each individual OperatorSnapshot account.
    operator_snapshot: [u8; MAX_OPERATORS],
    /// Status of the BallotBox account for this epoch.
    ballot_box: u8,
}
```

- **Explanation**: Uses `u8` fields to represent the status of various temporary accounts associated with a specific epoch.

### NCNRewardRouter

file: `ncn_reward_router.rs`

- **Purpose**: The main entry point for routing rewards from NCNs. This router receives rewards and distributes them according to the fee structure.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct NCNRewardRouter {
    /// NCN the account is associated with
    ncn: Pubkey,
    /// The epoch the account is associated with
    epoch: PodU64,
    /// Bump seed for the PDA
    bump: u8,
    /// Slot the account was created
    slot_created: PodU64,
    /// Total rewards routed (in lamports) - cumulative amount ever processed
    total_rewards: PodU64,
    /// Amount of rewards in the reward pool (in lamports) - awaiting distribution
    reward_pool: PodU64,
    /// Amount of rewards processed (in lamports) - moved out of reward pool for distribution
    rewards_processed: PodU64,
    /// Reserved space for future fields
    reserved: [u8; 128],
    /// Last vote index processed during routing (for resuming partial operations)
    last_vote_index: PodU16,
    /// Last rewards amount being processed during routing (for resuming partial operations)
    last_rewards_to_process: PodU64,
    /// Rewards allocated to the Protocol (ready for distribution)
    protocol_rewards: PodU64,
    /// Rewards allocated to the NCN (ready for distribution)
    ncn_rewards: PodU64,
    /// Total rewards allocated to operator-vault reward receivers (before individual routing)
    operator_vault_rewards: PodU64,
    /// Individual operator reward routes - tracks rewards per operator
    /// Array size 256 limits the number of operators that can participate in an epoch
    operator_vault_reward_routes: [OperatorVaultRewardRoute; 256],
}
```

- **Explanation**: The router distributes rewards in three tiers: 4% to Protocol, 4% to NCN, and 92% to operator-vault rewards. It supports partial routing through iterations to handle large numbers of operators without hitting transaction limits.

### OperatorVaultRewardRouter

file: `operator_vault_reward_router.rs`

- **Purpose**: Routes rewards from operators to their associated vaults. This router handles the final stage of reward distribution where operator rewards are further distributed to the vaults they operate.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, AccountDeserialize, ShankAccount)]
#[repr(C)]
pub struct OperatorVaultRewardRouter {
    /// The operator the router is associated with
    operator: Pubkey,
    /// The NCN the router is associated with
    ncn: Pubkey,
    /// The epoch the router is associated with
    epoch: PodU64,
    /// The bump seed for the PDA
    bump: u8,
    /// The slot the router was created
    slot_created: PodU64,
    /// The operator's index within the NCN
    ncn_operator_index: PodU64,
    /// The total rewards that have been routed (in lamports) - cumulative amount ever processed
    total_rewards: PodU64,
    /// The rewards in the reward pool (in lamports) - awaiting distribution
    reward_pool: PodU64,
    /// The rewards that have been processed (in lamports) - moved out of reward pool
    rewards_processed: PodU64,
    /// Rewards allocated to the operator (in lamports) - operator's fee portion
    operator_rewards: PodU64,
    /// The last rewards amount being processed during routing (for resuming partial operations)
    last_rewards_to_process: PodU64,
    /// The last vault operator delegation index processed during routing
    last_vault_operator_delegation_index: PodU16,
    /// Individual vault reward routes - tracks rewards per vault (limited to 64 vaults)
    vault_reward_routes: [VaultRewardRoute; 64],
}
```

- **Explanation**: The distribution is based on the operator taking their fee percentage first, then remaining rewards are distributed to vaults proportionally by stake weight. It supports partial routing through iterations to handle large numbers of vaults.

### OperatorVaultRewardRoute

file: `ncn_reward_router.rs`

- **Purpose**: A component structure within `NCNRewardRouter` that tracks rewards allocated to a specific operator within the reward routing system.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, ShankType)]
#[repr(C)]
pub struct OperatorVaultRewardRoute {
    /// The operator pubkey
    operator: Pubkey,
    /// Reward amount allocated to this operator
    rewards: NCNRewardRouterRewards,
}
```

- **Explanation**: Stores the mapping between an operator and their allocated reward amount within the NCN reward routing system.

### VaultRewardRoute

file: `operator_vault_reward_router.rs`

- **Purpose**: A component structure within `OperatorVaultRewardRouter` that tracks rewards allocated to a specific vault within the operator's reward distribution.
- **Definition**:

```rust
#[derive(Debug, Clone, Copy, Zeroable, Pod, ShankType)]
#[repr(C)]
pub struct VaultRewardRoute {
    /// The vault pubkey that will receive rewards
    vault: Pubkey,
    /// The amount of rewards allocated to this vault (in lamports)
    rewards: PodU64,
}
```

- **Explanation**: Stores the mapping between a vault and its allocated reward amount within an operator's reward distribution system.
