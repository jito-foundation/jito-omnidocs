---
title: Data Fields Explained
order: 3
subtitle: 'Comprehensive breakdown of validator metrics and data sources'
section_type: page
---

The Validator History Program tracks diverse validator metrics from multiple sources.
Understanding these data fields is essential for effective validator analysis and selection.

## Activated Stake (`activated_stake_lamports`)
- **What**: The total amount of active stake delegated to the validator in lamports
- **Why it matters**: Primary factor in validator selection algorithms and network influence

## Epoch (`epoch`)
- **What**: The Solana epoch number when this data was recorded
- **Why it matters**: Provides temporal indexing for historical analysis and trend tracking
- **Range**: 16-bit unsigned integer (0-65,535)

## MEV Commission (`mev_commission`)
- **What**: Maximum Extractable Value commission rate in basis points
- **Why it matters**: Shows validator's MEV sharing policy with delegators

## Epoch Credits (`epoch_credits`)
- **What**: Number of successful votes cast by the validator in the current epoch
- **Why it matters**: Primary measure of validator performance and consensus participation

## Commission (`commission`)
- **What**: Validator's commission rate as a percentage (0-100)
- **Why it matters**: Directly affects delegator rewards and validator economics

## Client Type (`client_type`)
- **What**: Software client implementation identifier
- **Values**: 
  - `0` = Solana Labs
  - `1` = Jito Labs
  - `2` = Firedancer
  - `3` = Agave
  - `>3` = Other implementations
- **Why it matters**: Monitor client diversity
- **Collection**: Derived from version information in gossip messages

## Client Version (`version`)
- **What**: Software version in major.minor.patch format
- **Why it matters**: Track software adoption, compatibility, and network upgrades
- **Collection**: From gossip version messages broadcast by validators
- **Usage**: Helps monitor network-wide software update progress

## IP Address (`ip`)
- **What**: Validator's IPv4 address as a 4-byte array
- **Why it matters**: Enables network topology analysis and geographic distribution studies
- **Collection**: Extracted from gossip ContactInfo messages

## Superminority Status (`is_superminority`)
- **What**: Boolean indicator of superminority membership (0 = false, 1 = true)
- **Why it matters**: Critical for network decentralization and security analysis
- **Collection**: Calculated based on cumulative stake thresholds
- **Definition**: Validators that collectively control >33% of total network stake

## Validator Rank (`rank`)
- **What**: Validator's position when ranked by total active stake (1 = highest stake)
- **Why it matters**: Shows validator's relative influence and selection probability
- **Collection**: Calculated by sorting all validators by stake amount
- **Usage**: Lower rank numbers indicate higher stake and network influence

## Last Update Slot (`vote_account_last_update_slot`)
- **What**: Most recent slot when the validator's vote account was updated
- **Why it matters**: Indicates data freshness for commission and epoch credit information
- **Usage**: Helps determine if validator data is current or stale

## MEV Earned (`mev_earned`)
- **What**: MEV rewards earned by the validator (stored as 1/100th SOL)
- **Why it matters**: Indicates validator's MEV generation capability and additional rewards
- **Example**: Value of 150 = 1.50 SOL earned in MEV rewards
- **Collection**: Aggregated from tip distribution data

Understanding these data fields enables developers to build sophisticated validator analysis tools, stake pool managers to make informed decisions, and network participants to monitor validator performance transparently.
