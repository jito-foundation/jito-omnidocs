---
title: Permissionless Cranker
order: 0
subtitle: ''
section_type: page
---

## Overview

The Tip Router Keeper is a critical component of the Jito Tip Router system that manages epoch-based operations for validators, operators, and vaults on the Solana blockchain. It orchestrates the complete lifecycle of an epoch, from weight setting to reward distribution, ensuring proper consensus and state transitions.

## Architecture

### Core Components

1. **KeeperState** - Manages the state of the keeper across epochs
2. **Epoch Management** - Handles epoch progression and state transitions
3. **Metrics System** - Emits comprehensive metrics for monitoring
4. **Error Handling** - Robust error management with timeouts and retries

### Key Data Structures

#### KeeperState
The `KeeperState` struct maintains all essential addresses and state information:

```rust
pub struct KeeperState {
    pub epoch: u64,
    pub ncn: Pubkey,
    pub vaults: Vec<Pubkey>,
    pub operators: Vec<Pubkey>,
    pub tip_router_config_address: Pubkey,
    pub vault_registry_address: Pubkey,
    pub epoch_state_address: Pubkey,
    // ... additional addresses and state
}
```

## Epoch Lifecycle

The keeper follows a well-defined state machine for each epoch:

### State Progression

1. **SetWeight** - Establishes vault weights for the epoch
2. **Snapshot** - Captures operator and vault snapshots
3. **Vote** - Operators vote on the merkle root
4. **PostVoteCooldown** - Waiting period after voting
5. **Distribute** - Distributes rewards to participants
6. **Close** - Closes epoch accounts and finalizes

### Epoch Progression Logic

The keeper uses the `progress_epoch` function to determine when to advance:

- **New Epoch Detection**: Automatically progresses when a new epoch begins
- **Completion Handling**: Resets to starting epoch when current epoch is complete
- **Stall Recovery**: Advances to next epoch when stalls are detected

## Main Loop Operations

### A. Progress Epoch
Determines which epoch the keeper should work on based on:
- Current blockchain epoch
- Completion status of epochs
- Stall detection

### B. Emit NCN Metrics
Collects and emits comprehensive metrics including:
- Validator information
- Epoch statistics
- Ticket states
- Account balances

### C. Register Vaults
Ensures all vaults are properly registered with the Global Vault Registry before processing begins.

### D. Fetch Keeper State
Updates the internal state with current epoch information and account data.

### E. Update Epoch State
Synchronizes with on-chain epoch state accounts to maintain consistency.

### F. Create or Complete State
- Creates new epoch state if none exists
- Detects and handles completed epochs

### G. Crank State Operations
Executes state-specific operations based on current epoch state:

```rust
match current_state {
    State::SetWeight => crank_set_weight(handler, state.epoch).await,
    State::Snapshot => crank_snapshot(handler, state.epoch).await,
    State::Vote => crank_vote(handler, state.epoch, test_vote).await,
    State::PostVoteCooldown => crank_post_vote_cooldown(handler, state.epoch).await,
    State::Distribute => crank_distribute(handler, state.epoch).await,
    State::Close => crank_close_epoch_accounts(handler, state.epoch).await,
}
```

### H. Emit Epoch Metrics
Provides detailed metrics for the current epoch state and progress.

### I. Detect Stall
Identifies when the epoch is stuck and needs to progress:
- Voting completion
- Insufficient rewards for distribution
- Other blocking conditions

## Metrics System

The keeper emits comprehensive metrics for monitoring and alerting:

### NCN Metrics
- **Epoch and Slot Information**: Current blockchain state
- **Validator Data**: Opted-in validators and their stake
- **Vault Information**: Token amounts, delegation states
- **Operator Status**: Fee rates, voting status, delegation counts

### Epoch Metrics
- **State Information**: Current epoch state and progress
- **Weight Tables**: Vault weights and mint information
- **Snapshots**: Operator and epoch snapshots
- **Voting Data**: Ballot box state, votes, and consensus
- **Rewards**: Base and NCN reward distributions

### Key Metric Categories

1. **Heartbeat Metrics**: Keeper operation status
2. **Error Metrics**: Failure tracking and debugging
3. **State Progress**: Epoch advancement tracking
4. **Financial Metrics**: Reward distribution and balances

## Configuration and Deployment

### Operating Modes

The keeper supports several operating modes:

- **Full Operations** (`run_operations = true`): Complete epoch management
- **Metrics Only** (`metrics_only = true`): Only emit metrics without state changes
- **Migration Mode** (`run_migration = true`): Special migration operations

### Error Handling

The keeper implements robust error handling:

```rust
pub async fn check_and_timeout_error<T>(
    title: String,
    result: &Result<T>,
    error_timeout_ms: u64,
    keeper_epoch: u64,
    cluster_name: &str,
) -> bool
```

- Automatic error detection and logging
- Configurable timeout periods
- Metric emission for monitoring
- Graceful degradation

### Timeouts

Two types of timeouts are implemented:

1. **Error Timeout**: Applied after errors occur
2. **Keeper Timeout**: Main loop iteration delay

## Stall Detection

The keeper implements sophisticated stall detection:

### Stall Conditions

1. **Voting States**: During `Vote` and `PostVoteCooldown` states
2. **Low Rewards**: When rewards are below distribution threshold (< 10,000 lamports)
3. **Account Dependencies**: When required accounts are not ready

### Stall Recovery

When stalls are detected:
- The keeper logs the stall condition
- Progresses to the next epoch after timeout
- Continues monitoring for resolution

## Best Practices

### Monitoring
- Monitor heartbeat metrics for keeper health
- Track error rates and types
- Watch epoch progression timing
- Alert on extended stalls

### Deployment
- Configure appropriate timeout values
- Ensure sufficient account funding
- Monitor resource usage
- Implement proper logging

### Maintenance
- Regular state verification
- Account balance monitoring
- Performance optimization
- Error pattern analysis

## Troubleshooting

### Common Issues

1. **Epoch Stalls**: Check voting completion and reward amounts
2. **Account Errors**: Verify account addresses and funding
3. **Network Issues**: Monitor RPC connectivity and performance
4. **State Inconsistencies**: Verify on-chain state synchronization

### Debugging

- Review error metrics for patterns
- Check epoch state progression
- Verify account balances and states
- Monitor network conditions

## Security Considerations

- The keeper operates with limited privileges
- All state changes require proper authorization
- Error handling prevents infinite loops
- Timeouts prevent resource exhaustion
- Comprehensive logging for audit trails

## Future Enhancements

Potential areas for improvement:
- Dynamic timeout adjustment
- Enhanced stall detection algorithms
- Improved error recovery mechanisms
- Advanced metrics and monitoring
- Performance optimizations