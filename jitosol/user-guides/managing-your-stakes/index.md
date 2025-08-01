---
title: 'Managing Your Stake Accounts'
order: 40
section_type: 'page'
subtitle: 'Utility for SOL stake account holders to manage and convert stakes.'
---

## Managing Your SOL Stake Accounts

**This page is for holders of native SOL stake accounts, not JitoSOL holders.** If you already have JitoSOL, you don't need this page - your JitoSOL automatically earns rewards and can be traded anytime.

The [Jito Manage page](https://www.jito.network/manage/) is a utility for users who have existing SOL stake accounts. You can:
- View and manage your current stake accounts
- Deactivate and withdraw existing stakes  
- **Convert stake accounts to JitoSOL** for liquid staking benefits

## Why Convert to JitoSOL?

**Benefits of converting your stake accounts to JitoSOL:**
- **Instant liquidity:** Trade JitoSOL anytime without waiting for epochs
- **Additional MEV rewards:** Earn extra yield on top of staking rewards
- **DeFi opportunities:** Use JitoSOL in lending, DEXs, and yield farming
- **No management needed:** JitoSOL automatically optimizes validator selection

## How to Use the Manage Page

### Getting Started
1. **Visit the page:** Go to [jito.network/manage](https://www.jito.network/manage/)
2. **Connect wallet:** Click "Connect Wallet" and select your preferred wallet
3. **View stake accounts:** See all your SOL stake accounts organized by status

![Manage Page Overview](/shared/images/jitosol/manage-page-active-stake-list.png)

The Manage Stake page contains:
- **Interceptor notification:** Info about pending stake account deposits to JitoSOL pool
- **Stake account tables:** Organized by status (Active, Activating, Deactivating, Inactive)
- **Account details:** Amount, validator, and available actions for each stake

## Stake Account States

### Active Stake
Your currently earning stake accounts. Each shows amount, validator, and action buttons.

**Available actions:**
- **Deactivate:** Begin unstaking process (takes up to 2 days)
- **Convert to JitoSOL:** Instantly convert to liquid staking tokens

### Deactivating Stake  
Stakes in the process of being deactivated. Shows "Deactivation Pending" status.

![Deactivating Stakes](/shared/images/jitosol/manage-page-deactivating-stake-section.png)

**What happens next:** Stakes move to "Inactive" at the next epoch boundary (up to 2 days), then can be withdrawn.

### Inactive Stake
Fully deactivated stakes that are ready for withdrawal or conversion.

![Inactive Stakes](/shared/images/jitosol/manage-page-inactive-stake-list.png)

**Available actions:**
- **Withdraw:** Get your SOL back immediately
- **Convert to JitoSOL:** Still available for liquid staking benefits

## Step-by-Step Processes

### Deactivating a Stake Account

1. **Click "Deactivate"** on any active stake account
2. **Review the modal:** Understand the 1-2 epoch waiting period

![Deactivate Confirmation](/shared/images/jitosol/manage-page-deactivate-confirm-modal.png)

3. **Confirm in wallet:** Approve the deactivation transaction

![Wallet Confirmation - Deactivate](/shared/images/jitosol/manage-wallet-confirm-deactivate-stake.png)

4. **Wait for completion:** Stake moves to "Deactivating" then "Inactive" status

### Withdrawing Inactive Stakes

1. **Click "Withdraw"** on any inactive stake account
2. **Confirm the action:** Review that SOL returns to your wallet

![Withdraw Confirmation](/shared/images/jitosol/manage-page-withdraw-stake-modal.png)

3. **Approve in wallet:** Complete the withdrawal transaction

![Wallet Confirmation - Withdraw](/shared/images/jitosol/manage-wallet-confirm-withdrawal-stake.png)

### Converting Stakes to JitoSOL

**The conversion process:**
1. **Click "Convert to JitoSOL"** on any stake account (active or inactive)
2. **Review exchange rate:** See how much JitoSOL you'll receive
3. **Confirm transaction:** Approve the conversion in your wallet
4. **Automatic delivery:** JitoSOL delivered after 10-hour [Interceptor](/jitosol/user-guides/interceptor/) cooldown

## Frequently Asked Questions

**"I have JitoSOL - do I need this page?"**  
No! This page is only for people with native SOL stake accounts. JitoSOL holders don't need to manage anything.

**"What's the difference between the states?"**
- **Active:** Currently earning staking rewards
- **Activating:** Stakes becoming active at next epoch
- **Deactivating:** Stakes being unstaked (ready in up to 2 days)
- **Inactive:** Ready for immediate withdrawal

**"Should I convert my stakes to JitoSOL?"**  
Converting gives you instant liquidity, auto-compounding MEV rewards, and DeFi opportunities. Keep native stakes if you prefer direct validator control.

**"Can I convert inactive stakes?"**  
Yes! Both active and inactive stake accounts can be converted to JitoSOL.

**"Why does stake account conversion take 10 hours?"**  
Stake account conversions go through the [Interceptor system](/jitosol/user-guides/interceptor/) to protect JitoSOL liquidity. Your JitoSOL is automatically delivered after the cooldown.

**"How long does deactivation take?"**  
Deactivation completes at the start of the next epoch, which can take up to 2 days depending on timing.

## Need Help?

**Stake accounts not showing?** Make sure you're connected to the wallet that owns the stake accounts.

**Transaction failing?** Ensure you have enough SOL for transaction fees (~0.00008 SOL as shown in screenshots).

**Questions about the process?** Visit our [Discord community](https://discord.gg/jitocommunity) for support.
