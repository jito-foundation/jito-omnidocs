---
title: NCN Keeper
order: 50
subtitle: Hands-on guide to NCN keeper setup, configuration, and automation
section_type: page
---

## NCN Keeper

Each NCN relies on off-chain agents called keepers. Keepers are essentially permissionless automation agents that execute all necessary on-chain instructions to advance (“crank”) the NCN through its epoch phases. Anyone can run a keeper.
There are no special authorities required to keep the NCN operational.
By monitoring network state and calling the NCN program’s instructions at certain times, keepers make sure the NCN progresses correctly and remains in sync with Solana’s epoch.

This guide provides an overview of how to use the `ncn-program-cli`, a command-line interface for interacting with an NCN program using the [NCN template](https://github.com/jito-foundation/ncn-template). Below, we cover installation, configuration, and step-by-step usage of the CLI, from initial setup through running the NCN keeper to automate state management.

### Installation and Setup

Before using the Template NCN Program CLI, ensure you have it installed and configured properly, along with the related Jito (Re)Staking tools:

1. Build and install the NCN Program CLI: If you have the [NCN program template repo](https://github.com/jito-foundation/ncn-template), compile and install the CLI binary. For example, using Cargo:
    
    ```bash
    # Clone the template repo
    git clone git@github.com:jito-foundation/ncn-template.git
    cd ncn-template
    # Build the CLI from the repository (assuming you're in the repo directory)
    cargo build --release
    # Install the CLI binary
    cargo install --path ./cli --bin ncn-program-cli --locked
    ```
    
    After installation, verify it works by running:
    
    ```bash
    ncn-program-cli --help
    ```
    
    This should display the general help and list available subcommands.
    
2. Install Jito (Re)Staking CLI (if not already): The NCN program operates alongside Jito’s restaking program. You may need the Jito (Re)Staking CLI (`jito-restaking-cli`) to manage restaking registry tasks (like registering NCNs, operators, and vaults). Install it using Cargo:
    
    ```bash
    cargo install jito-restaking-cli
    ```
    
    Confirm it is installed:
    
    ```bash
    jito-restaking-cli --help
    ```
    
3. Configure Environment Variables: The `ncn-program-cli` accepts configuration through command-line options or environment variables. Optionally, to avoid passing flags every time, you can use a `.env` file for convenience:
    
    ```bash
    # NCN Operator & Program CLI Environment Configuration
    # Copy this file to `.env` and update the values below
    
    # --------------- REQUIRED --------------------
    
    # Solana cluster (mainnet, devnet, testnet, or localnet)
    CLUSTER=devnet
    
    # RPC endpoint for your Solana cluster (must support getBlock and transaction history)
    RPC_URL=https://api.devnet.solana.com
    
    # Commitment level for RPC operations (e.g. confirmed or finalized)
    COMMITMENT=confirmed
    
    # On-chain NCN instance address (created by the NCN admin)
    NCN=<Your_NCN_account_address>
    
    # Path to your Solana keypair file (must have admin/operator authority)
    KEYPAIR_PATH=~/.config/solana/id.json
    
    # Operator public key (the account responsible for voting)
    OPERATOR=BSia35bXHZx69XzCQeMUnWqZJsUwJURVvuUg8Jup2BcP
    
    # OpenWeather API key (used by the example weather oracle operator)
    OPENWEATHER_API_KEY=your_api_key_here
    
    # --------------- PROGRAM IDS --------------------
    
    # Use these only if you are deploying custom programs
    # Otherwise, leave them blank to use defaults
    
    # NCN Program ID (default: 7rNw1g2ZUCdTrCyVGZwCJLnbp3ssTRK5mdkH8gm9AKE8)
    NCN_PROGRAM_ID=
    
    # Jito Restaking program (default value)
    RESTAKING_PROGRAM_ID=RestkWeAVL8fRGgzhfeoqFhsqKRchg6aa1XrcH96z4Q
    
    # Jito Vault program (default value)
    VAULT_PROGRAM_ID=Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8
    
    # --------------- LOGGING --------------------
    
    # Set the Rust log level (e.g., info, debug)
    RUST_LOG=info
    
    ```
    
    These variables will be picked up by the CLI, or you can supply equivalent `--rpc-url`, `--ncn-program-id`, `--ncn`, `--keypair-path`, etc., flags to each command.
    

#### Initializing a New NCN Program

Before running the keeper, some setup and initialization steps are required to configure the NCN program and connect it. Below is a typical workflow for initializing a new NCN:

1. Fund the Account Payer: The NCN program will create and maintain several temporary accounts (for snapshots, vote tracking, etc.). The program uses a payer account to pay rent for these accounts. You should fund this payer with some SOL to cover rent and fees. The CLI provides a  command to transfer SOL from your keypair to the payer account:

```bash
ncn-program-cli admin-fund-account-payer --amount-in-sol 10
```

This example funds the account payer with 10 SOL.

2. Create the NCN Config: Initialize the NCN program’s global configuration on-chain. This must be done by the NCN’s `ncn_admin`:

```bash
ncn-program-cli admin-create-config --tie-breaker-admin <ADMIN_ADDRESS>
```

This creates the NCN’s config account and sets an admin to resolve tied votes or set consensus manually, if needed. You can also override default consensus parameters with options like `--epochs-before-stall`, `--valid-slots-after-consensus`, etc., but in most cases defaults are fine. Run with `--help` to see all available options.

3. Create the Vault Registry: The Vault Registry is an on-chain account in the NCN program that will list all vaults (stake pools or restaked assets) participating in this particular NCN. Initialize it with:

```bash
ncn-program-cli create-vault-registry
```

This sets up an empty VaultRegistry account.

4. Register Supported Tokens: Each vault that will contribute stake must be registered under a supported stake token with a weight. The VaultRegistry tracks supported mints and vaults, allowing the snapshot phase to identify which operators hold stake and calculate their voting power:

---

```bash
ncn-program-cli admin-register-st-mint --vault <VAULT_MINT_ADDRESS> --weight <WEIGHT_VALUE> --keypair-path <NCN_ADMIN_KEYPAIR>
```

For example, if you want to include a vault with mint `ABC...` at weight 100, you’d put that address and weight. This call authorizes that vault for the NCN. Please note that the vault must have already been approved on the restaking program side via a handshake with this NCN.

### Running the Keeper

The `keeper` command automates key tasks for each epoch, including creating epoch state accounts, performing stake snapshots, and handling the voting process. It runs continuously  while monitoring the blockchain and executing actions based on the current epoch phase.

To start the keeper, run:

```bash
ncn-program-cli keeper
```

By default, the keeper checks for actions every 10 minutes, retries on errors after 10 seconds, targets the `testnet` cluster and reports metrics using the `solana_metrics` crate with the `local` region label.

Let’s break down the keeper’s workflow step by step.

#### 1. Vault Registration

After registering the stake mints, you need to create entries in the Vault Registry for any vaults that have opted into the NCN. This is a permissionless crank operation: `ncn-program-cli crank-register-vaults`.

`crank_register_vaults` is a function that registers any unregistered vaults that have been approved by the NCN but not added to the registry yet. It will:

- Fetch all approved accounts
- Retrieve the current vault registry
- Identify the missing vaults by comparing approved vaults against already registered ones
- Register each missing vault individually

Once all eligible vaults are registered, the keeper continues its loop by checking and updating the current epoch state.

#### 2. Fetch Epoch State

Next, the keeper then reads the current epoch from the Solana cluster using `state.fetch(handler, current_keeper_epoch).await` and fetches the corresponding `EpochState` account from the NCN program. If the account already exists, it loads it into local memory.

If the epoch has already been marked as complete, the keeper exits the loop early and waits for the next epoch.

#### 3. Update Epoch state - Syncing local state with on-chain epoch data

The `update_epoch_state` method ensures the keeper’s in-memory state reflects the latest on-chain data for the current epoch. It performs the following actions:

- Checks if the epoch is already completed using `get_is_epoch_completed`. If so, it flags the local state and exits early
- Fetches the `EpochState` account
- Validates the account data to make sure it is present and of the correct size.
- Deserializes the account data into an `EpochState` struct.
- Updates the keeper's memory with the deserialized state.
- Determines the current phase of the epoch by calling `update_current_state`.

This function acts as the gatekeeper. If the epoch is already finished, the keeper skips further processing for that loop iteration.

#### 4. Core State Machine Operations

At this point in the loop, the keeper enters its core state machine execution phase, where it actively drives the NCN epoch forward based on its current on-chain state.

The NCN program defines a set of epoch phases. Each phase requires actions to be executed before the epoch can progress. The keeper reads the current `EpochState`, determines the phase and runs the appropriate handler.

The epoch lifecycle states are:

1. `SetWeight` → Establishes voting weight structure for the epoch
2. `Snapshot` → Captures stake distribution across operators
3. `Vote` → This is skipped by the NCN keeper
4. `PostVoteCooldown` → Manages post-consensus waiting period
5. `Distribute` → Distributes rewards to participants based on their contributions
6. `Close` → Cleans up completed epoch accounts

Each state represents a distinct phase in the epoch lifecycle and the keeper automatically transitions between states as on-chain conditions are met. These operations are permissionless meaning any keeper can execute them when the appropriate conditions are satisfied. It is important to note that this is an example of an NCN’s lifecycle. NCNs may have different states to crank through.

Let's examine each state handler, starting with the weight setup phase:

#### `SetWeight`

The SetWeight state is the first operational phase of each epoch, responsible for establishing the voting power structure that will be used during consensus. This phase uses the function `crank_set_weight` to set up the foundation for stake-weighted voting by creating and populating the weight table.

This function performs two steps:

1. **`create_weight_table`** – Initializes and sizes the `WeightTable` account
    - Depends on the total number of vaults in the registry
    - Prepares a data structure to store weights efficiently on-chain
2. **`set_epoch_weights`** – Calculates and stores each vault’s voting weight
    - Fetches the registered stake mints and their weights
    - Calculates each vault’s total effective stake based on these weights
    - Writes the results into the `WeightTable` account

Once voting weights are set, the epoch transitions to the Snapshot state, where the current stake distribution across all registered operators is captured.

#### `Snapshot`

The Snapshot phase records the current stake distribution across all vault-operator pairs for the epoch. This step guarantees a fixed, on-chain snapshot of delegated stake that will be used in the upcoming consensus vote.

The `crank_snapshot` function performs several steps:

1. **Retrieve vaults and operators**
    - Fetches all valid vaults from the `VaultRegistry`
    - Fetches all registered operators in the NCN
2. **Skips if already finalized**
    - If the `EpochSnapshot` has already been finalized, the function exits early and moves on the next state
3. **Loop through each operator**
    - Makes sure an `OperatorSnapshot` exists for the current epoch
    - Filters vaults that have not yet been recorded in this snapshot
4. **Process vaults**
    - Calls `full_vault_update()` to update the vault’s state and stake balances
    - Calls `snapshot_vault_operator_delegation()` to record how much stake the vault has delegated to this operator

This snapshot process creates a record of how much stake is delegated from each vault to each operator. It ensures that consensus voting in the next phase is based on accurate stake amounts.

#### `Vote`

This is skipped by the NCN while waiting for the operator to vote. 

#### `PostVoteCooldown`

The PostVoteCooldown state serves as a buffer between finalizing consensus and performing cleanup. It gives the network time to settle and provides visibility into the outcome of the voting phase.

The `crank_post_vote_cooldown` function performs two simple but important steps:

1. **Fetch Result**: Loads the finalized `ConsensusResult` account for the epoch from the chain.
2. **Log Outcome**: Prints the result to the logs for debugging and audit purposes.

This phase does **not** submit any transactions or mutate state. It simply confirms that consensus has been reached and prepares the system for the final cleanup phase.

Once completed, the epoch transitions to the **Close** state, where all temporary accounts are cleaned up.

#### `Distribute`

The Distribute state allocates rewards to operators and vaults based on their contributions during the epoch.

The `crank_distribute` function performs the following steps:

1. **Distribute NCN Rewards:** Calls `distribute_ncn_rewards` to allocate base rewards tied to consensus participation.
2. **Distribute Protocol Rewards:** Invokes `distribute_jito_rewards` to distribute incentives.
3. **Route NCN Receiver Rewards:** If rewards exist for the reward receiver at the NCN-level, routes them using `route_ncn_rewards`.
4. **Operator Vault Reward Routing:** For each operator, it will set up their reward routing and distributes rewards to associated vaults.
5. **Distribute Operator Rewards:** If an operator has accumulated rewards, it distributes them via `distribute_ncn_operator_rewards`.
6. **Distribute Vault Rewards:** Loops through each vault under the operator and distributes  rewards via `distribute_ncn_vault_rewards`.

All reward distribution and routing steps are logged. Errors are non-blocking and distribution will be retried in future keeper loops if any step fails.

Once completed, the epoch moves to the `Close` state, where the temporary accounts are cleaned up.

#### `Close`

The **Close** state marks the end of an NCN’s epoch lifecycle. During this phase, the keeper performs a full cleanup by closing all temporary accounts created during the epoch. This will reclaim rent, free up state, and prepare the NCN for the next epoch.

The `crank_close_epoch_accounts` function performs the following operations:

1. **Close Ballot Box** – Closes the `BallotBox` account that tracked consensus voting
2. **Close Operator Snapshots** – Iterates through each operator and closes their `OperatorSnapshot` account
3. **Close Epoch Snapshot** – Closes the global `EpochSnapshot` that captured the operator-vault stake mapping
4. **Close Weight Table** – Closes the `WeightTable` account that stored epoch voting weights
5. **Close Epoch State** – Closes the `EpochState` account that tracked progress through the state machine

Each closure is attempted independently and any errors are logged. Failures do not block anything. ****The keeper will simply attempt to retry them in subsequent loops.

#### 5. Timeout and Heartbeat
At the end of each loop, the keeper:

- Checks whether the epoch has stalled
- If a stall is detected and no actions remain, it waits for the `loop_timeout_ms` duration
- Emits a heartbeat metric with the current tick count
- Starts the next iteration

This ensures the keeper remains responsive during stalled epochs while continuously reporting liveness for monitoring and reward tracking.
