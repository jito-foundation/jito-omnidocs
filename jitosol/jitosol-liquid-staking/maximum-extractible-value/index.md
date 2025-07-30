---
title: 'Maximum Extractable Value'
order: 1
section_type: 'page'
subtitle: 'What is MEV and how does JitoSOL benefit from it?'
---

## MEV Explained

Maximum extractable value (MEV) describes profit opportunities priveledged entities can extract attributable to the specific order of transaction execution. For example, a large swap on Orca can lower the pool’s price below that of Raydium or Serum. Traders will race to profit from that price difference and this arbitrage is considered MEV.

Alternatively, a large account on Solend may be near liquidation. Liquidation bots will vie to be the first to process that liquidation as soon as the price threshold is exceeded. These liquidation profits are another form of MEV.

MEV is a natural byproduct of financial markets with infinite examples in traditional finance and daily life. When Taylor Swift announces a new concert and fans rush to buy tickets directly to avoid reseller markups, that is also MEV.

The Jito Foundation's mission is to ensure that MEV is efficiently extracted and shared with stakers and validators because it increases the security and denctralization of Solana. 

## MEV Spam Problems

Solana has experienced periods of network congestion from disorderly attempts by traders to capture MEV. Transaction fees are low so traders deploy bots to resend the same transactions hundreds of times, hoping one of those transactions lands profitably.

Recall the earlier example about Taylor Swift fans swarming the website to buy tickets at a just-announced concert. The website may crash from everyone trying to buy but users will still refresh constantly to help their individual odds. Spam on Solana is quite similar.

MEV spam will only grow as network activity increases and traders become more sophisticated. This creates significant problems for Solana's network.

## Jito's MEV Solution

Jito released a new client for validators to eliminate the spam from MEV and provide rewards to stakers. The solution is an auction. Traders will submit bids for sequences of transactions they believe are profitable. Third party block engines run complex simulations to determine the combination of transactions that provides the highest value. These bids are then given to validators and stakers (JitoSOL).

Jito's mechanism eliminates the benefit of spam while simultaneously increasing rewards for stakers.

## JitoSOL MEV Rewards

JitoSOL directly benefits from these MEV rewards since the auction proceeds are passed through to stakers after a modest commission. JitoSOL is the first liquid staking token to offer this additional source of yield.

Because the rewards are based on guaranteed auction amounts, JitoSOL has no exposure to the risks around MEV trading. 

For further context on the MEV solution, checkout this overview of [Jito-Solana](https://medium.com/p/e1028c53fae1).

