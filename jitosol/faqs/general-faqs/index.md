---
title: General FAQs
subtitle: This page is being continuously developed. If your question is not
  listed, please ask in Jito's Discord so we know to add it here.
section_type: page
order: 0
---
## Staking and Unstaking

#### Q: How long does unstaking stake?

Users choosing to unstake via Delayed Unstake in the Jito.network staking interface must wait up to 1 epoch (about 2 days) to receive their SOL. This delay is attributable to Solana's underlying design and applies to any staking platform. We suggest users sell their JitoSOL on [Jupiter](https://jup.ag/) to receive instant liquidity and avoid any withdrawal fees. See our detailed article on [unstaking](/jitosol/get-started/unstaking-jitosol-flow/unstaking-overview/) JitoSOL.

For large transactions, double check the spread/slippage on Jupiter. The Jito website will always provide direct unstaking with no slippage except for the 10bps fee and the 1 epoch waiting period.

**Q: How long does staking take?**

Depositors will receive JitoSOL instantly after staking on the Jito website and it begins accruing rewards immediately. Here is our step-by-step [staking guide](/jitosol/get-started/stake-sol-for-jitosol-flow/overview/).

## Rewards

**Q: How do I collect my rewards?**

JitoSOL's rewards accrues in its price rather than an ongoing distribution. At launch, 1 JitoSOL = 1 SOL. As rewards are accrued, JitoSOL will appreciate vs. SOL (e.g. 1 JitoSOL = 1.20 SOL). The price appreciation guarantees all JitoSOL holders receive rewards regardless of how the token is stored.

**Q: What are staking rewards?**

Validators receive new Solana issuance in return for voting on new blocks as they are issued. This issuance (or inflation) is distributed every epoch (about 2 days). Validators pass this onto their stakers less some commission. Further [reading](https://docs.solana.com/implemented-proposals/ed_overview/ed_validation_client_economics/ed_vce_state_validation_protocol_based_rewards).

**Q: What are MEV rewards?**

MEV describes trading profits based on specific transaction ordering or timing. Jito's validator client implemented an auction mechanism where traders bid on these opportunities. The winning bids are distributed to validators and then stakers. This is a second source of rewards for JitoSOL holders.

**Q: Why do my MEV rewards vary so much between periods?**

MEV rewards naturally fluctuate based on market activity:
- **High volatility periods** = more arbitrage opportunities = higher MEV
- **Busy DeFi days** = more liquidations and trades = higher MEV  
- **Quiet markets** = fewer opportunities = lower MEV

**Q: Can my JitoSOL ever lose value compared to SOL?**

Under normal conditions, no. JitoSOL is designed to appreciate against SOL as rewards accumulate. The only theoretical scenarios for value loss would be extreme events like massive validator slashing (which currently doesn't exist on Solana) or critical smart contract bugs.

## Fees

#### Q: What fees does JitoSOL collect?

JitoSOL charges an annual management equal to 4% of total rewards. This fee is applied to staking rewards and MEV revenue after validator commissions. This charge equals approximately ~0.3% of deposited SOL's value per year or 30 cents on every $100 in deposits.

JitoSOL also collects a fee of 0.1% on withdrawal value. This fee only applies if users directly unstake via the website. The charge is unfortunately required to prevent certain abuses in the protocol design. We suggest users sell their JitoSOL on [Jupiter](https://jup.ag/) to receive instant liquidity and avoid any withdrawal fees.

#### Q: Are there other fees? What about validators?

JitoSOL deposits the SOL with a carefully selected group of validators. These validators charge fees to fund their operations. Jito maintains its rewards by excluding validators with high fees or poor performance. Jito's fees are calculated after the direct validator commissions are already charged.

## Validators and Security

**Q: How does Jito choose which validators to stake with?**

Jito uses an automated system called **StakeNet** that selects the top 200 validators based on performance, fees, and reliability. The system checks things like:
- Low commission rates (under 5%)
- Good voting performance (over 85% of expected votes)
- Running Jito's MEV software
- Not being too large (to help decentralization)

This happens automatically every ~20-30 days with no human intervention, ensuring your stake always goes to high-performing validators.

## Security

#### Q: Is JitoSOL audited and safe?

JitoSOL is built on the stake pool program developed by Solana Labs. The program has been supporting numerous implementations since the network launched and three firms have completed audits ([reports](https://spl.solana.com/stake-pool#security-audits)). Security is assured with this proven implementation and JitoSOL's non-custodial nature.

**Q: Does Jito control my SOL?**

JitoSOL is non-custodial and holders always maintain control over their SOL.

## Interceptor and Stake Accounts

**Q: I deposited a stake account for JitoSOL but now it's "stuck" in the Interceptor. What's happening?**

Don't worry! This is normal and automatic. When you deposit an existing stake account (not regular SOL), the **Interceptor program** holds your JitoSOL for 10 hours as protection against abuse, then automatically delivers it to your wallet with no fees.

**What you need to know:**
- **You don't need to do anything** - Jito automatically handles delivery after 10 hours
- **You're earning full rewards** during the entire cooldown period
- **No fees for waiting** - automatic delivery is completely free
- **Check status at** [jito.network/interceptor](https://www.jito.network/interceptor/) if curious

This only happens with stake account deposits. Regular SOL staking gives you JitoSOL instantly.

**Q: Why does Interceptor only apply to stake accounts and not regular SOL?**

Interceptor prevents issues where other protocols exploit JitoSOL's liquidity. Stake account deposits create specific risks that regular SOL deposits don't, so the 10-hour cooldown protects all JitoSOL holders by ensuring deposits are genuine rather than exploitative.
