---
title: 'JitoSOL Glossary'
subtitle: 'Key terms and definitions for understanding JitoSOL'
section_type: 'page'
order: 0
---

## Core Terms

**JitoSOL**
A liquid staking token representing staked SOL in the Jito stake pool. Earns staking + MEV rewards while remaining tradeable and usable in DeFi.

**JTO**
Governance token for the Jito Network and DAO. JTO holders can vote on protocol proposals, parameter changes, and fee structures.

**Exchange Rate**
Current value of JitoSOL relative to SOL. Starts at 1:1 and increases over time as staking and MEV rewards accumulate in the token price.

**MEV (Maximum Extractable Value)**
Additional profit from reordering, including, or excluding transactions within blocks. Also known as Maximal Extractable Value. Jito captures MEV through validator auction mechanisms and shares it with JitoSOL holders.

**Stake Pool**
Smart contract that aggregates SOL from many users and delegates to multiple validators. Built on Solana Labs' audited Stake Pool program.

**Liquid Staking**
Staking method that provides a tradeable receipt token (JitoSOL) representing your staked position while earning rewards.

## Technical Terms

**Epoch**
Solana time period lasting approximately 2-3 days. Staking rewards are calculated and distributed at each epoch boundary.

**Validator**
Network participant that processes transactions and secures the blockchain. Jito delegates to high-performing validators with competitive commission rates.

**StakeNet**
Jito's automated validator selection and management system that uses on-chain performance data and algorithmic scoring.

**Jito Steward Program**
On-chain program that continuously evaluates validators and automatically rebalances stake allocation to optimize network security and returns.

**Jito Interceptor**
Protection mechanism that applies during the 10-hour cooldown period after staking, ensuring continuous rewards while preventing exploitation.

## Fees and Rewards

**Management Fee**
4% of total rewards (staking + MEV) used to fund protocol development and operations. Applied after validator commissions.

**Withdrawal Fee**
0.1% fee charged only for direct unstaking via the Jito website. Avoided by trading JitoSOL on DEXs like Jupiter.

**Validator Commission**
Fees charged by individual validators (typically 0-5% for Jito-selected validators). Jito selects validators with competitive rates to maximize user returns.

**APY (Annual Percentage Yield)**
Estimated annual percentage yield based on recent performance, including both staking rewards and MEV rewards. Historical performance does not guarantee future results.

## DeFi Terms

**Yield Farming**
Using JitoSOL in DeFi protocols (lending, liquidity pools) to earn additional rewards beyond base returns.

**Impermanent Loss**
Potential loss when providing JitoSOL to liquidity pools if the relative price changes compared to the paired token.

**Slippage**
Price difference between expected and actual execution price when trading, especially relevant for large JitoSOL trades.

**Collateral**
Using JitoSOL as backing for loans in lending protocols like Solend or Kamino, unlocking liquidity without unstaking.

## Cross-Chain Terms

**Bridge**
Infrastructure enabling JitoSOL transfers between different blockchains while maintaining its liquid staking properties.

**Wormhole**
Cross-chain protocol that facilitates secure JitoSOL transfers to other networks like Ethereum or Arbitrum.

**NTT (Native Token Transfer)**
Advanced bridging technology that preserves JitoSOL's native properties and metadata across different chains.

## Security Terms

**Non-Custodial**
Users maintain full control of their funds through smart contracts without relying on centralized intermediaries.

**Smart Contract Risk**
Potential for bugs or vulnerabilities in code affecting user funds. Mitigated through multiple security audits, including nine audits of the underlying SPL Stake Pool program.

**Validator Risk**
Impact of individual validator performance, downtime, or poor behavior on overall pool returns.

**Slashing Risk**
Theoretical penalty for severe validator misconduct. Risk is distributed across multiple validators. Slashing is currently not implemented on Solana.

## Operational Terms

**RPC Endpoint**
Remote Procedure Call endpoints that wallets and applications use to interact with the Solana blockchain.

**Transaction Signature**
Unique 88-character identifier for each blockchain transaction, used for tracking and verification.

**Cooldown Period**
Wait time of up to 1 epoch (~2-3 days maximum) when directly unstaking through the Jito protocol.

**Instant Liquidity**
Immediate conversion of JitoSOL to SOL through DEX trading, avoiding cooldown periods but potentially incurring slippage.

**Priority Fees**
Optional higher transaction fees users can pay during network congestion to increase chances of transaction success.

## Comparison Terms

**Native Staking**
Traditional direct staking to validators without receiving a liquid token, requiring epoch-long lockup periods.

**LST (Liquid Staking Token)**
Category of tokens like JitoSOL that represent staked positions while maintaining tradability and DeFi utility.

**TVL (Total Value Locked)**
Approximate total amount of SOL currently staked in the Jito pool, indicating protocol size and adoption.

**Fair Value**
Theoretical direct conversion rate between JitoSOL and SOL without market premiums or discounts. Calculated based on the stake pool's exchange rate.

## Network Terms

**Congestion**
High network activity causing slower transaction processing and higher failure rates, common during memecoin activity.

**Dropped Transaction**
Transaction that fails to be included in a block, requiring retry. Common during network congestion periods.

**Block Space**
Limited transaction capacity per block. High demand can cause competition and congestion.

## Important Notice

These definitions are for informational purposes only and do not constitute financial advice. Cryptocurrency staking involves risks including potential loss of funds. Past performance does not guarantee future results. Users should conduct their own research and consider their risk tolerance before participating in any staking activities.

For detailed explanations and current rates, see the relevant documentation sections.