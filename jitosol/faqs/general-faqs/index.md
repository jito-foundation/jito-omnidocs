---
title: General FAQs
subtitle: This page is being continuously developed. If your question is not
  listed, please ask in Jito's Discord so we know to add it here.
section_type: page
order: 0
---


## Staking and Unstaking

#### Q: How long does unstaking stake?

Users choosing to unstake via the jito.network interface must wait 1-2 epochs (2-5 days) to receive their SOL. This delay is attributable to Solana's underlying design and applies to any staking platform. We suggest users sell their JitoSOL on [Jupiter](https://jup.ag/) to receive instant liquidity and avoid any withdrawal fees. See our detailed article on [unstaking](/jitosol/get-started/unstaking-jitosol/unstaking-overview).

For large transactions, double check the slippage on Jupiter. The Jito website will always provide direct unstaking with no slippage except for the 10bps fee and 1-2 epoch waiting period.

**Q: How long does staking take?**

Depositors will receive JitoSOL instantly after staking on the Jito website and it begins accruing yield immediately. Here is our step-by-step [staking guide](/jitosol/get-started/stake-sol-for-jitosol/overview).

## Yield

**Q: How do I collect my yield?**

The token’s yield accrues in its price rather than an ongoing distribution. At launch, 1 JitoSOL = 1 SOL. As rewards are accrued, JitoSOL will appreciate vs. SOL (e.g. 1.05 SOL per JitoSOL). The price appreciation guarantees all JitoSOL holders receive yield regardless of how the token is stored.

**Q: What are staking rewards?**

Validators receive new Solana issuance in return for voting on new blocks as they are issued. This issuance (or inflation) is distributed every epoch (1-2 days). Validators pass this onto their stakers less some commission. Further [reading](https://docs.solana.com/implemented-proposals/ed_overview/ed_validation_client_economics/ed_vce_state_validation_protocol_based_rewards).

**Q: What are MEV rewards?**

MEV describes trading profits based on specific transaction ordering or timing. Jito's validator client implemented an auction mechanism where traders bid on these opportunities. The winning bids are distributed to validators and then stakers. This is a second source of rewards for JitoSOL holders.

## Fees

#### Q: What fees does JitoSOL collect?

JitoSOL charges an annual management equal to 4% of total rewards. This fee is applied to staking rewards and MEV revenue after validator commissions. This charge equals approximately ~0.3% of deposited SOL's value per year or 30 cents on every $100 in deposits.

JitoSOL also collects a fee of 0.1% on withdrawal value. This fee only applies if users directly unstake via the website. The charge is unfortunately required to prevent certain abuses in the protocol design. We suggest users sell their JitoSOL on [Jupiter](https://jup.ag/) to receive instant liquidity and avoid any withdrawal fees.

#### Q: Are there other fees? What about validators?

JitoSOL deposits the SOL with a carefully selected group of validators. These validators charge fees to fund their operations. Jito maintains its leading yield by excluding validators with high fees or poor performance. Jito's fees are calculated after the direct validator commissions are already charged.

## Security

#### Q: Is JitoSOL audited and safe?

JitoSOL is built on the stake pool program developed by Solana Labs. The program has been supporting numerous implementations since the network launched and three firms have completed audits ([reports](https://spl.solana.com/stake-pool#security-audits)). Security is assured with this proven implementation and JitoSOL’s non-custodial nature.

**Q: Does Jito control my SOL?**

JitoSOL is non-custodial and holders always maintain control over their SOL.

