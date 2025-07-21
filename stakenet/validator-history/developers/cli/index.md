---
title: Validator History CLI Guide
order: 0
subtitle: 'Commands and operations for Validator History management'
section_type: page
---

## Accounts

| Account                  | Address                                      |
| ------------------------ | -------------------------------------------- |
| Program                  | HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa |
| Validator History Config | BZP2F1L4FwCaeTPmCmfGiVJAiMFwGawo5mbLj4JFzwEd |


## CLI Commands

Build CLI binary from root directory:

```bash
cargo build -p validator-history-cli --release
```

### Configuration Commands

#### Initialize Config

Creates config account and sets tip distribution program address.

```bash
./target/release/validator-history-cli \
  --json-rpc-url 'https://api.mainnet-beta.solana.com' \
  init-config \
  --keypair-path ~/.config/solana/id.json \
  --tip-distribution-program-id '' \
  --tip-distribution-authority '' \
  --stake-authority ''
```

**Parameters:**
- `--keypair-path`: Path to keypair for account creation and transactions
- `--tip-distribution-program-id`: Tip distribution program ID (required)
- `--tip-distribution-authority`: New tip distribution authority (optional)
- `--stake-authority`: New stake authority (optional)

#### Initialize Cluster History

Creates cluster history account with proper reallocation.

```bash
./target/release/validator-history-cli \
  --json-rpc-url 'https://api.mainnet-beta.solana.com' \
  init-cluster-history \
  --keypair-path ~/.config/solana/id.json
```

### Data Query Commands

#### Cranker Status

Displays validator history entries for a specific epoch with summary statistics.

```bash
./target/release/validator-history-cli \
  --json-rpc-url '' \
  cranker-status \
  --epoch 500
```

**Parameters:**
- `--epoch`: Epoch to get status for (optional, defaults to current epoch)

**Output includes:**
- Commission data
- Epoch credits
- MEV commission and earnings
- Stake amounts
- Validator rankings
- IP addresses and client information
- Summary statistics for all validators

#### View Validator History

Displays complete history for a single validator across epochs.

```bash
./target/release/validator-history-cli \
  --json-rpc-url 'https://api.mainnet-beta.solana.com' \
  history 'J1to1yufRnoWn81KYg1XkTWzmKjnYSnmE2VY8DGUJ9Qv' \
  --start-epoch 450
```

**Parameters:**
- `validator`: Validator vote account address (required), you can find vote account [here](https://www.jito.network/stakenet/history/)
- `--start-epoch`: Starting epoch for history display (optional)

#### View Cluster History Status

Displays cluster-wide block production history.

```bash
./target/release/validator-history-cli \
  --json-rpc-url 'https://api.mainnet-beta.solana.com' \
  cluster-history-status
```

### Maintenance Commands

#### Backfill Cluster History

Backfills cluster history data for a specific epoch.

```bash
./target/release/validator-history-cli \
  --json-rpc-url 'https://api.mainnet-beta.solana.com' \
  backfill-cluster-history \
  --keypair-path ~/.config/solana/id.json \
  --epoch 500 \
  --blocks-in-epoch 432000
```

**Parameters:**
- `--epoch`: Epoch to backfill (required)
- `--blocks-in-epoch`: Number of blocks in the epoch (required)

### Analytics Commands

#### Stake Distribution by Country

Analyzes JitoSOL stake distribution across countries using IP geolocation.

```bash
./target/release/validator-history-cli \
  --json-rpc-url https://api.mainnet-beta.solana.com \
  stake-by-country \
  --stake-pool StakePoolAddress \
  --ip-info-token YOUR_IPINFO_TOKEN
```

**Parameters:**
- `--stake-pool`: Stake pool address (required)
- `--country`: Specific country to query (optional)
- `--ip-info-token`: IPInfo API token (required)

**View specific country:**
```bash
./target/release/validator-history-cli \
  --json-rpc-url https://api.mainnet-beta.solana.com \
  stake-by-country \
  --stake-pool StakePoolAddress \
  --country "United States" \
  --ip-info-token YOUR_IPINFO_TOKEN
```
