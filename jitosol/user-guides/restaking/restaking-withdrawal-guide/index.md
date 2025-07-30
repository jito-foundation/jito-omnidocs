---
title: 'Restaking Withdrawal Guide'
subtitle: 'Step-by-step guide for withdrawing assets from restaking vaults'
section_type: 'page'
order: 3
---

## Understanding Withdrawals

**Standard Withdrawal Process:**
The primary method for exiting restaking positions follows a three-step process:
1. **Initiate withdrawal** - Choose amount and start cooldown
2. **Two-epoch cooldown period** - Wait approximately 4-5 days  
3. **Complete withdrawal** - Claim your assets after cooldown

**Why the Waiting Period:**
- The protocol requires a two-epoch cooldown for security
- This helps maintain system stability and protects all deposited assets  
- Your funds remain locked during this period and stop earning rewards
- Cooldown cannot be cancelled once initiated

**Important Considerations:**
- Withdrawal incurs both a 0.1% withdrawal fee and 0.1% program fee (0.2% total)
- Individual vaults may have additional withdrawal fees
- Assets stop earning rewards during the cooldown period
- Market conditions may affect the timing of your exit strategy

## Before You Withdraw

**Review Your Position:**
- Check current vault value and performance
- Calculate potential fees and costs
- Consider timing and market conditions
- Evaluate alternative strategies

**Understand Timing:**
- Two-epoch cooldown period (approximately 4-5 days)
- Plan for asset unavailability during the entire cooldown
- Consider current epoch timing when initiating withdrawals
- Account for potential network congestion affecting transaction speed

## Step 1: Access Your Restaking Position

![Restaking Dashboard - My Vaults](/shared/images/jitosol/restaking-dashboard-my-vaults-vrts.png)

1. Navigate to [jito.network/restaking/dashboard/](https://jito.network/restaking/dashboard/)
2. Connect your wallet if not already connected
3. Locate the vault position you want to exit in the "My Vaults" section
4. Click the **"Initiate Withdrawal"** button next to your chosen position

## Step 2: Initiate Withdrawal

![Restaking Withdrawal - Enter Amount](/shared/images/jitosol/restaking-initiate-withdrawal-screen.png)

**Select Withdrawal Amount:**
- Choose between partial or full withdrawal from your position
- Enter the VRT token amount you want to redeem (e.g., "bzSOL" tokens)
- Use the "Max" button to withdraw your full position
- Review the exchange rate shown (e.g., "1 bzSOL ≈ 1.0031 BNSOL")

**Review Withdrawal Details:**
- **To Receive:** Shows the underlying asset amount you'll get (e.g., "BNSOL")
- **Fees:** Displays withdrawal fees - typically "0.10% withdrawal fee & 0.10% program fee"
- **Net Amount:** Final amount after fees are deducted

**Withdrawal Process:**
- **Standard Process:** Normal two-epoch cooldown with standard fees
- **Cooldown Period:** Approximately 4-5 days before assets are claimable
- **You cannot cancel or modify** the withdrawal once initiated
- Click **"Initiate Withdrawal"** to begin the cooldown process and claim your original assets

## Step 3: Choose Withdrawal Method

### Standard Withdrawal Process

**Unbonding Period (Two Epochs):**
- Assets enter a secure unbonding queue
- Cooldown period lasts approximately 4-5 days
- Your VRT tokens are locked during this time
- Duration is fixed and cannot be shortened

**During the Cooldown:**
- Your assets stop earning rewards immediately
- Withdrawal cannot be cancelled once initiated
- You can monitor progress on your dashboard
- VRT tokens remain in your wallet but are marked for withdrawal

**Completion Process:**
- After cooldown completes, claim becomes available
- Navigate to "In Withdrawal" section of your dashboard
- Execute the final "Complete Withdrawal" transaction
- Your original assets are returned to your wallet
- VRT tokens are burned in the process

## Step 4: Execute Withdrawal

**Review Transaction Details:**
- Verify withdrawal amount and method
- Check all fees and expected outputs
- Confirm asset types you'll receive
- Review timing expectations

**Approve Transaction:**
- Sign the withdrawal initiation transaction in your wallet
- Pay the required transaction fees (in SOL)
- Wait for blockchain confirmation (usually 30-60 seconds)
- Save the transaction signature for your records

**Track Progress:**

![Restaking Dashboard -- In Withdrawal](/shared/images/jitosol/restaking-dashboard-in-progress-withdrawals.png)

- Monitor unbonding status on your restaking dashboard
- Check the **"In Withdrawal"** section for progress updates
- Each withdrawal shows:
  - **Asset type** being withdrawn (e.g., JitoSOL, JTO)
  - **Withdrawal amount** and source vault
  - **Status:** "Ready to Withdraw" when cooldown completes
  - **Withdraw button** to claim when ready
- Note the expected completion date (approximately 4-5 days)
- Set calendar reminders for when you can complete the withdrawal

## Step 5: Complete Withdrawal

### Completing Your Withdrawal

**Monitor the Cooldown:**
- Regularly check your dashboard for status updates
- Look for notifications when the cooldown period ends
- Prepare to execute the final claim transaction
- Ensure you have SOL for the completion transaction fees

**Claim Your Assets:**

![Restaking Complete Withdrawal](/shared/images/jitosol/restaking-complete-withdrawal-burn-withdrawal-ticket.png)

- Go to the "In Withdrawal" section of your dashboard
- Find your withdrawal marked as "Ready to Withdraw"
- Click the **"Withdraw"** button next to your completed cooldown
- The interface shows:
  - **Amount available** to withdraw (e.g., "0.00001432 ezSOL")
  - **Final confirmation:** "In finalizing this withdrawal, X JitoSOL will be transferred to your wallet and the VRTs will be burned"
- Click **"Complete Withdrawal"** to finalize
- Sign the final claim transaction in your wallet
- Pay transaction fees for processing the claim
- Verify your original assets appear in your wallet and VRTs are burned

**Final Verification:**
- Confirm you received the expected amount of assets
- Account for any withdrawal fees that were deducted
- Check that your VRT tokens were properly burned
- Save transaction records for tax and accounting purposes

## Alternative Exit Strategies

**VRT Token Trading:**
- Sell VRT tokens on secondary markets (if liquidity exists)
- Avoids the two-epoch unbonding period for immediate liquidity
- May trade at premium or discount to underlying asset value
- Check market depth and slippage before trading

**Position Management:**
- Add more assets to existing positions anytime
- Transfer VRT tokens between wallets if needed
- Use VRT tokens in compatible DeFi protocols for additional yield

This guide covers standard withdrawal processes. Specific vaults may have unique requirements or procedures. Always check vault-specific documentation and current terms before initiating withdrawals. 