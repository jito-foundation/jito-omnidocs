---
title: Operator
order: 60
subtitle: Complete guide to running NCN operators and automated consensus voting
section_type: page
---

## Operator

With NCNs, operators are responsible for driving consensus. While each operator can have its own unique logic, it's up to the NCN designer to define that behavior. Operators perform all computation off-chain and submit votes on-chain during specific windows, using stake delegated by vaults. To simplify their responsibilities, the operator process automates the on-chain tasks for registered operators, primarily casting votes, handling post-vote logic, and reporting metrics. It runs continuously and monitors the state of the network and acts when it's the operator’s turn to participate. In this guide, we'll be looking at a template operator that fetches weather data and votes on the result.

This process is typically run by the same entity that registered the operator, such as a validator, DAO or data provider participating in the NCN. 

This guide explains how to configure and run the operator using the `ncn-operator-cli` from the [NCN template](https://github.com/jito-foundation/ncn-template). It breaks down the operator loop, details how votes are cast using real-world weather data and walks through the behavior during different epoch states like `Vote`, `PostVoteCooldown`, and `Close`.

### Installation and Setup

Before using the Template Operator CLI, install the necessary binaries:

1. Clone the repo
    
    ```bash
    # Clone the template repo
    git clone git@github.com:jito-foundation/ncn-template.git
    cd ncn-template
    # Build the CLI from the repository (assuming you're in the repo directory)
    cargo build --release
    # Install the CLI binary
    cargo install --path ./cli --bin ncn-operator-cli --locked
    ```
    
    After installation, verify it works by running:
    
    ```bash
    ncn-operator-cli --help
    ```
    
2. Install Jito (Re)Staking CLI (if not already): The NCN program operates alongside Jito’s restaking program. You may need the Jito (Re)Staking CLI (`jito-restaking-cli`) to manage restaking registry tasks (like registering NCNs, operators, and vaults). Install it using Cargo:
    
    ```bash
    cargo install jito-restaking-cli
    ```
    
    Confirm it works:
    
    ```bash
    jito-restaking-cli --help
    ```

1. Configure Environment Variables: The `ncn-program-cli` accepts configuration through command-line flags or environment variables. Optionally, to avoid passing flags every time, you can use a `.env` file for convenience:
    
    ```bash
    # Operator Environment Configuration
    # Copy this file to `.env` and update the values below
    
    # --------------- REQUIRED --------------------
    
    # Solana cluster (mainnet, devnet, testnet, or localnet)
    CLUSTER=devnet
    
    # Solana RPC endpoint (must support getBlock and transaction history)
    RPC_URL=https://api.devnet.solana.com
    
    # Commitment level for operations (e.g. confirmed or finalized)
    COMMITMENT=confirmed
    
    # Your deployed NCN instance address
    NCN=<Your_NCN_account_address>
    
    # Path to your keypair file (admin/operator authority)
    KEYPAIR_PATH=~/.config/solana/id.json
    
    # Operator public key (the account that votes on-chain)
    OPERATOR=BSia35bXHZx69XzCQeMUnWqZJsUwJURVvuUg8Jup2BcP
    
    # OpenWeather API key for the example oracle operator
    OPENWEATHER_API_KEY=your_api_key_here
    
    # --------------- PROGRAM IDS --------------------
    
    # Leave blank to use defaults unless you have custom deployments
    NCN_PROGRAM_ID==<Your_NCN_Program_ID>
    RESTAKING_PROGRAM_ID=RestkWeAVL8fRGgzhfeoqFhsqKRchg6aa1XrcH96z4Q
    VAULT_PROGRAM_ID=Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8
    
    # --------------- LOGGING --------------------
    
    # Set log level (info, debug, etc.)
    RUST_LOG=info
    ```
    
    These variables will be picked up by the CLI, or you can supply equivalent `--rpc-url`, `--ncn-program-id`, `--ncn`, etc., flags to each command.

### Running the Operator

The `run-operator` command automates vote casting and post-vote actions for a registered operator. It runs continuously, monitoring the NCN’s epoch state and executing vote-related instructions when appropriate. It also emits metrics for visibility and debugging.

To start the operator, run:

```bash
ncn-program-cli run-operator
```

By default, the operator loop checks for actions every 10 minutes, retries on errors after 10 seconds, targets the `testnet` cluster and reports metrics with the `local` region label.

Let’s break down the operator’s workflow step by step.

#### 1. Epoch Progression

Before doing any work, the operator checks whether a new epoch has started by querying the  cluster by calling `progress_epoch` if the epoch state is completed. This checks that the operator is aligned with the live on-chain epoch and doesn’t act on stale data.

The loop progresses through:

- Advancing to a new epoch if the chain has moved forward
- Looping back to the start of the same epoch if it's marked complete
- Staying on the same epoch if work is still pending

---

#### 2. Fetch or Update Operator State

The operator maintains an internal `KeeperState` that tracks the current epoch, cached on-chain accounts and the latest `EpochState`. This block loads the latest on-chain data to keep the operator aligned with the current epoch.

There are two possible paths here:

- **New Epoch Detected**:
    
    If the loop has progressed to a new epoch, it calls `state.fetch(...)` which does the following:
    
    - Sets the operator’s internal epoch value to the current one
    - Loads all relevant on-chain accounts
    - Calls `update_epoch_state(...)` internally to populate the latest `EpochState`
- **Same Epoch**:
    
    If the epoch hasn’t changed, it will skip the full fetch and just refresh the `EpochState` using `update_epoch_state(...)`
    
    This avoids unnecessary on-chain requests and helps keep everything responsive.
    

If either call fails, the operator logs the error and skips the current loop without submitting any vote or metrics.

---

#### 3. Check for Valid EpochState

After updating its state, the operator then checks if a valid `EpochState` exists.

If the `EpochState` is missing or not yet initialized on-chain, the operator will:

- Log that the epoch has no associated state
- Mark the epoch as completed locally
- Skip to the next loop cycle

This prevents the operator from crashing or spinning unnecessarily while waiting for the epoch to be initialized.

---

#### 4. Core State Machine Operations

Once the `EpochState` is loaded, the operator identifies the current phase and reacts based on its role as an operator. Only a subset of phases require action.

It will evaluate internal conditions to determine eligibility. If the operator is permitted to vote in the current phase, it proceeds with the voting logic.

The epoch lifecycle states are:

---

1. `SetWeight` → Establishes voting weight structure for the epoch. No operator action is needed for this step.
2. `Snapshot` → Captures stake distribution across operators. No operator action is needed for this step.
3. `Vote` → Casts vote
4. `PostVoteCooldown` → Triggers post-vote logic and emits operator metrics. Marks the epoch as completed.
5. `Close` → Cleans up completed epoch accounts

#### `SetWeight`

This step is skipped by the operator as no action is needed.

#### `Snapshot`

Again, this step is skipped by the operator.

#### `Vote`

The `Vote` phase is where the operator performs its most important role: submitting a vote that contributes to the NCN’s consensus process. This phase is only active if the operator has received delegation from at least one vault and has not yet cast a vote for the current epoch.

During this phase, the operator:

1. **Loads Required Data**
    
    It fetches both the `BallotBox` and the `OperatorSnapshot` (which contains data about the operator’s delegation and voting history). These accounts determine whether the operator is eligible to vote and if they’ve already participated in this round.
    
2. **Checks Eligibility**
    
    Using `can_operator_vote(...)`, it will verify that the operator:
    
    - Has been delegated stake for this epoch
    - Has not already voted
    - Is listed in the ballot box with an appropriate weight
3. **Casts the Vote**
    
    If eligible, the operator calls `operator_crank_vote(...)` to submit the vote on-chain. The actual vote content will be determined by the NCN’s logic. In the default template, it maps mock weather data to a vote value. In real NCNs, this would be replaced with your logic and inputs (e.g. price feeds, validator scores, etc.).
    
4. **Handles Errors**
    
    If voting fails, the operator logs the error, delays for the `--error-timeout-ms` and retries the loop. This prevents spammy retries and gives the network time to recover from short lived failures.
    
5. **Emits Metrics**
    
    Once successful, the operator emits the operator vote metrics using `emit_ncn_metrics_operator_vote(...)`. This helps monitor and track vote activity and operator performance in real time.
    
6. **Post-Vote Flow**
    
    If the operator has already voted or is ineligible:
    
    - The operator instead performs a `post_vote` action which typically submits metadata or confirms the final state
    - It emits corresponding post-vote metrics
    - Finally, it marks the epoch as complete for this operator and allows the operator to skip this epoch in future iterations

---

#### `PostVoteCooldown`

This phase is used to report the result of the voting process.

The operator:

- Loads the `BallotBox`
- Checks whether consensus was reached
- Logs the outcome of the vote (including weights, operator decisions and winning ballot)
- Emits post-vote metrics

While no vote is cast, the operator may still submit an on-chain transaction (e.g. metrics or metadata), depending on the implementation.

#### `Close`

This phase is similar to `PostVoteCooldown`, but is used at the very end of the epoch.

The operator once again:

- Loads the ballot box and logs the final consensus result
- Emits final metrics
- Marks the epoch as completed so the operator loop can progress to the next one

#### 5. Timeout and Heartbeat

At the end of each loop, the operator:

- Waits for `-loop-timeout-ms` duration
- Emits a heartbeat metric with the current tick count
- Starts the loop again

This helps avoid overloading the RPC and keeps the operator reporting liveness for monitoring dashboards, alerting systems, and reward eligibility checks.
