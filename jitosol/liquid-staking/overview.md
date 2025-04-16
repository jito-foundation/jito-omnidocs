---
title: "Liquid Staking Overview"
description: "Understanding the basics of liquid staking with Jito"
section_type: "page"
order: 10
domain: "jitosol"
---

# JitoSOL Liquid Staking Overview

JitoSOL is Jito's liquid staking solution built on Solana. It allows users to earn staking rewards while maintaining the liquidity of their assets.

## How JitoSOL Works

1. **Deposit SOL**: Users deposit SOL into the Jito staking pool
2. **Receive jitoSOL**: Users receive jitoSOL tokens in return at the current exchange rate
3. **Earn Rewards**: jitoSOL automatically accrues staking rewards plus MEV extraction rewards
4. **Use as Liquid Asset**: jitoSOL can be transferred, traded, or used in DeFi applications
5. **Redeem Anytime**: jitoSOL can be redeemed for SOL at any time

## Getting Started

### Staking SOL for jitoSOL

You can stake SOL to receive jitoSOL through:

1. **Jito Website**: Visit [stake.jito.network](https://stake.jito.network) for a user-friendly interface
2. **Jupiter Aggregator**: Use [Jupiter](https://jup.ag) to swap SOL for jitoSOL
3. **Programmatic Access**: Interact directly with the Jito staking program

Here's an example of a staking transaction using the Solana CLI:

```bash
# First, find your SOL account
solana address

# Then stake SOL to receive jitoSOL (example using 10 SOL)
solana transfer --from <YOUR_KEYPAIR> JitoStakePoolAddress 10 --allow-unfunded-recipient
```

### Exchange Rate

The exchange rate between SOL and jitoSOL grows over time as staking rewards accrue:

- When rewards are earned, the SOL backing each jitoSOL increases
- The value of jitoSOL relative to SOL increases
- New stakers receive proportionally fewer jitoSOL tokens for the same amount of SOL

You can check the current exchange rate at [stake.jito.network](https://stake.jito.network) or using the Jito SDK:

```javascript
import { Connection } from '@solana/web3.js';
import { getJitoExchangeRate } from '@jito-foundation/sdk';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const exchangeRate = await getJitoExchangeRate(connection);
console.log(`1 jitoSOL = ${exchangeRate} SOL`);
```

## Performance and Rewards

JitoSOL offers competitive returns through two revenue streams:

1. **Traditional Staking Rewards**: Earned from Solana's inflationary rewards
2. **MEV Extraction**: Additional rewards from Jito's MEV infrastructure

The combined APY typically outperforms standard Solana staking by 1-2%, making it one of the most profitable liquid staking options available. 