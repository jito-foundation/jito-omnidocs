---
title: Technical Architecture
order: 2
subtitle: 'On-chain data structures and stroage architecture'
section_type: page
---

The Validator History Program employs technical architecture designed for efficient on-chain storage and retrieval of historical validator data.

## Core Account Structure

### Config Account

The [`Config`](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L18) account defines the global configuration of validator history program.

- **Admin Management**: Tracks administrative authorities
- **Oracle Permissions**: Manages data upload permissions
- **Program Integration**: Links to [tip distribution program](https://github.com/jito-foundation/jito-programs/blob/master/mev-programs/programs/tip-distribution/Cargo.toml)
- **Counter Tracking**: Monitors total ValidatorHistory accounts

### ValidatorHistory Account

The [`ValidatorHistory`](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L359) account serves as the primary data container for each validator.

**Key Components:**
- **Size**: [65,848 bytes](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L355) per validator account
- **Storage Capacity**: Up to 512 epochs of historical data
- **Zero-Copy Design**: Implements `bytemuck::{Pod, Zeroable}` traits for efficient memory management
- **Unique Identifier**: Each account is indexed and linked to a specific vote account

#### Circular Buffer Implementation

At the heart of each ValidatorHistory account lies the `CircBuf` - a circular buffer that efficiently manages historical data storage:

**Buffer Characteristics:**
- **Fixed Size**: 512 entries maximum (`MAX_ITEMS = 512`)
- **Wrap-Around Behavior**: Automatically overwrites oldest data when capacity is reached
- **Index Tracking**: Maintains current position with `idx` pointer
- **Empty State Management**: Tracks buffer state to handle initialization

**Memory Efficiency:**
The circular buffer prevents account bloat by maintaining a constant size regardless of how much historical data has been collected.
When new epochs are added beyond the 512-entry limit, the oldest entries are automatically overwritten.

#### Data Structure Design

##### ValidatorHistoryEntry

Each epoch's data is stored in a [`ValidatorHistoryEntry`](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L43) struct (128 bytes) containing:

**Performance Metrics:**

```rust
pub epoch_credits: u32,          // Vote credits earned
pub commission: u8,              // Validator commission percentage
pub mev_commission: u16,         // MEV commission in basis points
pub mev_earned: u32,             // MEV rewards (stored as 1/100th SOL)
```

**Validator Information:**

```rust
pub ip: [u8; 4],                 // IPv4 address
pub version: ClientVersion,      // Software version (major.minor.patch)
pub client_type: u8,             // Client type
```

**Stake Data:**

```rust
pub activated_stake_lamports: u64, // Total active stake
pub rank: u32,                     // Validator rank by stake
pub is_superminority: u8,          // Superminority status (0/1)
```

**Metadata:**

```rust
pub epoch: u16,                           // Epoch number
pub vote_account_last_update_slot: u64,   // Last update slot
```

### ClusterHistory Account

The [`ClusterHistory`](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L791) account serves as the primary data for cluster.

- **Network Metrics**: Stores cluster-wide statistics
- **Block Production**: Tracks total blocks per epoch
- **Timestamp Data**: Records epoch start times
- **Same Architecture**: Uses identical circular buffer design

#### Data Structure Design

##### ClusterHistoryEntry

Each epoch's data is stored in a [`ClusterHistoryEntry`](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L802) struct containing:


**Cluster Information**

```rust
pub total_blocks: u32,              // Total blocks
pub epoch: u16,                     // Epoch number
pub epoch_start_timestamp: u64      // Timestamp number
```


## Memory and Performance Optimizations

**Zero-Copy Architecture**: Eliminates runtime memory allocation overhead by using fixed-size structures that can be directly mapped to account data.

**Efficient Storage Layout**: C-style struct alignment ensures optimal memory usage and prevents compiler-added padding.

**Batch Operations**: Support for bulk updates of historical data without individual transaction overhead.

**Normalized Data Access**: Built-in handling for network changes like Timely Vote Credits (TVC) activation.

This architecture enables the Validator History Program to provide comprehensive historical data access while maintaining the performance and cost-efficiency required for on-chain operations.
