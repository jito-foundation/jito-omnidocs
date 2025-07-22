---
title: Data Fields Explained
order: 3
subtitle: 'Comprehensive breakdown of validator metrics and data sources'
section_type: page
---

The Validator History Program tracks diverse validator metrics from multiple sources.
Understanding these data fields is essential for effective validator analysis and selection.

## Runtime-Accessible Fields

*Data directly available from Solana's runtime*

### Epoch Credits (`epoch_credits`)
- **What**: Number of successful votes cast by the validator in the current epoch
- **Why it matters**: Primary measure of validator performance and consensus participation
- **Collection**: Automatically gathered from vote account data each epoch
- **Special handling**: Normalized for Timely Vote Credits (TVC) changes to maintain historical consistency

### Commission (`commission`)
- **What**: Validator's commission rate as a percentage (0-100)
- **Why it matters**: Directly affects delegator rewards and validator economics
- **Collection**: Retrieved from vote account configuration
- **Usage**: Lower commission generally means higher rewards for delegators

### MEV Commission (`mev_commission`)
- **What**: Maximum Extractable Value commission rate in basis points
- **Why it matters**: Shows validator's MEV sharing policy with delegators
- **Collection**: Tracked from integration with Jito tip distribution program
- **Note**: Only applicable for validators running Jito-Solana client

### MEV Earned (`mev_earned`)
- **What**: MEV rewards earned by the validator (stored as 1/100th SOL)
- **Why it matters**: Indicates validator's MEV generation capability and additional rewards
- **Example**: Value of 150 = 1.50 SOL earned in MEV rewards
- **Collection**: Aggregated from tip distribution data

## Gossip Network Fields

*Data from Solana's peer-to-peer gossip network*

### IP Address (`ip`)
- **What**: Validator's IPv4 address as a 4-byte array
- **Why it matters**: Enables network topology analysis and geographic distribution studies
- **Collection**: Extracted from gossip ContactInfo messages
- **Limitations**: IPv6 addresses are not currently supported

### Client Version (`version`)
- **What**: Software version in major.minor.patch format
- **Why it matters**: Track software adoption, compatibility, and network upgrades
- **Collection**: From gossip version messages broadcast by validators
- **Usage**: Helps monitor network-wide software update progress

### Client Type (`client_type`)
- **What**: Software client implementation identifier
- **Values**: 
  - `0` = Solana Labs
  - `1` = Jito Labs
  - `2` = Firedancer
  - `3` = Agave
  - `>3` = Other implementations
- **Why it matters**: Monitor client diversity and Jito adoption rates
- **Collection**: Derived from version information in gossip messages

## Permissioned Network Data

*Requires oracle authority but easily verifiable through RPC calls*

### Activated Stake (`activated_stake_lamports`)
- **What**: Total active stake delegated to the validator in lamports
- **Why it matters**: Primary factor in validator selection algorithms and network influence
- **Collection**: Derived from `getVoteAccounts` RPC call data
- **Verification**: Can be independently verified by anyone using Solana RPC

### Validator Rank (`rank`)
- **What**: Validator's position when ranked by total active stake (1 = highest stake)
- **Why it matters**: Shows validator's relative influence and selection probability
- **Collection**: Calculated by sorting all validators by stake amount
- **Usage**: Lower rank numbers indicate higher stake and network influence

### Superminority Status (`is_superminority`)
- **What**: Boolean indicator of superminority membership (0 = false, 1 = true)
- **Why it matters**: Critical for network decentralization and security analysis
- **Collection**: Calculated based on cumulative stake thresholds
- **Definition**: Validators that collectively control >33% of total network stake

## Metadata Fields

### Epoch (`epoch`)
- **What**: The Solana epoch number when this data was recorded
- **Why it matters**: Provides temporal indexing for historical analysis and trend tracking
- **Range**: 16-bit unsigned integer (0-65,535)

### Last Update Slot (`vote_account_last_update_slot`)
- **What**: Most recent slot when the validator's vote account was updated
- **Why it matters**: Indicates data freshness for commission and epoch credit information
- **Usage**: Helps determine if validator data is current or stale

## Data Handling & Validation

### Default Value Strategy
The program uses a sophisticated approach to handle missing or unset data:
- **Null representation**: Unset fields use maximum values for their data type (`u64::MAX`, `u8::MAX`, etc.)
- **Zero vs. unset**: This allows distinction between legitimate zero values and missing data
- **Query handling**: Applications can easily check if data exists before processing

### Data Integrity
- **Immutable history**: Once written to the blockchain, historical data cannot be altered
- **Independent verification**: All permissioned fields can be verified through standard Solana RPC calls
- **Timestamp tracking**: Gossip data includes timestamps to prevent replay of old information

### Access Patterns
The program provides optimized methods for common data access patterns:
- **Latest values**: `commission_latest()`, `mev_commission_latest()`, etc.
- **Range queries**: `commission_range(start_epoch, end_epoch)` for historical analysis
- **Normalized access**: Automatic handling of network changes like TVC activation

Understanding these data fields enables developers to build sophisticated validator analysis tools, stake pool managers to make informed decisions, and network participants to monitor validator performance transparently.
