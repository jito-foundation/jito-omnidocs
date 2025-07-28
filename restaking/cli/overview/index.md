---
title: "CLI Overview"
subtitle: "Getting started with jito-restaking-cli"
section_type: "page"
order: 0
---

## Installation

### Option 1: Install from crates.io (Recommended)

```bash
cargo install jito-restaking-cli
```

### Option 2: Build from Source

```bash
git clone git@github.com:jito-foundation/restaking.git
cd restaking
cargo build --release
cargo install --path ./cli --bin jito-restaking-cli
```

### Verify Installation

```bash
jito-restaking-cli --help
```

## Quick Start

### 1. Configuration

First, set up your configuration. You can use command-line flags or a config file:

```bash
# Using command-line flags
jito-restaking-cli --rpc-url https://api.mainnet-beta.solana.com \
  --signer ~/.config/solana/id.json \
  restaking config get

# Or create a config file (recommended)
# See Configuration guide for details
```

### 2. Initialize System Components

```bash
# Initialize restaking config (one-time setup)
jito-restaking-cli restaking config initialize

# Initialize vault config (one-time setup)  
jito-restaking-cli vault config initialize 100 <FEE_WALLET_PUBKEY>
```

### 3. Create Your First Vault

```bash
# Create a vault
jito-restaking-cli vault vault initialize \
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn \
  100 \
  100 \
  500 \
  9 \
  1000000000
```

### 4. Set Up an Operator

```bash
# Initialize operator with 5% fee (500 basis points)
jito-restaking-cli restaking operator initialize 500
```

### 5. Create an NCN

```bash
# Initialize NCN
jito-restaking-cli restaking ncn initialize \
  --path-to-base-keypair ./ncn-keypair.json
```

## Common Command Patterns

### Global Options

Most commands accept these global options:

```bash
jito-restaking-cli [GLOBAL_OPTIONS] <SUBCOMMAND>

# Common global options:
--rpc-url <URL>              # Solana RPC endpoint
--signer <KEYPAIR_PATH>      # Your wallet keypair or Ledger
--commitment <LEVEL>         # Transaction commitment level
--verbose                    # Enable detailed output
--print-tx                   # Show transaction instead of executing
--print-json                 # Output in JSON format
```

### Dry Run Mode

Use `--print-tx` to see which instructions without executing:

```bash
jito-restaking-cli \
    --print-tx vault vault initialize \
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn \
  100 \
  100 \
  500 \
  9 \
  1000000000
```

### JSON Output

Use `--print-json` for programmatic access:

```bash
jito-restaking-cli --print-json restaking ncn list
```

## What's Next?

Now that you have the CLI installed and understand the basics, explore these guides:

1. **[Vault Operations](vault-operations.md)** - Create and manage vaults
2. **[Operator Management](operator-management.md)** - Set up and run operators
3. **[NCN Operations](ncn-operations.md)** - Coordinate network consensus

## Getting Help

- Use `--help` with any command for detailed usage information
- Check the **[CLI Reference](cli-reference.md)** for complete command documentation
- Review **[Examples & Tutorials](cli-examples.md)** for step-by-step guides

```bash
# Get help for specific commands
jito-restaking-cli --help
jito-restaking-cli vault --help
jito-restaking-cli vault vault initialize --help
```