---
title: 'Troubleshooting'
subtitle: 'Common issues and solutions when using JitoSOL'
section_type: 'page'
order: 1
---

## Transaction Issues

**Q: My staking transaction failed. What should I do?**

Transaction failures on Solana are often caused by network congestion, insufficient SOL for fees, or invalid transaction parameters. Try these solutions:

**Common causes:**
- **Network congestion**: High traffic on the network can lead to slow transaction processing and errors
- **Insufficient SOL for transaction fees**: Ensure you have at least 0.001-0.002 SOL for fees
- **Wallet connection issues**: Refresh your wallet connection
- **RPC endpoint problems**: Try switching to a different RPC endpoint in your wallet settings

**Solutions:**
1. **Wait for lower congestion**: Check network congestion using tools like Solana Explorer and consider waiting for a less busy period
2. **Increase priority fees**: Many wallets allow you to set higher priority fees for better transaction success rates
3. **Try multiple times**: The recommended approach is persistence - failed transactions don't cost fees
4. **Check your SOL balance**: Ensure you have enough SOL to cover both the staking amount and transaction fees

**Q: I sent a transaction but it's been pending for a long time. What's happening?**

Solana transactions can be dropped for several reasons, including block capacity limits, account write-locks, or network congestion. 

**What's likely happening:**
- **Network congestion**: During peak times, validators can only accept a certain amount of transactions per second
- **Dropped transaction**: If nodes are slow in forwarding transactions or don't correctly forward them to the current leader, transactions can be dropped
- **Blockhash expiry**: Solana transactions have a short validity period (about 2 minutes)

**Solutions:**
1. **Wait**: Give transactions 2-5 minutes to process during congestion
2. **Check transaction status**: Use Solana Explorer with your transaction signature
3. **Retry**: If a transaction hasn't appeared after 5 minutes, it's likely dropped and safe to retry
4. **Refresh wallet**: Some wallets have a "refresh" or "resync" function

**Q: My unstaking transaction shows as successful but I haven't received my SOL yet. Why?**

The direct unstaking delays are not specific to JitoSOL - these are features of the Solana protocol. Users choosing to unstake via the jito.network interface must wait up to 1 epoch (up to 2-3 days) to receive their SOL.

**For delayed unstaking:**
- **Epoch timing**: Stake can only be withdrawn at the end of the current epoch. Since epochs last ~2.5 days, you wait anywhere from a few minutes to a full epoch depending on when you unstake
- **Status tracking**: Check your stake status on the [Jito Dashboard](https://www.jito.network/manage/)
- **Rewards continue**: You will still earn rewards for the rest of the epoch you unstaked in

**For instant unstaking via Jupiter:**
- Transaction may still be processing through DEX liquidity
- Check your wallet balance and transaction history

## Wallet Connection Issues

**Q: I can't connect my wallet to the Jito website. What should I try?**

**Troubleshooting steps:**
1. **Check browser compatibility**: Use Chrome, Firefox, or Edge (latest versions)
2. **Clear browser cache and cookies**: This resolves many connection issues
3. **Try a different browser**: Sometimes wallet extensions work better in different browsers
4. **Update your wallet extension**: Ensure you're running the latest version
5. **Disable ad blockers**: Some ad blockers interfere with wallet connections
6. **Check network connectivity**: Ensure stable internet connection
7. **Restart browser**: Close all browser windows and restart

**Common wallet-specific fixes:**
- **Phantom**: Try disconnecting and reconnecting in wallet settings
- **Solflare**: Clear site data for jito.network in wallet settings
- **Ledger**: Ensure Solana app is open and up-to-date on device

**Q: My wallet shows a different balance than what I see on the Jito website. Why?**

**Common causes and solutions:**
1. **Sync delays**: Wallet balances can take time to update, especially during network congestion
2. **RPC endpoint differences**: Your wallet and the website may use different RPC endpoints
3. **Cache issues**: Clear wallet cache or refresh the page

**Solutions:**
- **Manual refresh**: Most wallets have a refresh/sync button
- **Wait**: Give it 1-2 minutes for balances to sync
- **Switch RPC**: Try changing your wallet's RPC endpoint
- **Check multiple sources**: Compare with Solana Explorer or other block explorers

## Slippage and Pricing Issues

**Q: I got less JitoSOL than expected when staking. Why?**

At launch, 1 JitoSOL = 1 SOL. As rewards are accrued, JitoSOL will appreciate vs SOL, meaning you receive fewer JitoSOL tokens over time as they become more valuable.

**This is normal behavior:**
- **Appreciation mechanism**: The value of JitoSOL tokens will increase over time due to staking rewards and MEV rewards
- **Exchange rate**: Check the current SOL→JitoSOL exchange rate on the Jito website
- **Calculation**: Your SOL amount ÷ current exchange rate = JitoSOL received

**Example:** If the rate is 1.2 SOL = 1 JitoSOL, staking 10 SOL gives you ~8.33 JitoSOL worth more than 10 SOL.

**Q: Jupiter shows high slippage when trying to swap JitoSOL. What should I do?**

For large transactions, double check the slippage on Jupiter. The Jito website will always provide direct unstaking with no slippage except for the 10bps fee and the 1-2 epoch waiting period.

**Solutions:**
1. **Use delayed unstaking**: Direct unstaking via Jito has no slippage, only the 0.1% fee and up to 1 epoch wait
2. **Split large trades**: Break large swaps into smaller amounts
3. **Check liquidity**: Look for deeper liquidity pools on different DEXs
4. **Increase slippage tolerance**: If urgent, accept higher slippage
5. **Time your trade**: Avoid peak trading times when liquidity is stretched

## Network and Performance Issues

**Q: The Jito website is loading slowly or not responding. What can I do?**

**Troubleshooting steps:**
1. **Check Jito status**: Look for status updates on [Jito Discord](https://discord.gg/jitocommunity)
2. **Clear browser cache**: Remove cached files for jito.network
3. **Try incognito mode**: Test if extensions are causing issues
4. **Check your internet**: Test connection speed and stability
5. **Use mobile**: Try accessing via mobile browser or app
6. **Wait and retry**: If site is experiencing high traffic, wait 10-15 minutes

**Q: I'm getting RPC errors when trying to use JitoSOL. How do I fix this?**

**RPC (Remote Procedure Call) errors are common during network congestion:**

**Immediate fixes:**
1. **Switch RPC endpoint**: Change to a different RPC in your wallet settings
2. **Wait and retry**: Give it some time, resync the wallet and try again
3. **Use public RPCs**: Try Solana's public RPC endpoints as backup

**Recommended RPC endpoints:**
- Solana Mainnet: `https://api.mainnet-beta.solana.com`
- Helius: `https://rpc.helius.xyz`
- QuickNode: Available with free account

## Mobile Device Issues

**Q: JitoSOL features don't work properly on my mobile device. What should I try?**

**Common mobile issues and fixes:**
1. **Use official apps**: You can start liquid staking with Jito in a couple taps directly in Phantom
2. **Update mobile wallet**: Ensure latest version of Phantom, Solflare, etc.
3. **Use mobile browser**: If app doesn't work, try mobile Safari/Chrome
4. **Check mobile data**: Switch between WiFi and mobile data
5. **Restart app**: Force close and reopen wallet app
6. **Clear app cache**: In device settings, clear cache for wallet app

**Phantom-specific mobile tips:**
- Open the Phantom app, select the Explore tab, search for "Jito Staked SOL"
- Use the built-in Jito integration rather than external websites

## Getting Additional Help

If you continue to experience issues after trying these solutions:

1. **Check the [Jito Discord](https://discord.gg/jitocommunity)** for known issues and real-time support
2. **Ask questions in the #support channel** with these details:
   - Transaction signature (if applicable)
   - Wallet type and version
   - Browser and device information
   - Exact error message
   - Screenshots if helpful
3. **Monitor [Jito's Twitter](https://twitter.com/jito_network)** for network status updates
4. **Use [Solana Explorer](https://explorer.solana.com)** to verify transaction status independently

**When asking for help, always include:**
- Transaction signature (starts with numbers/letters, about 88 characters)
- Wallet address (your public key)
- Amount involved
- Exact time of the issue
- Screenshots of error messages

**Never share:**
- Private keys or seed phrases
- Passwords
- Personal information beyond what's needed for troubleshooting