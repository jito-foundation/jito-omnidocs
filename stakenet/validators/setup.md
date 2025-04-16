---
title: "Validator Setup Guide"
description: "Step-by-step guide to setting up a StakeNet validator"
section_type: "page"
order: 20
domain: "stakenet"
---

# Validator Setup Guide

This guide provides step-by-step instructions for setting up a Jito StakeNet validator, including installation, configuration, and integration with the Jito MEV infrastructure.

## Prerequisites

Before beginning, ensure you have:

- A server meeting the [hardware requirements](/stakenet/validators/requirements)
- Ubuntu 20.04 or 22.04 LTS installed
- Root or sudo access to the server
- A stable internet connection
- Your Solana identity and vote keypairs (or the ability to create new ones)
- [Solana CLI tools](https://docs.solana.com/cli/install-solana-cli-tools) installed

## Installation Steps

### 1. System Preparation

Start by updating your system and installing required dependencies:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y build-essential pkg-config libudev-dev libssl-dev

# Increase file descriptors limit
sudo bash -c "cat > /etc/security/limits.d/90-solana.conf << EOF
* soft nofile 1000000
* hard nofile 1000000
EOF"

# Apply changes
sudo sysctl -p
```

### 2. Configure Storage

Set up your storage for optimal performance:

```bash
# Create directories
sudo mkdir -p /mnt/solana/accounts
sudo mkdir -p /mnt/solana/ledger

# Set permissions
sudo chown -R $(whoami):$(whoami) /mnt/solana
```

If using separate NVMe drives:

```bash
# Format drives (be careful, this will erase data!)
sudo mkfs.ext4 -L solana-accounts /dev/nvme0n1
sudo mkfs.ext4 -L solana-ledger /dev/nvme1n1

# Mount drives
sudo mount /dev/nvme0n1 /mnt/solana/accounts
sudo mount /dev/nvme1n1 /mnt/solana/ledger

# Add to fstab for persistence
echo "LABEL=solana-accounts /mnt/solana/accounts ext4 defaults,noatime,nofail 0 2" | sudo tee -a /etc/fstab
echo "LABEL=solana-ledger /mnt/solana/ledger ext4 defaults,noatime,nofail 0 2" | sudo tee -a /etc/fstab
```

### 3. Install Jito Validator Software

Download and install the Jito fork of the Solana validator:

```bash
# Download the latest Jito validator installer
curl -L https://raw.githubusercontent.com/jito-foundation/jito-solana/master/install.sh -o install.sh

# Make it executable
chmod +x install.sh

# Run the installer
./install.sh --branch jito-v1.16.1 --no-update-path

# Add to PATH if not already done
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 4. Configure Keypairs

Set up your validator identity and vote account:

```bash
# Create a directory for keypairs
mkdir -p ~/validator-keypairs

# Generate new keypairs if needed
solana-keygen new -o ~/validator-keypairs/identity.json
solana-keygen new -o ~/validator-keypairs/vote-account.json

# Secure permissions
chmod 600 ~/validator-keypairs/*.json
```

If using existing keypairs, simply copy them to the appropriate location.

### 5. Create Vote Account

Create and configure your vote account:

```bash
# Set your Solana config to the appropriate cluster
solana config set --url https://api.mainnet-beta.solana.com

# Create vote account
solana create-vote-account \
  ~/validator-keypairs/vote-account.json \
  ~/validator-keypairs/identity.json \
  ~/validator-keypairs/identity.json \
  --commission 10

# Verify vote account creation
solana vote-account ~/validator-keypairs/vote-account.json
```

### 6. Configure Jito Block Engine Integration

Create a configuration for integrating with the Jito Block Engine:

```bash
# Create configuration directory
mkdir -p ~/validator-config

# Generate block engine auth keypair
solana-keygen new -o ~/validator-keypairs/block-engine-auth.json

# Create the block engine config file
cat > ~/validator-config/block-engine.json << EOF
{
  "block_engine_url": "https://block-engine.jito.network",
  "auth_keypair_path": "~/validator-keypairs/block-engine-auth.json",
  "tip_distribution_percentage": 90,
  "minimum_commission_bps": 100
}
EOF
```

### 7. Create Validator Configuration

Set up your validator configuration file:

```bash
# Create validator config
cat > ~/validator-config/validator.json << EOF
{
  "identity_keypair_path": "~/validator-keypairs/identity.json",
  "vote_account_keypair_path": "~/validator-keypairs/vote-account.json",
  "ledger_path": "/mnt/solana/ledger",
  "accounts_path": "/mnt/solana/accounts",
  "rpc": {
    "enable": true,
    "bind_address": "127.0.0.1:8899",
    "private_rpc": true
  },
  "block_engine_config_path": "~/validator-config/block-engine.json",
  "limit_ledger_size": 50000000,
  "log_level": "INFO",
  "expected_genesis_hash": "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  "entrypoint": "entrypoint.mainnet-beta.solana.com:8001",
  "expected_shred_version": 54129,
  "wal_recovery_mode": "skip_any_corrupted_record"
}
EOF
```

### 8. Create Systemd Service

Create a systemd service to manage your validator:

```bash
sudo bash -c "cat > /etc/systemd/system/jito-validator.service << EOF
[Unit]
Description=Jito Solana Validator
After=network.target
Wants=network.target

[Service]
User=$(whoami)
Group=$(whoami)
Type=simple
WorkingDirectory=/home/$(whoami)
ExecStart=/home/$(whoami)/.local/share/solana/install/active_release/bin/solana-validator --config-file /home/$(whoami)/validator-config/validator.json
Restart=always
RestartSec=10
LimitNOFILE=1000000

[Install]
WantedBy=multi-user.target
EOF"

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable jito-validator
sudo systemctl start jito-validator
```

### 9. Setup Monitoring

Install Solana monitoring tools:

```bash
# Install monitoring tools
sudo apt install -y prometheus grafana

# Set up validator monitoring
solana-install-collector install --name jito-validator

# Configure Prometheus to scrape validator metrics
sudo bash -c "cat > /etc/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'jito_validator'
    static_configs:
      - targets: ['localhost:8801']
EOF"

# Restart Prometheus
sudo systemctl restart prometheus
```

### 10. Register with Jito StakeNet

Once your validator is running and synced:

1. Visit [stakenet.jito.network/apply](https://stakenet.jito.network/apply)
2. Complete the application form with your validator details
3. Submit your vote account address and block engine public key
4. Complete the KYC/AML process if required
5. Await review from the Jito team

## Verification and Testing

To verify your setup:

```bash
# Check validator status
solana validator-info get

# Monitor validator logs
sudo journalctl -u jito-validator -f

# Check block engine connection
# This will be in the validator logs showing successful connections to block engine
```

## Maintenance Tasks

Regular maintenance tasks include:

- **Software Updates**: Update to new Jito validator versions when available
- **Performance Monitoring**: Regularly check validator performance metrics
- **Security Updates**: Apply system security updates
- **Ledger Compaction**: Periodically compact your ledger to save space

## Troubleshooting

### Common Issues

#### Block Engine Connection Failures

If you're having trouble connecting to the block engine:

```bash
# Verify your auth keypair permissions
chmod 600 ~/validator-keypairs/block-engine-auth.json

# Check your network connectivity
curl -v https://block-engine.jito.network

# Review validator logs for specific errors
sudo journalctl -u jito-validator | grep "block engine"
```

#### Validator Not Starting

If your validator isn't starting:

```bash
# Check for errors in the logs
sudo journalctl -u jito-validator -n 100

# Verify file permissions
sudo chown -R $(whoami):$(whoami) /mnt/solana
sudo chown -R $(whoami):$(whoami) ~/validator-keypairs

# Check disk space
df -h
```

## Support and Resources

For additional support:

- Join the [Jito Discord](https://discord.gg/jito)
- Visit the [Jito Validator Forum](https://forum.jito.network/c/validators)
- Contact the validator support team at validators@jito.network 