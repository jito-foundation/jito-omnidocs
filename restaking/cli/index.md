---
title: CLI Usage
order: 100
subtitle: 'Command-Line Reference for jito-restaking-cli'
section_type: page
---

# Command-Line Help for `jito-restaking-cli`

This document contains the help content for the `jito-restaking-cli` command-line program.

### `jito-restaking-cli`

A CLI for managing restaking and vault operations

**Usage:** `jito-restaking-cli [OPTIONS] [COMMAND]`

###### **Subcommands:**

* `restaking` — Restaking program commands
* `vault` — Vault program commands

###### **Options:**

* `--config-file <CONFIG_FILE>` — Path to the configuration file
* `--rpc-url <RPC_URL>` — RPC URL to use
* `--commitment <COMMITMENT>` — Commitment level
* `--restaking-program-id <RESTAKING_PROGRAM_ID>` — Restaking program ID
* `--vault-program-id <VAULT_PROGRAM_ID>` — Vault program ID
* `--signer <SIGNER>` — Filepath or URL to a keypair
* `--verbose` — Verbose mode
* `--print-tx` — This will print out the raw TX instead of running it

  Default value: `false`
* `--print-json` — This will print out account information in JSON format

  Default value: `false`
* `--print-json-with-reserves` — This will print out account information in JSON format with reserved space

  Default value: `false`



### `jito-restaking-cli restaking`

Restaking program commands

**Usage:** `jito-restaking-cli restaking <COMMAND>`

###### **Subcommands:**

* `config` — Initialize, get, and set the config struct
* `ncn` — 
* `operator` — 



### `jito-restaking-cli restaking config`

Initialize, get, and set the config struct

**Usage:** `jito-restaking-cli restaking config <COMMAND>`

###### **Subcommands:**

* `initialize` — Initialize the config
* `get` — Get the config
* `set-admin` — Set the config admin



### `jito-restaking-cli restaking config initialize`

Initialize the config

**Usage:** `jito-restaking-cli restaking config initialize`



### `jito-restaking-cli restaking config get`

Get the config

**Usage:** `jito-restaking-cli restaking config get`



### `jito-restaking-cli restaking config set-admin`

Set the config admin

**Usage:** `jito-restaking-cli restaking config set-admin <NEW_ADMIN>`

###### **Arguments:**

* `<NEW_ADMIN>` — The new admin's pubkey



### `jito-restaking-cli restaking ncn`

**Usage:** `jito-restaking-cli restaking ncn <COMMAND>`

###### **Subcommands:**

* `initialize` — Initialize NCN
* `initialize-ncn-operator-state` — Initialize NCN Operator State
* `ncn-warmup-operator` — Warmup NCN Operator State
* `ncn-cooldown-operator` — NCN Cooldown Operator State
* `initialize-ncn-vault-ticket` — Initialize NCN Vault Ticket
* `warmup-ncn-vault-ticket` — Warmup NCN Vault Ticket
* `cooldown-ncn-vault-ticket` — Cooldown NCN Vault Ticket
* `ncn-delegate-token-account` — NCN Delegate Token Account
* `get` — Get NCN
* `list` — List all NCNs
* `list-ncn-operator-state` — List All Ncn Operator State for a NCN
* `list-ncn-vault-ticket` — List All Ncn Vault Ticket for a NCN
* `ncn-set-admin` — Set NCN Admin
* `ncn-set-secondary-admin` — Set NCN Secondary Admin



### `jito-restaking-cli restaking ncn initialize`

Initialize NCN

**Usage:** `jito-restaking-cli restaking ncn initialize [OPTIONS]`

###### **Options:**

* `--path-to-base-keypair <PATH_TO_BASE_KEYPAIR>`



### `jito-restaking-cli restaking ncn initialize-ncn-operator-state`

Initialize NCN Operator State

**Usage:** `jito-restaking-cli restaking ncn initialize-ncn-operator-state <NCN> <OPERATOR>`

###### **Arguments:**

* `<NCN>`
* `<OPERATOR>`



### `jito-restaking-cli restaking ncn ncn-warmup-operator`

Warmup NCN Operator State

**Usage:** `jito-restaking-cli restaking ncn ncn-warmup-operator <NCN> <OPERATOR>`

###### **Arguments:**

* `<NCN>`
* `<OPERATOR>`



### `jito-restaking-cli restaking ncn ncn-cooldown-operator`

NCN Cooldown Operator State

**Usage:** `jito-restaking-cli restaking ncn ncn-cooldown-operator <NCN> <OPERATOR>`

###### **Arguments:**

* `<NCN>`
* `<OPERATOR>`



### `jito-restaking-cli restaking ncn initialize-ncn-vault-ticket`

Initialize NCN Vault Ticket

**Usage:** `jito-restaking-cli restaking ncn initialize-ncn-vault-ticket <NCN> <VAULT>`

###### **Arguments:**

* `<NCN>`
* `<VAULT>`



### `jito-restaking-cli restaking ncn warmup-ncn-vault-ticket`

Warmup NCN Vault Ticket

**Usage:** `jito-restaking-cli restaking ncn warmup-ncn-vault-ticket <NCN> <VAULT>`

###### **Arguments:**

* `<NCN>`
* `<VAULT>`



### `jito-restaking-cli restaking ncn cooldown-ncn-vault-ticket`

Cooldown NCN Vault Ticket

**Usage:** `jito-restaking-cli restaking ncn cooldown-ncn-vault-ticket <NCN> <VAULT>`

###### **Arguments:**

* `<NCN>`
* `<VAULT>`



### `jito-restaking-cli restaking ncn ncn-delegate-token-account`

NCN Delegate Token Account

**Usage:** `jito-restaking-cli restaking ncn ncn-delegate-token-account [OPTIONS] <NCN> <DELEGATE> <TOKEN_MINT>`

###### **Arguments:**

* `<NCN>`
* `<DELEGATE>`
* `<TOKEN_MINT>`

###### **Options:**

* `--should-create-token-account`



### `jito-restaking-cli restaking ncn get`

Get NCN

**Usage:** `jito-restaking-cli restaking ncn get <PUBKEY>`

###### **Arguments:**

* `<PUBKEY>`



### `jito-restaking-cli restaking ncn list`

List all NCNs

**Usage:** `jito-restaking-cli restaking ncn list`



### `jito-restaking-cli restaking ncn list-ncn-operator-state`

List All Ncn Operator State for a NCN

**Usage:** `jito-restaking-cli restaking ncn list-ncn-operator-state <NCN>`

###### **Arguments:**

* `<NCN>`



### `jito-restaking-cli restaking ncn list-ncn-vault-ticket`

List All Ncn Vault Ticket for a NCN

**Usage:** `jito-restaking-cli restaking ncn list-ncn-vault-ticket <NCN>`

###### **Arguments:**

* `<NCN>`



### `jito-restaking-cli restaking ncn ncn-set-admin`

Set NCN Admin

**Usage:** `jito-restaking-cli restaking ncn ncn-set-admin --old-admin-keypair <OLD_ADMIN_KEYPAIR> --new-admin-keypair <NEW_ADMIN_KEYPAIR> <NCN>`

###### **Arguments:**

* `<NCN>` — The NCN pubkey

###### **Options:**

* `--old-admin-keypair <OLD_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of old admin
* `--new-admin-keypair <NEW_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of new admin



### `jito-restaking-cli restaking ncn ncn-set-secondary-admin`

Set NCN Secondary Admin

**Usage:** `jito-restaking-cli restaking ncn ncn-set-secondary-admin [OPTIONS] <NCN> <NEW_ADMIN>`

###### **Arguments:**

* `<NCN>` — The NCN pubkey
* `<NEW_ADMIN>` — The new admin pubkey

###### **Options:**

* `--set-operator-admin` — Set operator_admin
* `--set-vault-admin` — Set vault_admin
* `--set-slasher-admin` — Set slasher_admin
* `--set-delegate-admin` — Set delegate_admin
* `--set-metadata-admin` — Set metadata_admin
* `--set-weight-table-admin` — Set weight_table_admin
* `--set-ncn-program-admin` — Set ncn_program_admin



### `jito-restaking-cli restaking operator`

**Usage:** `jito-restaking-cli restaking operator <COMMAND>`

###### **Subcommands:**

* `initialize` — Initialize Operator
* `initialize-operator-vault-ticket` — Initialize Operator Vault Ticket
* `warmup-operator-vault-ticket` — Warmup Operator Vault Ticket
* `cooldown-operator-vault-ticket` — Cooldown Operator Vault Ticket
* `operator-warmup-ncn` — Operator Warmup NCN
* `operator-cooldown-ncn` — Operator Cooldown NCN
* `operator-set-admin` — Operator Set Admin
* `operator-set-secondary-admin` — Operator Set Secondary Admin
* `operator-set-fees` — Sets the operator fee
* `operator-delegate-token-account` — Operator Delegate Token Account
* `get` — Get operator
* `list` — List all operators
* `list-operator-vault-ticket` — List Operator Vault Ticket for an Operator
* `list-ncn-operator-state` — List All Ncn Operator State for a Operator



### `jito-restaking-cli restaking operator initialize`

Initialize Operator

**Usage:** `jito-restaking-cli restaking operator initialize <OPERATOR_FEE_BPS>`

###### **Arguments:**

* `<OPERATOR_FEE_BPS>`



### `jito-restaking-cli restaking operator initialize-operator-vault-ticket`

Initialize Operator Vault Ticket

**Usage:** `jito-restaking-cli restaking operator initialize-operator-vault-ticket <OPERATOR> <VAULT>`

###### **Arguments:**

* `<OPERATOR>`
* `<VAULT>`



### `jito-restaking-cli restaking operator warmup-operator-vault-ticket`

Warmup Operator Vault Ticket

**Usage:** `jito-restaking-cli restaking operator warmup-operator-vault-ticket <OPERATOR> <VAULT>`

###### **Arguments:**

* `<OPERATOR>`
* `<VAULT>`



### `jito-restaking-cli restaking operator cooldown-operator-vault-ticket`

Cooldown Operator Vault Ticket

**Usage:** `jito-restaking-cli restaking operator cooldown-operator-vault-ticket <OPERATOR> <VAULT>`

###### **Arguments:**

* `<OPERATOR>`
* `<VAULT>`



### `jito-restaking-cli restaking operator operator-warmup-ncn`

Operator Warmup NCN

**Usage:** `jito-restaking-cli restaking operator operator-warmup-ncn <OPERATOR> <NCN>`

###### **Arguments:**

* `<OPERATOR>`
* `<NCN>`



### `jito-restaking-cli restaking operator operator-cooldown-ncn`

Operator Cooldown NCN

**Usage:** `jito-restaking-cli restaking operator operator-cooldown-ncn <OPERATOR> <NCN>`

###### **Arguments:**

* `<OPERATOR>`
* `<NCN>`



### `jito-restaking-cli restaking operator operator-set-admin`

Operator Set Admin

**Usage:** `jito-restaking-cli restaking operator operator-set-admin --old-admin-keypair <OLD_ADMIN_KEYPAIR> --new-admin-keypair <NEW_ADMIN_KEYPAIR> <OPERATOR>`

###### **Arguments:**

* `<OPERATOR>` — The Operator pubkey

###### **Options:**

* `--old-admin-keypair <OLD_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of old admin
* `--new-admin-keypair <NEW_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of new admin



### `jito-restaking-cli restaking operator operator-set-secondary-admin`

Operator Set Secondary Admin

**Usage:** `jito-restaking-cli restaking operator operator-set-secondary-admin [OPTIONS] <OPERATOR> <NEW_ADMIN>`

###### **Arguments:**

* `<OPERATOR>`
* `<NEW_ADMIN>`

###### **Options:**

* `--set-ncn-admin`
* `--set-vault-admin`
* `--set-voter-admin`
* `--set-delegate-admin`
* `--set-metadata-admin`



### `jito-restaking-cli restaking operator operator-set-fees`

Sets the operator fee

**Usage:** `jito-restaking-cli restaking operator operator-set-fees <OPERATOR> <OPERATOR_FEE_BPS>`

###### **Arguments:**

* `<OPERATOR>`
* `<OPERATOR_FEE_BPS>`



### `jito-restaking-cli restaking operator operator-delegate-token-account`

Operator Delegate Token Account

**Usage:** `jito-restaking-cli restaking operator operator-delegate-token-account [OPTIONS] <OPERATOR> <DELEGATE> <TOKEN_MINT>`

###### **Arguments:**

* `<OPERATOR>`
* `<DELEGATE>`
* `<TOKEN_MINT>`

###### **Options:**

* `--should-create-token-account`



### `jito-restaking-cli restaking operator get`

Get operator

**Usage:** `jito-restaking-cli restaking operator get <PUBKEY>`

###### **Arguments:**

* `<PUBKEY>`



### `jito-restaking-cli restaking operator list`

List all operators

**Usage:** `jito-restaking-cli restaking operator list`



### `jito-restaking-cli restaking operator list-operator-vault-ticket`

List Operator Vault Ticket for an Operator

**Usage:** `jito-restaking-cli restaking operator list-operator-vault-ticket <OPERATOR>`

###### **Arguments:**

* `<OPERATOR>`



### `jito-restaking-cli restaking operator list-ncn-operator-state`

List All Ncn Operator State for a Operator

**Usage:** `jito-restaking-cli restaking operator list-ncn-operator-state <OPERATOR>`

###### **Arguments:**

* `<OPERATOR>`



### `jito-restaking-cli vault`

Vault program commands

**Usage:** `jito-restaking-cli vault <COMMAND>`

###### **Subcommands:**

* `config` — 
* `vault` — Vault commands



### `jito-restaking-cli vault config`

**Usage:** `jito-restaking-cli vault config <COMMAND>`

###### **Subcommands:**

* `initialize` — Creates global config (can only be done once)
* `get` — Fetches global config
* `set-admin` — Set the config admin
* `set-program-fee` — Set the program fee
* `set-program-fee-wallet` — Set the program fee wallet



### `jito-restaking-cli vault config initialize`

Creates global config (can only be done once)

**Usage:** `jito-restaking-cli vault config initialize <PROGRAM_FEE_BPS> <PROGRAM_FEE_WALLET>`

###### **Arguments:**

* `<PROGRAM_FEE_BPS>` — The program fee in basis points
* `<PROGRAM_FEE_WALLET>` — The program fee wallet pubkey



### `jito-restaking-cli vault config get`

Fetches global config

**Usage:** `jito-restaking-cli vault config get`



### `jito-restaking-cli vault config set-admin`

Set the config admin

**Usage:** `jito-restaking-cli vault config set-admin <NEW_ADMIN>`

###### **Arguments:**

* `<NEW_ADMIN>` — The new admin's pubkey



### `jito-restaking-cli vault config set-program-fee`

Set the program fee

**Usage:** `jito-restaking-cli vault config set-program-fee <NEW_FEE_BPS>`

###### **Arguments:**

* `<NEW_FEE_BPS>` — The program fee



### `jito-restaking-cli vault config set-program-fee-wallet`

Set the program fee wallet

**Usage:** `jito-restaking-cli vault config set-program-fee-wallet <PROGRAM_FEE_WALLET>`

###### **Arguments:**

* `<PROGRAM_FEE_WALLET>` — The program fee wallet



### `jito-restaking-cli vault vault`

Vault commands

**Usage:** `jito-restaking-cli vault vault <COMMAND>`

###### **Subcommands:**

* `initialize` — Creates a new vault
* `create-token-metadata` — Creates token metadata for the vault's LRT token
* `update-token-metadata` — 
* `initialize-vault-update-state-tracker` — Starts the vault update cycle
* `crank-vault-update-state-tracker` — Cranks the vault update state tracker, needs to be run per operator
* `close-vault-update-state-tracker` — Ends the vault update cycle
* `mint-vrt` — Mints VRT tokens
* `initialize-operator-delegation` — Sets up the delegations for an operator
* `delegate-to-operator` — Delegates tokens to an operator
* `cooldown-operator-delegation` — Cooldown delegation for an operator
* `initialize-vault-ncn-ticket` — Initialize Vault NCN Ticket
* `warmup-vault-ncn-ticket` — Warmup Vault NCN Ticket
* `cooldown-vault-ncn-ticket` — Cooldown Vault NCN Ticket
* `enqueue-withdrawal` — Starts the withdrawal process
* `change-withdrawal-ticket-owner` — Change withdrawal ticket owner
* `burn-withdrawal-ticket` — Burns the withdrawal ticket, ending the withdrawal process
* `get-vault-update-state-tracker` — Gets the update state tracker for a vault
* `get-operator-delegations` — Gets the operator delegations for a vault
* `get-operator-delegation` — Gets the operator delegation for a vault
* `get-withdrawal-ticket` — 
* `get` — Gets a vault
* `list` — List all vaults
* `set-admin` — Set Admin
* `set-capacity` — Sets the deposit capacity in the vault
* `set-fees` — Sets the fees in the vault
* `set-is-paused` — Sets the vault's pause state
* `set-secondary-admin` — Set Secondary Admin
* `update-vault-balance` — Update Vault Balance
* `delegate-token-account` — Delegate a token account
* `delegated-token-transfer` — Transfer a token account



### `jito-restaking-cli vault vault initialize`

Creates a new vault

**Usage:** `jito-restaking-cli vault vault initialize <TOKEN_MINT> <DEPOSIT_FEE_BPS> <WITHDRAWAL_FEE_BPS> <REWARD_FEE_BPS> <DECIMALS> <INITIALIZE_TOKEN_AMOUNT> [VRT_MINT_ADDRESS_FILE_PATH]`

###### **Arguments:**

* `<TOKEN_MINT>` — The token which is allowed to be deposited into the vault
* `<DEPOSIT_FEE_BPS>` — The deposit fee in bips
* `<WITHDRAWAL_FEE_BPS>` — The withdrawal fee in bips
* `<REWARD_FEE_BPS>` — The reward fee in bips
* `<DECIMALS>` — The decimals of the token
* `<INITIALIZE_TOKEN_AMOUNT>` — The amount of tokens to initialize the vault with ( in the smallest unit )
* `<VRT_MINT_ADDRESS_FILE_PATH>` — The file path of VRT mint address



### `jito-restaking-cli vault vault create-token-metadata`

Creates token metadata for the vault's LRT token

**Usage:** `jito-restaking-cli vault vault create-token-metadata <VAULT> <NAME> <SYMBOL> <URI>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<NAME>` — The name of the token
* `<SYMBOL>` — The symbol of the token
* `<URI>` — The URI for the token metadata



### `jito-restaking-cli vault vault update-token-metadata`

**Usage:** `jito-restaking-cli vault vault update-token-metadata <VAULT> <NAME> <SYMBOL> <URI>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<NAME>` — The name of the token
* `<SYMBOL>` — The symbol of the token
* `<URI>` — The URI for the token metadata



### `jito-restaking-cli vault vault initialize-vault-update-state-tracker`

Starts the vault update cycle

**Usage:** `jito-restaking-cli vault vault initialize-vault-update-state-tracker <VAULT>`

###### **Arguments:**

* `<VAULT>` — Vault account



### `jito-restaking-cli vault vault crank-vault-update-state-tracker`

Cranks the vault update state tracker, needs to be run per operator

**Usage:** `jito-restaking-cli vault vault crank-vault-update-state-tracker <VAULT> <OPERATOR>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<OPERATOR>` — Operator account



### `jito-restaking-cli vault vault close-vault-update-state-tracker`

Ends the vault update cycle

**Usage:** `jito-restaking-cli vault vault close-vault-update-state-tracker <VAULT> [NCN_EPOCH]`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<NCN_EPOCH>` — Optional NCN epoch to close



### `jito-restaking-cli vault vault mint-vrt`

Mints VRT tokens

**Usage:** `jito-restaking-cli vault vault mint-vrt <VAULT> <AMOUNT_IN> <MIN_AMOUNT_OUT>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<AMOUNT_IN>` — Amount to deposit
* `<MIN_AMOUNT_OUT>` — Minimum amount of VRT to mint



### `jito-restaking-cli vault vault initialize-operator-delegation`

Sets up the delegations for an operator

**Usage:** `jito-restaking-cli vault vault initialize-operator-delegation <VAULT> <OPERATOR>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<OPERATOR>` — Operator account



### `jito-restaking-cli vault vault delegate-to-operator`

Delegates tokens to an operator

**Usage:** `jito-restaking-cli vault vault delegate-to-operator <VAULT> <OPERATOR> <AMOUNT>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<OPERATOR>` — Operator account
* `<AMOUNT>` — Amount to delegate



### `jito-restaking-cli vault vault cooldown-operator-delegation`

Cooldown delegation for an operator

**Usage:** `jito-restaking-cli vault vault cooldown-operator-delegation <VAULT> <OPERATOR> <AMOUNT>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<OPERATOR>` — Operator account
* `<AMOUNT>` — Amount to cooldown



### `jito-restaking-cli vault vault initialize-vault-ncn-ticket`

Initialize Vault NCN Ticket

**Usage:** `jito-restaking-cli vault vault initialize-vault-ncn-ticket <VAULT> <NCN>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<NCN>` — NCN account



### `jito-restaking-cli vault vault warmup-vault-ncn-ticket`

Warmup Vault NCN Ticket

**Usage:** `jito-restaking-cli vault vault warmup-vault-ncn-ticket <VAULT> <NCN>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<NCN>` — NCN account



### `jito-restaking-cli vault vault cooldown-vault-ncn-ticket`

Cooldown Vault NCN Ticket

**Usage:** `jito-restaking-cli vault vault cooldown-vault-ncn-ticket <VAULT> <NCN>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<NCN>` — NCN account



### `jito-restaking-cli vault vault enqueue-withdrawal`

Starts the withdrawal process

**Usage:** `jito-restaking-cli vault vault enqueue-withdrawal <VAULT> <AMOUNT>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<AMOUNT>` — Amount to withdraw



### `jito-restaking-cli vault vault change-withdrawal-ticket-owner`

Change withdrawal ticket owner

**Usage:** `jito-restaking-cli vault vault change-withdrawal-ticket-owner --old-ticket-owner-keypair <OLD_TICKET_OWNER_KEYPAIR> <VAULT> <NEW_TICKET_OWNER>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<NEW_TICKET_OWNER>` — The new ticket owner pubkey

###### **Options:**

* `--old-ticket-owner-keypair <OLD_TICKET_OWNER_KEYPAIR>` — The old ticket owner keypair



### `jito-restaking-cli vault vault burn-withdrawal-ticket`

Burns the withdrawal ticket, ending the withdrawal process

**Usage:** `jito-restaking-cli vault vault burn-withdrawal-ticket <VAULT>`

###### **Arguments:**

* `<VAULT>` — Vault account



### `jito-restaking-cli vault vault get-vault-update-state-tracker`

Gets the update state tracker for a vault

**Usage:** `jito-restaking-cli vault vault get-vault-update-state-tracker <VAULT>`

###### **Arguments:**

* `<VAULT>` — Vault account



### `jito-restaking-cli vault vault get-operator-delegations`

Gets the operator delegations for a vault

**Usage:** `jito-restaking-cli vault vault get-operator-delegations <VAULT>`

###### **Arguments:**

* `<VAULT>` — Vault account



### `jito-restaking-cli vault vault get-operator-delegation`

Gets the operator delegation for a vault

**Usage:** `jito-restaking-cli vault vault get-operator-delegation <VAULT> <OPERATOR>`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<OPERATOR>` — Operator account



### `jito-restaking-cli vault vault get-withdrawal-ticket`

**Usage:** `jito-restaking-cli vault vault get-withdrawal-ticket <VAULT> [STAKER]`

###### **Arguments:**

* `<VAULT>` — Vault account
* `<STAKER>` — Staker account



### `jito-restaking-cli vault vault get`

Gets a vault

**Usage:** `jito-restaking-cli vault vault get <PUBKEY>`

###### **Arguments:**

* `<PUBKEY>` — The vault pubkey



### `jito-restaking-cli vault vault list`

List all vaults

**Usage:** `jito-restaking-cli vault vault list`



### `jito-restaking-cli vault vault set-admin`

Set Admin

**Usage:** `jito-restaking-cli vault vault set-admin --old-admin-keypair <OLD_ADMIN_KEYPAIR> --new-admin-keypair <NEW_ADMIN_KEYPAIR> <VAULT>`

###### **Arguments:**

* `<VAULT>` — The Vault pubkey

###### **Options:**

* `--old-admin-keypair <OLD_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of old admin
* `--new-admin-keypair <NEW_ADMIN_KEYPAIR>` — Filepath or URL to a keypair of new admin



### `jito-restaking-cli vault vault set-capacity`

Sets the deposit capacity in the vault

**Usage:** `jito-restaking-cli vault vault set-capacity <VAULT> <AMOUNT>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<AMOUNT>` — The new capacity



### `jito-restaking-cli vault vault set-fees`

Sets the fees in the vault

**Usage:** `jito-restaking-cli vault vault set-fees [OPTIONS] <VAULT>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey

###### **Options:**

* `--deposit-fee-bps <DEPOSIT_FEE_BPS>` — The deposit fee BPS
* `--withdrawal-fee-bps <WITHDRAWAL_FEE_BPS>` — The withdrawal fee BPS
* `--reward-fee-bps <REWARD_FEE_BPS>` — The reward fee BPS



### `jito-restaking-cli vault vault set-is-paused`

Sets the vault's pause state

**Usage:** `jito-restaking-cli vault vault set-is-paused [OPTIONS] <VAULT>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey

###### **Options:**

* `--set-pause` — Set pause



### `jito-restaking-cli vault vault set-secondary-admin`

Set Secondary Admin

**Usage:** `jito-restaking-cli vault vault set-secondary-admin [OPTIONS] <VAULT> <NEW_ADMIN>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<NEW_ADMIN>` — The new admin pubkey

###### **Options:**

* `--set-delegation-admin` — Set delegation_admin
* `--set-operator-admin` — Set operator_admin
* `--set-ncn-admin` — Set ncn_admin
* `--set-slasher-admin` — Set slasher_admin
* `--set-capacity-admin` — Set capacity_admin
* `--set-fee-wallet` — Set fee_wallet
* `--set-mint-burn-admin` — Set mint_burn_admin
* `--set-delegate-asset-admin` — Set delegate_asset_admin
* `--set-fee-admin` — Set fee_admin
* `--set-metadata-admin` — Set metadata_admin



### `jito-restaking-cli vault vault update-vault-balance`

Update Vault Balance

**Usage:** `jito-restaking-cli vault vault update-vault-balance <VAULT>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey



### `jito-restaking-cli vault vault delegate-token-account`

Delegate a token account

**Usage:** `jito-restaking-cli vault vault delegate-token-account <VAULT> <DELEGATE> <TOKEN_MINT> <TOKEN_ACCOUNT>`

###### **Arguments:**

* `<VAULT>` — The vault pubkey
* `<DELEGATE>` — The delegate account
* `<TOKEN_MINT>` — The token mint
* `<TOKEN_ACCOUNT>` — The token account



### `jito-restaking-cli vault vault delegated-token-transfer`

Transfer a token account

**Usage:** `jito-restaking-cli vault vault delegated-token-transfer <TOKEN_ACCOUNT> <RECIPIENT_PUBKEY> <AMOUNT>`

###### **Arguments:**

* `<TOKEN_ACCOUNT>` — The token account
* `<RECIPIENT_PUBKEY>` — The recipient pubkey
* `<AMOUNT>` — The amount to transfer



<hr/>

<small><i>
    This document was generated automatically by
    <a href="https://crates.io/crates/clap-markdown"><code>clap-markdown</code></a>.
</i></small>

