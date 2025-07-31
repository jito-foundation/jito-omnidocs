---
title: 'Troubleshooting'
subtitle: 'Common issues and solutions when using JitoSOL'
section_type: 'page'
order: 20
---

## Transaction Issues

**Q: My staking transaction failed. What should I do?**

Common causes:
- Network congestion
- Insufficient SOL for fees (need 0.001-0.004 SOL depending on activity)
- Wallet connection issues

Solutions:
1. Wait for lower congestion or increase priority fees/tips
2. Check SOL balance covers staking amount + fees
3. Refresh browser tab and wallet connection
4. Try multiple times - persistence is key

**Q: My transaction is pending for a long time. What's happening?**

Transactions can be dropped due to network congestion, block capacity limits, or blockhash expiration (~2 minutes).

Solutions:
1. Wait 2-5 minutes during congestion
2. Check transaction status on Solana Explorer
3. Retry if no confirmation after 5 minutes
4. Refresh/resync wallet

**Q: Unstaking shows successful but I haven't received SOL. Why?**

If you used delayed unstaking:
- Check stake status on [Stake Manage Dashboard](https://www.jito.network/manage/)
- If your new stake account is still active, you need to unstake/deactivate it
- If already deactivated, you need to wait up to 1 epoch (about 2 days) to withdraw. This is a Solana protocol feature

If you used instant unstaking (Jupiter):
- Refresh and check wallet balance and transaction history

## Wallet Connection Issues

**Q: Can't connect wallet to Jito website?**

Solutions:
1. Use Chrome, Firefox, or Edge (latest versions)
2. Clear browser cache and cookies
3. Update wallet extension
4. Disable ad blockers
5. Try different browser or restart current one

Wallet-specific fixes:
- Phantom: Disconnect/reconnect in settings
- Solflare: Clear site data for jito.network
- Ledger: Ensure Solana app is open and updated

**Q: Wallet balance differs from Jito website?**

Solutions:
1. Manual refresh wallet (most have refresh/sync button)
2. Wait 1-2 minutes for sync
3. Compare with Solana Explorer for your address

## Slippage and Pricing Issues

**Q: Got less JitoSOL than expected when staking?**

This is normal. JitoSOL appreciates vs SOL over time due to rewards. At launch 1 JitoSOL = 1 SOL, but as rewards accrue, you receive fewer (but more valuable) JitoSOL tokens.

Example: If rate is 1.2 SOL = 1 JitoSOL, staking 10 SOL gives ~8.33 JitoSOL, but that 8.33 JitoSOL is worth the same as 10 SOL.

**Q: Instant Unstake shows high spreads or price impact for JitoSOL swaps?**

Solutions:
1. Use delayed unstaking: Direct via Jito = no slippage, only 0.1% fee + 1 epoch wait
2. Split large trades into smaller amounts
3. Check deeper liquidity pools on different DEXs

## Network and Performance Issues

**Q: Jito website loading slowly or not responding?**

Solutions:
1. Check [Jito Discord](https://discord.gg/jitocommunity) for status updates
2. Clear browser cache for jito.network
3. Try incognito mode
4. Test on mobile browser
5. Wait 10-15 minutes if high traffic

## Mobile Device Issues

**Q: JitoSOL staking features don't work on mobile?**

Solutions:
1. Use Phantom app: Open app → Explore tab → search "Jito"
2. Update mobile wallet to latest version
3. Try mobile browser (Safari/Chrome) if app fails
4. Switch between WiFi and mobile data
5. Force close and reopen wallet app
6. Clear app cache in device settings

## Getting Additional Help

For ongoing issues:

[Jito Discord](https://discord.gg/jitocommunity)

Include when asking for help:
- Transaction signature (88-character string)
- Wallet type and version
- Browser/device info
- Exact error message
- Screenshots if helpful

Never share:
- Private keys or seed phrases
- Passwords