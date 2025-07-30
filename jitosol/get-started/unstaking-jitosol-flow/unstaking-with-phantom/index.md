---
title: Unstaking with Phantom
subtitle: "Step-by-step guide for delayed unstaking using Phantom wallet"
section_type: page
order: 2
---

This guide covers the **delayed unstaking** process using Phantom wallet. For most users, we recommend [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead.

**Time Required:** Initial setup (5 minutes) + waiting period (up to 2 days)  
**Fee:** 0.1% unstaking fee

## Step 1: Connect Your Phantom Wallet

Navigate to [jito.network/staking](https://jito.network/staking/) and connect your wallet:

![Jito Header Before Connecting](/shared/images/jitosol/wallet-unstake-sol-header-with-connect-button-before-connecting.png)

Click **"Connect Wallet"** in the top right corner.

![Choose Wallet Options](/shared/images/jitosol/wallet-unstake-sol-choose-wallet-options.png)

Select **"Phantom"** from the wallet options.

![Phantom Connection Prompt](/shared/images/jitosol/phantom-unstake-sol-connect-wallet.png)

Click **"Connect"** to authorize Phantom to connect with Jito.

![Connected Wallet Address](/shared/images/jitosol/phantom-unstake-sol-wallet-address-button.png)

Confirm your wallet is connected by checking the address in the top right corner.

## Step 2: Choose Delayed Unstaking Option

On the staking page, select the **"Unstake"** tab and choose the delayed unstaking option:

![Delayed Unstaking Process](/shared/images/jitosol/stake-page-unstake-section-delayed-unstake-flow.png)

- Enter the amount of JitoSOL you want to unstake
- Choose **"Delayed in X days"** showing 0.1% fee
- Click **"Unstake SOL"** to initiate the process

![Delayed Unstaking Confirmation](/shared/images/jitosol/stake-page-confirm-modal-delayed-flow-unstake-jitosol.png)

The interface provides detailed step-by-step instructions and links to wallet-specific guides.

## Step 3: Access SOL in Your Phantom Wallet

After initiating unstaking, your stake account will appear in Phantom. Navigate to your SOL holdings:

![Phantom Home Screen Options](/shared/images/jitosol/phantom-unstake-sol-option-step-1.png)

Click on **Solana (SOL)** in your wallet to access the detailed view where you can manage your stakes.

![Phantom SOL Detail Page](/shared/images/jitosol/phantom-unstake-sol-detail-page-step-2.png)

## Step 4: View Your Stakes

In the SOL detail page, you'll see your stake accounts:

![Phantom Your Stakes View](/shared/images/jitosol/phantom-unstake-sol-your-stakes-step-3.png)

![Phantom Stakes with Active](/shared/images/jitosol/phantom-unstake-sol-your-stakes-with-active-step-3a.png)

Your stakes will be listed with their current status:
- **Active**: Currently earning rewards, needs to be deactivated
- **Activating**: In the process of becoming active
- **Deactivating**: Cooling down, will become inactive at next epoch
- **Inactive**: Ready to withdraw

## Step 5: Deactivate Active Stakes

For any stakes showing as **"Active"**, you need to deactivate them:

![Phantom Deactivate Process](/shared/images/jitosol/phantom-unstake-sol-active-unstake-deactivate-step-4a.png)

1. **Select the active stake account**
2. **Click "Unstake"** to begin deactivation
3. **Confirm the transaction** in Phantom

After deactivation is initiated, you'll see confirmation:

![Phantom Deactivated Confirmation](/shared/images/jitosol/phantom-unstake-sol-active-unstaked-deactivated-confirmed-step-5a.png)

**Important:** You must deactivate each active stake account individually.

## Step 6: Wait for Epoch Completion

**Waiting Period:** Up to 2 days (1 Solana epoch)

The stake needs to cool down due to Solana's protocol requirements. This applies to all unstaking methods, not just JitoSOL. You can check the status in Phantom. Once it shows **"Inactive"**, it's ready to withdraw.

## Step 7: Withdraw Your SOL

Once your stakes show as **"Inactive"**:

![Phantom Withdraw Stake](/shared/images/jitosol/phantom-unstake-sol-withdraw-stake-step-4.png)

1. **Select the inactive stake account**
2. **Click "Withdraw Stake"**
3. **Confirm the withdrawal transaction**

After successful withdrawal:

![Phantom Withdraw Confirmed](/shared/images/jitosol/phantom-unstake-sol-withdraw-confirmed-step-5.png)

Your SOL will now be available as regular SOL in your wallet for immediate use.

## Key Points to Remember

- ⚠️ **Multiple Accounts**: You may have multiple stake accounts to deactivate and withdraw individually
- ⏰ **Timing**: The up to 2-day wait is a Solana protocol requirement, not specific to JitoSOL
- 🔄 **Process**: This is irreversible once initiated -- Jito removes your stake from the pool immediately
- 💰 **Fees**: 0.1% unstaking fee applies to the delayed method

## Need Instant Access?

If you can't wait up to 2 days, consider [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead:
- ✅ Immediate settlement
- ✅ Single transaction
- ✅ Convert to any token, not just SOL

## Troubleshooting

**Don't see your stake accounts?**
- Ensure you've initiated unstaking from the Jito website first
- Check that your Phantom wallet is properly connected
- Refresh your wallet or reconnect if needed

**Stakes still showing as Active?**
- You must manually deactivate each Active stake account
- This step cannot be skipped. It's required by Solana's protocol

**Need additional help?**
- Review the [main unstaking overview](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/)
- Join our [Discord community](https://discord.gg/jitocommunity) for support
