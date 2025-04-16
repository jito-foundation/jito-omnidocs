---
title: "Liquid Staking FAQ"
description: "Frequently asked questions about JitoSOL liquid staking"
section_type: "page"
order: 30
domain: "jitosol"
---

# Frequently Asked Questions

## General Questions

### What is JitoSOL?
JitoSOL is a liquid staking token that represents staked SOL in the Jito liquid staking pool. When you stake SOL with Jito, you receive jitoSOL tokens that can be freely transferred, traded, or used in DeFi applications.

### How is JitoSOL different from regular staking?
With regular staking, your SOL is locked for the duration of the stake. With JitoSOL, you receive a liquid token that represents your staked SOL, allowing you to maintain liquidity while still earning staking rewards.

### What are the benefits of JitoSOL?
- Earn staking rewards without lockups
- Receive additional yield from MEV extraction
- Use your staked assets in DeFi applications
- No minimum staking amount
- Distributed validator set for increased security

## Staking and Unstaking

### How do I stake SOL to get jitoSOL?
You can stake SOL through:
1. The Jito staking website: [stake.jito.network](https://stake.jito.network)
2. DEXs like Jupiter: [jup.ag](https://jup.ag)
3. Directly through the Jito staking program using the Solana CLI or SDK

### Is there a minimum amount to stake?
No, there is no minimum amount to stake with JitoSOL. However, network transaction fees apply, so very small amounts may not be economical.

### How quickly can I unstake?
Unstaking is immediate through the liquidity pool if there is enough SOL available. For larger amounts, you may need to use the delayed unstaking option, which typically takes 1-3 days.

### What is the exchange rate between SOL and jitoSOL?
The exchange rate increases over time as staking rewards accrue. It represents the amount of SOL backing each jitoSOL token and can be checked on the Jito staking website.

## Rewards and Performance

### How are rewards calculated?
Rewards come from two sources:
1. Standard Solana staking rewards (inflation)
2. MEV extraction through Jito's infrastructure

Rewards are automatically reflected in the increasing exchange rate of jitoSOL to SOL.

### What APY can I expect?
The current APY is approximately 7-8%, which is typically 1-2% higher than standard Solana staking. The exact rate varies based on network conditions and MEV opportunities.

### When are rewards distributed?
Rewards are not distributed directly to users. Instead, they increase the value of jitoSOL relative to SOL, effectively compounding automatically.

### Can I track my earnings?
Yes, you can track your earnings through:
- The Jito staking dashboard
- Calculating the difference between the current exchange rate and the rate at which you staked

## Technical Questions

### Is JitoSOL a wrapped token?
JitoSOL is an SPL token that represents your stake in the Jito staking pool. It's not a wrapped token in the traditional sense but functions similarly.

### Can I use jitoSOL in DeFi protocols?
Yes, jitoSOL can be used in many DeFi protocols, including lending platforms, liquidity pools, and as collateral in certain applications.

### What happens if a validator is slashed?
Jito's staking protocol distributes stake across multiple validators to minimize the impact of slashing events. If a validator is slashed, the impact is spread across the entire pool, reducing the effect on individual stakers.

### How can I integrate JitoSOL into my application?
Jito provides SDKs and APIs for integrating JitoSOL into applications. Refer to the [Developer Documentation](/jitosol/developers) for integration guides. 