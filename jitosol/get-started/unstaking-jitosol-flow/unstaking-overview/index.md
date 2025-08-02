---
title: 'Unstaking Overview'
subtitle: 'Compare instant trading vs direct unstaking to choose the best method'
section_type: page
order: 0
---

## Two Ways to Convert JitoSOL

When you want to convert your JitoSOL back to SOL (or other tokens), you have two main options:

### Method Comparison

| Method | Speed | Typical Fee | Best For |
|--------|-------|-------------|----------|
| **Jupiter Trading** | Instant | <0.3% | Most users |
| **Direct Unstaking** | Up to 2 days | 0.1% | Large amounts, fee optimization |

## Option 1: Instant Trading (Recommended)

**Use the integrated Jupiter interface for instant conversion**

![Instant Unstaking via Jupiter](/shared/images/jitosol/stake-page-unstake-section-unstake-via-jup-flow.png)

**Advantages:**
- Instant settlement - Get your SOL immediately  
- No waiting period - No need to track cooldown periods
- Simple process - Single transaction, no multi-step workflow
- Best liquidity - Often better exchange rates due to deep liquidity

**How it works:**
1. Go to [jito.network/staking](https://www.jito.network/staking/) and select "Unstake" tab
2. Choose "Immediately via Jupiter" option  
3. Enter JitoSOL amount to convert
4. Review the SOL amount you'll receive
5. Click "Unstake SOL" and approve in your wallet

![Jupiter Unstaking Confirmation](/shared/images/jitosol/stake-page-wallet-confirm-jup-flow-unstake-jitosol.png)

**Alternative:** You can also trade JitoSOL directly on [Jupiter](https://jup.ag/) for any other token.

## Option 2: Direct Unstaking

**Use the delayed unstaking interface for direct conversion**

![Delayed Unstaking Interface](/shared/images/jitosol/stake-page-unstake-section-delayed-unstake.png)

**Advantages:**
- Fixed 0.1% unstaking fee
- No slippage. Get exact exchange rate
- Direct from protocol. No third-party dependencies

**Disadvantages:**
- 2 day waiting period: Must wait for Solana epoch completion
- Multi-step process: Requires multiple wallet interactions
- Timing complexity: Need to track and complete withdrawal

**When to use direct unstaking:**
- Very large amounts where fee difference is significant
- You specifically need the exact exchange rate without slippage
- You're not in a hurry and can wait up to 2 days
- Market liquidity on Jupiter is temporarily insufficient

### How Direct Unstaking Works

![Delayed Unstaking Process](/shared/images/jitosol/stake-page-unstake-section-delayed-unstake-flow.png)

The waiting period is a requirement of the Solana protocol, not specific to JitoSOL. All staked SOL requires a "cooldown" period of 1 epoch (up to 2 days) before it can be withdrawn.

**Process Overview:**
1. **Initiate unstaking** - Press "Unstake SOL" button to transfer your stake from the pool to a stake account in your wallet
2. **Deactivate stake account** - Click "Deactivate" on the Manage page or in your wallet. Your stake will be available at the next epoch boundary (up to 2 days)
3. **Withdraw SOL** - Click "Withdraw" to move SOL to your wallet once deactivation is complete

**Important:** This action is irreversible. Once initiated, Jito will remove your stake from the stake pool.

### How to Complete Direct Unstaking

**Step 1: Access the Interface**
1. Go to [jito.network/staking](https://www.jito.network/staking/) and select "Unstake" tab
2. Connect your wallet and enter amount to unstake
3. Select the delayed unstaking option (shows 0.1% fee and waiting time)

**Step 2: Review and Confirm**

![Delayed Unstaking Confirmation](/shared/images/jitosol/stake-page-confirm-modal-delayed-flow-unstake-jitosol.png)

**Step 3: Wallet Confirmation**

![Delayed Unstaking Wallet Confirmation](/shared/images/jitosol/stake-page-wallet-confirm-delayed-unstake-jitosol.png)

Review the transaction details and approve in your wallet to initiate the unstaking process.

**Step 4: Complete the Process**
- **Monitor Progress:** Check the [Manage page](https://www.jito.network/manage/) for your new stake account
- **Deactivate:** Click "Deactivate" when ready (can be done immediately)
- **Wait:** Your stake will be ready at the next epoch boundary (up to 2 days)
- **Withdraw:** Click "Withdraw" once deactivation is complete

**Wallet-Specific Guides:**
- [Phantom Wallet Guide](/jitosol/get-started/unstaking-jitosol-flow/unstaking-with-phantom/)
- [Solflare Wallet Guide](/jitosol/get-started/unstaking-jitosol-flow/unstaking-with-solflare/)

## Choosing the Right Method

### Use Jupiter Trading When:
- You need SOL immediately
- You want to convert to other tokens (USDC, mSOL, etc.)
- You prefer simple, one-step transactions
- The amount is moderate (fee difference isn't significant)

### Use Direct Unstaking When:
- You're unstaking very large amounts (>100 SOL)
- You can wait up to 2 days for completion
- You want to minimize fees (0.1% vs potentially higher slippage)
- You prefer interacting directly with the protocol

## Troubleshooting

**Instant unstake transaction failing?**
- Increase your slippage setting
- Increase priority fees or tip amount

**Direct unstaking seems complex?**
- Use our wallet-specific guides for step-by-step instructions
- For additional help, join our [Discord](https://discord.gg/jitocommunity)
- Most users find Jupiter conversion much simpler

## Summary

Most users should use Instake Unstaking for instant, convenient conversion with competitive rates. Direct unstaking is primarily useful for very large amounts or when you specifically need to minimize fees and can wait several days.

