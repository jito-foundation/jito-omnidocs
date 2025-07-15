---
title: Integration & Composability
order: 4
subtitle: 'Building with validator history data'
section_type: page
---

The Validator History Program's unified data structure enables seamless integration with other on-chain programs and off-chain applications, creating a composable foundation for validator analysis and automated decision-making.

## How Other Programs Access Data

### Direct Account Reading

On-chain programs can directly read ValidatorHistory accounts using standard Solana account access patterns:

```rust
#[derive(Accounts)]
pub struct ReadValidatorHistory<'info> {
    #[account(
        seeds = [ValidatorHistory::SEED, vote_account.key().as_ref()],
        seeds::program = validator_history::ID,
        bump
    )]
    pub validator_history_account: AccountLoader<'info, ValidatorHistory>,
    
    #[account(owner = vote::program::ID)]
    pub vote_account: AccountInfo<'info>,
}
```

### Account Discovery

Programs can find ValidatorHistory accounts using predictable seed derivation:
- **Seed pattern**: `["validator-history", vote_account_pubkey]`
- **Program ID**: The Validator History Program ID (`HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa`)
- **Deterministic addresses**: Every vote account has a corresponding ValidatorHistory account

### Data Parsing Best Practices

**Circular Buffer Navigation**:
```rust
// Access latest validator data
let latest_entry = validator_history.history.last();

// Query specific epoch range
let epoch_range = validator_history.history.epoch_range(start_epoch, end_epoch);

// Check for valid data (non-default values)
if entry.commission != u8::MAX {
    // Process valid commission data
}
```

## Integration Examples

### Jito Steward Program

The [Jito Steward Program](/stakenet/jito-steward/program-overview/) serves as the primary example of deep integration with Validator History data:

#### Validator Scoring Algorithm:

- **Vote Credits Score**: Uses `epoch_credits_range_normalized()` to measure consensus participation over multiple epochs
- **Commission Score**: Analyzes `commission_range()` to evaluate commission stability and competitiveness
- **MEV Commission Score**: Incorporates `mev_commission_range()` for validators running Jito clients
- **Historical Perfomance**: Combines multiple epochs of data for robust scoring rather than single-epoch snapshots

#### Eligibility Filtering:

- **Superminority Check**: Uses `superminority_latest()` to exclude validators that would concentrate stake
- **Perfomance Thresholds**: Filters validators based on minimum epoch credits requirements
- **Commission Limits**: Applies maximum commission thresholds from historical data
- **Blacklist Management**: Maintains on-chain blacklist of problematic validators

#### Stake Allocation Logic:

- **Score-Based Ranking**: Ranks eligible validators using composite scores from historical data
- **Diversification**: Considers validator geographic and client distribution from gossip data
- **Rebalancing**: Uses historical perfomance trends to guide stake reallocation decisions

#### Automated Decision Making

- **512 Epochs of Context**: Leverages full historical depth for informed validator evaluation
- **Transparent Criteria**: All scoring logic is on-chain and auditable
- **No External Dependencies**: Entirely self-contained using ValidatorHistory data

## Development Patterns & Best Practices

### Efficient Data Access

**Latest Value Queries**:
```rust
// Optimized for current state
let current_commission = validator_history.history.commission_latest();
let current_stake = validator_history.history.last()?.activated_stake_lamports;
```

**Historical Range Analysis**:
```rust
// Efficient range queries with automatic null handling
let commission_history = validator_history.history.commission_range(
    start_epoch, 
    end_epoch
);
```

## Integration Architecture Patterns

### On-Chain Integration

**Direct Program Composition**:

- Programs read ValidatorHistory accounts as additional context
- Decision-making logic incorporates historical performance
- Eliminates dependency on external data sources

**State Machine Integration**:

- Validator history informs state transitions
- Historical context enables sophisticated automation
- Transparent, verifiable decision criteria

### Off-Chain Integration

**Analytics and Dashboards**:

- [Stakenet History Dashboard](https://www.jito.network/stakenet/history/): Interactive validator perfomance monitoring and historical analysis
- Real-time validator metrics visualization with 512 epochs of data
- Comparative validator analysis and ranking tools
- Historical trend analysis across performance dimensions

## Composability Benefits

### Single Source of Truth

**Eliminates Data Fragmentation**:

- All validator metrics in one standardized location
- Consistent data formats across different applications
- Reduced integration complexity for developers

**Infrastructure Efficiency**:

- No need to maintain separate historical databases
- Shared data infrastructure across the ecosystem
- Lower operational costs for validator analysis tools

### Programmable Transparency

**Verifiable Decision Making**:

- All historical data is publicly auditable
- Algorithm transparency through on-chain logic
- Reduced trust requirements for automated systems

**Standardized Metrics**:

- Common performance indicators across applications
- Comparable results between different analysis tools
- Network-wide consistency in validator evaluation

This composable architecture enables a thriving ecosystem of validator analysis tools, automated stake management systems, and transparent network monitoring applications, all built on a shared foundation of verified historical data.
