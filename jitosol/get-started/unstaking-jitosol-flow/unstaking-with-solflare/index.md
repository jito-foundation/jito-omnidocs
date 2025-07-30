---
title: 'Unstaking with Solflare'
order: 1
section_type: 'page'
subtitle: 'Step-by-step guide for delayed unstaking using Solflare wallet'
---

This guide covers the **delayed unstaking** process using Solflare wallet. For most users, we recommend [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead.

**Time Required:** Initial setup (5-10 minutes) + waiting period (up to 2 days)  
**Fee:** 0.1% unstaking fee

## Step 1: Connect Your Solflare Wallet

Navigate to [jito.network/staking](https://jito.network/staking/) and connect your wallet:

![Jito Header Before Connecting](/shared/images/jitosol/wallet-unstake-sol-header-with-connect-button-before-connecting.png)

Click **"Connect Wallet"** in the top right corner.

![Choose Wallet Options](/shared/images/jitosol/wallet-unstake-sol-choose-wallet-options.png)

Select **"Solflare"** from the wallet options.

![Solflare Connection Method](/shared/images/jitosol/solflare-unstake-sol-wallet-address-button.png)

Select to connect.

![Solflare Authorization](/shared/images/jitosol/solflare-connect-wallet-screen.png)

Click **"Connect"** to authorize Solflare to communicate with Jito. You may opt to "Trust this app" to prevent future connection requests.

![Connected Wallet Address](/shared/images/jitosol/solflare-unstake-sol-wallet-address-button.png)

Confirm your wallet is connected by checking the address in the top right corner.

## Step 2: Choose Delayed Unstaking Option

On the staking page, select the **"Unstake"** tab and choose the delayed unstaking option:

![Delayed Unstaking Process](/shared/images/jitosol/stake-page-unstake-section-delayed-unstake-flow.png)

- Enter the amount of JitoSOL you want to unstake
- Choose **"Delayed in X days"** showing 0.1% fee
- Click **"Unstake SOL"** to initiate the process

![Delayed Unstaking Confirmation](/shared/images/jitosol/stake-page-confirm-modal-delayed-flow-unstake-jitosol.png)

The interface provides detailed step-by-step instructions and links to wallet-specific guides.

## Step 3: Access Staking in Solflare

After initiating unstaking, you need to manage your stake accounts in Solflare.

![Solflare Staking Options Overview](/shared/images/jitosol/solfare-unstake-sol-staking-options-step-1.png)

Simply click the **"Staking"** tab in the bottom navigation of your Solflare wallet to access your stake accounts.

## Step 4: View Your Stake Accounts

![Solflare Full Stakes List](/shared/images/jitosol/solfare-unstake-sol-staking-options-step-1-full-list.png)

The full list shows all your stake accounts with their current status. You may have multiple accounts in various denominations with different statuses:
- **Active**: Currently earning rewards, needs to be unstaked
- **Unstaked**: Ready to withdraw
- Various validators with different APY rates

## Step 5: Unstake Active Stakes

For any stakes showing as **"Active"**, you need to unstake them:

![Solflare Active Stake Details](/shared/images/jitosol/solfare-unstake-sol-unstake-active-sol-step-2.png)

1. **Click on the active stake account** - You'll see details including the validator, APY, and total stake

![Solflare Unstake Review](/shared/images/jitosol/solfare-unstake-sol-unstake-active-sol-review-step-3.png)

2. **Review the unstaking details** - Check the validator, time to unstake, and network fees
3. **Click the yellow "Review" button** when ready

![Solflare Unstake Confirmation](/shared/images/jitosol/solfare-unstake-sol-unstake-active-sol-confirm-step-4.png)

4. **Confirm the unstaking transaction** - Review all details and click **"Confirm"**

![Solflare Now Unstaking Status](/shared/images/jitosol/solfare-unstake-sol-active-sol-now-unstaking-step-4.png)

After confirmation, your stake will show as **"Unstaking"** with a countdown timer showing time remaining.

**Important:** You must unstake each active stake account individually.

## Step 6: Wait for Epoch Completion

**Waiting Period:** Up to 2 days (1 Solana epoch)

The stake needs to cool down due to Solana's protocol requirements. This applies to all unstaking methods, not just JitoSOL. You can check the status in Solflare. Once it shows **"Unstaked"**, it's ready to withdraw.

## Step 7: Withdraw Your SOL

Once your stakes show as **"Unstaked"**:

![Solflare Unstaked SOL Ready](/shared/images/jitosol/solfare-unstake-sol-inactive-sol-step-1a.png)

Your stake will be shown as **"Unstaked"** when available for withdrawal. You'll see the amount and validator details.

![Solflare Withdraw Interface](/shared/images/jitosol/solfare-unstake-sol-inactive-sol-withdraw-step-2a.png)

1. **Click "Withdraw"** to start the withdrawal process
2. **Review the withdrawal details** - Check the token amount, destination, and network fees

![Solflare Withdraw Confirmation](/shared/images/jitosol/solfare-unstake-sol-inactive-sol-withdraw-confirm-step-3a.png)

3. **Confirm the withdrawal** - Click **"Confirm"** to complete the process

Your SOL will now be available as regular SOL in your wallet for immediate use.

## Key Points to Remember

- ⚠️ **Multiple Accounts**: You may have multiple stake accounts to unstake and withdraw individually
- ⏰ **Timing**: The up to 2-day wait is a Solana protocol requirement, not specific to JitoSOL
- 🔄 **Process**: This is irreversible once initiated -- Jito removes your stake from the pool immediately
- 💰 **Fees**: 0.1% unstaking fee applies to the delayed method
- ⏱️ **Timer Display**: Solflare shows a countdown timer for unstaking progress

## Need Instant Access?

If you can't wait up to 2 days, consider [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead:
- ✅ Immediate settlement
- ✅ Single transaction
- ✅ Convert to any token, not just SOL

## Troubleshooting

**Don't see your stake accounts?**
- Ensure you've initiated unstaking from the Jito website first
- Click the "Staking" tab in the bottom navigation of your Solflare wallet
- Refresh your wallet if needed

**Stakes still showing as Active?**
- You must manually unstake each Active stake account
- This step cannot be skipped. It's required by Solana's protocol

**Can't find the Staking section?**
- Look for the "Staking" tab in the bottom navigation bar of your wallet
- The tab should be visible alongside "Tokens", "Stocks", "Earn", and "Collect"

**Unstaking timer not showing?**
- Refresh the Solflare interface
- The timer shows remaining time until withdrawal is available

**Need additional help?**
- Review the [main unstaking overview](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/)
- Join our [Discord community](https://discord.gg/jitocommunity) for support
