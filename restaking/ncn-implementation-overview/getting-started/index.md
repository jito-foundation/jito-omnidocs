---
title: Getting Started
order: 30
subtitle: Getting started with building our sample NCN
section_type: page
---

## Get to know the program template

Our example NCN Program facilitates consensus on a simple "weather status" using a stake-weighted voting mechanism. It operates in distinct time periods called epochs (your NCN's epochs do not have to be equivalent to a Solana epoch). The program uses a weight-based system to determine the influence (voting power) of different operators. Consensus is achieved when votes representing at least 66% of the total participating stake weight agree on the same outcome (ballot).

### Key components

The program uses several types of accounts:

1. **Global Accounts**: Initialized once at the start and updated infrequently.
    - **[`Config`](#config)**: Stores global settings like epoch timing parameters (`epochs_before_stall`, `epochs_after_consensus_before_close`) and voting validity periods (`valid_slots_after_consensus`).
    - **[`VaultRegistry`](#vaultregistry)**: Manages the list of registered vaults and the different types of stake tokens (mints) the NCN supports.
    - **[`AccountPayer`](#accountpayer)**: An empty PDA account used to hold SOL temporarily for paying rent during account creation or reallocation.
2. **Per-Consensus Cycle Accounts**: Initialized at the beginning of each epoch and usually closed shortly after the cycle ends.
    - **[`WeightTable`](#weighttable)**: Stores the specific voting weights assigned to different stake tokens for the current epoch.
    - **[`EpochState`](#epochaccountstatus)**: Tracks the status and progress of the current epoch's consensus cycle.
    - **[`BallotBox`](#ballotbox)**: Handles the collection and stake-weighted tallying of votes for the current epoch's decision (e.g., weather status).
    - **[`EpochSnapshot`](#epochsnapshot)**: Captures the state of stake delegations at the beginning of the epoch to ensure consistent voting weights throughout the cycle.
    - **[`OperatorSnapshot`](#operatorsnapshot)**: Records each operator's total stake weight and delegation breakdown for the current epoch.
    - **[`ConsensusResult`](#consensusresult)**: Stores the final outcome (the winning ballot and associated details) for the completed epoch.
    - **[`EpochMarker`](#epochmarker)**: A marker account created when all temporary accounts for an epoch have been successfully closed.
3. **Component Structures**: These are not separate accounts but important data structures used within the accounts above.
    - **[`Ballot`](#ballot)**: Represents a single potential outcome in the consensus process.
    - **[`BallotTally`](#ballottally)**: Aggregates votes and stake weight for a specific ballot.
    - **[`OperatorVote`](#operatorvote)**: Records a vote cast by a single operator.
    - **[`VaultOperatorStakeWeight`](#vaultoperatorstakeweight)**: Tracks the weighted stake from a specific vault to an operator.
    - **[`StMintEntry`](#stmintentry)**: Represents a supported token mint and its voting weight in the VaultRegistry.
    - **[`VaultEntry`](#vaultentry)**: Represents a registered vault in the VaultRegistry.

### Weather status system

The goal of the NCN program is to come to consensus on the weather in Solana Beach. For the purposes of keeping this tutorial simple, our weather statuses are as follows:

1. **Sunny (0)**: Represents clear, sunny weather.
2. **Cloudy (1)**: Represents cloudy weather conditions.
3. **Rainy (2)**: Represents rainy weather conditions.

Operators vote on these status values. The program tallies the votes, weighting each vote by the operator's associated stake weight, to determine the final consensus result. Leveraging the final result of this NCN, we can build onchain programs whose behavior is dependent on the weather in Solana Beach.

### Consensus mechanism

The consensus process follows these steps:

1. Operators cast votes, choosing a specific weather status (Sunny, Cloudy, or Rainy).
2. Each vote's influence is determined by the operator's total stake weight, calculated from delegations received.
3. Votes are collected and tallied within the `BallotBox` account for the current epoch.
4. Consensus is reached when one weather status receives votes representing ≥66% of the total stake weight participating in that epoch.
5. The final consensus result (winning status, total weight supporting it, etc.) is recorded in the `ConsensusResult` account.

### Onchain program overview

The onchain program is written in Rust (without using the Anchor framework) and consists of several instructions that can be called to perform various actions within the NCN. The instruction logic resides in the `/program` directory, while shared core logic is located in the `/core` directory.

The instructions are broadly categorized:

1. **Admin Instructions**: These require administrator privileges and are used for initial setup and configuration.
    - `admin_initialize_config`: Initializes the main `Config` account.
    - `admin_register_st_mint`: Registers a new type of stake token (ST) the NCN will support.
    - `admin_set_new_admin`: Transfers administrative control to a new keypair.
    - `admin_set_parameters`: Updates parameters within the `Config` account.
    - `admin_set_st_mint`: Updates details for an existing supported token mint (Deprecated/Redundant? Check `admin_register_st_mint` and `admin_set_weight`).
    - `admin_set_tie_breaker`: Configures the tie-breaking mechanism or authority.
    - `admin_set_weight`: Sets or updates the voting weight for a specific supported token mint.
2. **Permissionless Keeper Instructions**: These are permissionless instructions, meaning anyone can call them to advance the state of the NCN, typically moving between epoch phases. They ensure the NCN progresses correctly.
    - `initialize_epoch_state`: Creates the `EpochState` account for a new epoch.
    - `initialize_vault_registry`: Creates the initial `VaultRegistry` account.
    - `realloc_vault_registry`: Increases the size of the `VaultRegistry` account, to reach the desired size. Solana has a limitation when it comes to the size of the account that you can allocate in one call, so when you have a larger account, you will need to call realloc on it multiple times to reach the desired size.
    - `initialize_weight_table`: Creates the `WeightTable` account for an epoch.
    - `realloc_weight_table`: Increases the size of the `WeightTable` account.
    - `initialize_epoch_snapshot`: Creates the main `EpochSnapshot` account.
    - `initialize_operator_snapshot`: Creates an `OperatorSnapshot` account for a specific operator within an epoch.
    - `set_epoch_weights`: Populates the `WeightTable` with weights from the `VaultRegistry`.
    - `snapshot_vault_operator_delegation`: Records the weighted stake from a specific vault delegation into the relevant `OperatorSnapshot`.
    - `initialize_ballot_box`: Creates the `BallotBox` account for voting in an epoch.
    - `realloc_ballot_box`: Increases the size of the `BallotBox` account.
    - `register_vault`: Registers a vault (that has already been approved via Jito handshake) with the NCN program's `VaultRegistry`.
    - `close_epoch_account`: Closes temporary epoch-specific accounts (like `EpochState`, `BallotBox`, etc.) after they are no longer needed, reclaiming rent.
3. **Operator Instruction**: This is the primary action taken by participants during a consensus cycle.
    - `cast_vote`: Allows an operator (using their admin key) to submit their vote for the current epoch.

For more details, you can always check the source code or the API documentation [here](https://github.com/jito-foundation/ncn-template).
