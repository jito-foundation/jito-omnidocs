---
title: Rebalance System
order: 1
subtitle: 'How StakeNet rebalances among validators'
section_type: page
---

# Rebalance System

Over time, as people deposit SOL into the reserve, or as validator performance varies, you will want to move stake around.
The best way to do this will be through an automated system to collect information about the stake pool and the network, and decide how much stake to allocate to each validator.

## How It Works

The rebalance system automatically adjusts stake allocation across validators based on performance and pool conditions.
Here's the step-by-step process:

1. **State Transition Check**: Automatically transitions between system states based on current conditions and timing parameters
    
    #### State Types

    - **Idle**: Waiting state, monitors for when to begin operations
    - **ComputeScores**: Evaluates validator performance metrics
    - **ComputeDelegations**: Calculates optimal stake distribution
    - **ComputeInstantUnstake**: Determines validators that need immediate unstaking
    - **Rebalance**: Executes the actual stake movement operations

    #### Transition Logic

    The system uses `maybe_transition()` to check if a state change is needed:

    - Compares current state before and after transition attempt
    - Considers current epoch, slot, and epoch progress
    - Uses configurable parameters like `num_epochs_between_scoring`
    - Emits `StateTransition` events when state changes occur
    - Each state has its own transition conditions based on timing and system parameters

2. **State Validation**: Performs comprehensive state checks to ensure system integrity before executing `Rebalance` operations

    #### State Validation Checks
    
    Before executing any rebalance operations, the system performs critical validation through state_checks():
    
    ##### System Status Checks:

    - **Pause Check**: Ensures the system is not paused (StateMachinePaused error if paused)
    - **State Verification**: Confirms current state matches expected state (must be Rebalance for rebalance operations)

    ##### Epoch Synchronization:

    - **Epoch Alignment**: Verifies current epoch matches the state account's tracked epoch
    - **Maintenance Complete**: Ensures epoch maintenance has been completed before proceeding

    ##### Validator List Integrity:

    - **Removal Queue**: Confirms no validators are pending immediate removal
    - **List Consistency**: Validates that validator count matches between state tracking and actual validator list
    - **Mapping Verification**: Ensures 1-to-1 correspondence between pool validators and validator list entries

3. **Validator Verification**: Ensures the target validator exists in the validator list and matches the vote account

4. **Vote Account Validation**: Checks if vote account is valid or if validator needs to be marked for removal

5. **Stake Analysis**: Analyzes current stake account state and calculates active lamports

6. **Rebalance Decision**: Determines the appropriate rebalance action based on:
    - Current stake pool lamports
    - Reserve lamports
    - Active stake lamports
    - Minimum delegation requirements
    - Rent requirements

    #### Rebalance Decision Engine

    The core rebalance logic processes each validator individually and determines the optimal action based on multiple factors:
    
    ##### Pre-Processing Checks

    - Cycle Validation: Ensures current epoch is within the rebalance cycle
    - Progress Tracking: Skips validators already processed in this cycle
    - Removal Status: Bypasses validators marked for deletion or immediate removal
    - Transient State: Checks if validator has pending transient stake operations

    ##### Financial Calculations
    
    ###### Reserve Management:

    - Calculates minimum reserve needed for rent across all remaining validators
    - Determines available reserve lamports after accounting for system requirements
    - Factors in base costs (minimum delegation + stake rent) for each validator

    ###### Target vs Current Analysis:

    - Computes target lamports based on delegation percentages and total pool stake
    - Compares against current validator stake (minus minimum delegation)
    - Tracks validator lamport balances to detect stake deposit deltas

    ##### Decision Logic

    The system determines rebalance type through a three-tier evaluation:
    
    ###### Decrease Stake Conditions
    
    **Triggers when**:

    - Current stake exceeds target allocation, OR
    - Validator is marked for instant unstake
    - No transient stake operations pending

    **Unstaking Caps Applied**:

    - Scoring Unstake Cap: Limits stake reduction based on performance scoring
    - Instant Unstake Cap: Controls emergency unstaking amounts
    - Stake Deposit Unstake Cap: Manages withdrawal of recent deposits

    **Delegation Redistribution**:
    For instant unstake scenarios, the system automatically redistributes the validator's delegation percentage to other eligible validators by adjusting their denominators.
    
    ###### Increase Stake Conditions
    
    **Triggers when**:

    - Current stake is below target allocation
    - Sufficient reserve lamports available
    - No transient stake operations pending

    **No Action**
    
    **When current allocation is optimal or constraints prevent changes**

    ##### State Updates

    After determining rebalance type, the system updates:

    - Validator lamport balances to reflect new stake levels
    - Unstake totals across different categories (scoring, instant, stake deposit)
    - Delegation percentages for instant unstake redistribution
    - Progress tracking to mark validator as processed

## Rebalance Types

The system supports three types of rebalance operations:

### Increase Stake

- When: Validator performance is good and needs more stake
- Actions: Moves SOL from reserve to validator's stake account
- Parameters:
    - Target lamports amount
    - Transient seed

### Decrease Stake

- When: Validator underperforming or stake needs redistribution
- Action: Moves stake back to reserve using transient stake account
- Parameters: 
    - Total unstake lamports
    - Decrease components

### No Action

- When: Current stake allocation is optimal
- Action: No stake movement required

## Execution

The rebalance system operates on a one-instruction-per-validator model where:

- [Keeper]() calls the rebalance instruction individually for each validator in the pool
- Each instruction processes a single validator and determines its optimal stake allocation
The system maintains progress tracking to ensure each validator is processed exactly once per cycle
Keepers can process validators in any order, allowing for parallel or distributed execution

Keeper Implementation
The keeper automates the rebalance process by:
Validator Discovery:

Identifies unprogressed validators using get_unprogressed_validators()
Filters validators that haven't been processed in the current rebalance cycle
Maintains validator history program compatibility

Instruction Generation:

Creates individual rebalance instructions for each validator
Derives required account addresses (stake, transient stake) per validator
Packages all required accounts for each instruction including:

Config and state accounts
Validator-specific accounts (vote, stake, transient stake, history)
System programs and sysvars



Transaction Management:

Packages instructions into optimized transactions (configurable batch size)
Handles priority fees and compute unit limits
Submits transactions with retry logic and timeout handling
Provides execution statistics and monitoring

Parallel Processing:
Since each validator is processed independently, keepers can:

Run multiple transactions concurrently
Distribute workload across multiple keeper instances
Resume processing from any point without duplicating work

This design enables efficient, granular control over stake rebalancing while maintaining system integrity through built-in progress tracking and state validation.
