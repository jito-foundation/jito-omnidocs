---
title: Unstaking with Phantom
subtitle: "Step-by-step guide for delayed unstaking using Phantom wallet"
section_type: page
order: 10
---

This guide covers **delayed unstaking** using Phantom wallet. For most users, we recommend [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead.

**Time Required:** Setup (5 minutes) + waiting period (up to 2 days)  
**Fee:** 0.1% unstaking fee

## Step 1: Connect Your Phantom Wallet

1. Go to [jito.network/staking](https://www.jito.network/staking/)

![Jito Header Before Connecting](/shared/images/jitosol/wallet-unstake-sol-header-with-connect-button-before-connecting.png)

2. Click **"Connect Wallet"** in the top right corner

![Choose Wallet Options](/shared/images/jitosol/wallet-unstake-sol-choose-wallet-options.png)

3. Select **"Phantom"** from the wallet options

![Phantom Connection Prompt](/shared/images/jitosol/phantom-unstake-sol-connect-wallet.png)

4. Click **"Connect"** to authorize the connection

![Connected Wallet Address](/shared/images/jitosol/phantom-unstake-sol-wallet-address-button.png)

5. Verify your wallet address appears in the top right corner

## Step 2: Choose Delayed Unstaking Option

1. Select the **"Unstake"** tab
2. Enter JitoSOL amount to unstake
3. Choose **"Delayed in X days"** (shows 0.1% fee)
4. Click **"Unstake SOL"**

![Delayed Unstaking Process](/shared/images/jitosol/stake-page-unstake-section-delayed-unstake-flow.png)

![Delayed Unstaking Confirmation](/shared/images/jitosol/stake-page-confirm-modal-delayed-flow-unstake-jitosol.png)

## Step 3: Access SOL in Your Phantom Wallet

After initiating unstaking, your stake account will appear in Phantom. Navigate to your SOL holdings:

![Phantom Home Screen Options](/shared/images/jitosol/phantom-unstake-sol-option-step-1.png)

Click on **Solana (SOL)** to access the detailed view.

![Phantom SOL Detail Page](/shared/images/jitosol/phantom-unstake-sol-detail-page-step-2.png)

## Step 4: View Your Stakes

In the SOL detail page, you'll see your stake accounts:

![Phantom Your Stakes View](/shared/images/jitosol/phantom-unstake-sol-your-stakes-step-3.png)

![Phantom Stakes with Active](/shared/images/jitosol/phantom-unstake-sol-your-stakes-with-active-step-3a.png)

**Stake Status:**
- **Active**: Earning rewards, needs deactivation
- **Activating**: Becoming active
- **Deactivating**: Cooling down, will become inactive at next epoch
- **Inactive**: Ready to withdraw

## Step 5: Deactivate Active Stakes

For any stakes showing as **"Active"**, you need to deactivate them:

![Phantom Deactivate Process](/shared/images/jitosol/phantom-unstake-sol-active-unstake-deactivate-step-4a.png)

1. Select the active stake account
2. Click **"Unstake"** to begin deactivation
3. Confirm the transaction

![Phantom Deactivated Confirmation](/shared/images/jitosol/phantom-unstake-sol-active-unstaked-deactivated-confirmed-step-5a.png)

**Note:** Deactivate each active stake account individually.

## Step 6: Wait for Epoch Completion

**Waiting Period:** Up to 2 days (1 Solana epoch)

The stake needs to cool down due to Solana's protocol requirements. This applies to all unstaking methods, not just JitoSOL. You can check the status in Phantom. Once it shows **"Inactive"**, it's ready to withdraw.

## Step 7: Withdraw Your SOL

Once your stakes show as **"Inactive"**:
1. Select the inactive stake account
2. Click **"Withdraw Stake"**
3. Confirm the withdrawal transaction

![Phantom Withdraw Stake](/shared/images/jitosol/phantom-unstake-sol-withdraw-stake-step-4.png)

![Phantom Withdraw Confirmed](/shared/images/jitosol/phantom-unstake-sol-withdraw-confirmed-step-5.png)

SOL will then be available as regular SOL in your wallet.

## Key Points

- **Multiple Accounts**: You may have multiple stake accounts to process individually
- **Timing**: Up to 2-day wait is a Solana protocol requirement
- **Process**: Irreversible once initiated
- **Fees**: 0.1% unstaking fee applies

## Need Instant Access?

If you can't wait up to 2 days, consider [instant trading via Jupiter](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/#option-1-instant-trading-recommended) instead:
- Immediate settlement
- Single transaction
- Convert to any token, not just SOL

## Troubleshooting

**Don't see your stake accounts?**
- Ensure you've initiated unstaking from the Jito website first
- Check that your Phantom wallet is properly connected
- Refresh your wallet or reconnect if needed

**Stakes still showing as Active?**
- You must manually deactivate each Active stake account
- This step cannot be skipped. It's required by Solana's protocol

**Need help?**
- Review [unstaking overview](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/)
- Join [Discord community](https://discord.gg/jitocommunity)
