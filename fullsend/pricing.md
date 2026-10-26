---
title: Pricing
subtitle: Per-transaction tips by TPS rate limit
---

Every FullSend transaction must include a tip payment to one of the FullSend tip addresses. The amount depends on your TPS rate limit. For example, if your rate limit is 5 TPS, you must pay 1M lamports per transaction. If your rate limit is 25 TPS, you must pay 10k lamports per transaction. Otherwise, your transaction will get dropped.

| **TPS** | **Tip (lamports)** | **Tip (SOL)** |
|---:|---:|---:|
| 5 | 1,000,000 | 0.001 |
| 10 | 100,000 | 0.0001 |
| 25 | 10,000 | 0.00001 |

Tip payments use the standard Solana system transfer instruction and are conditional upon successful execution. If the transaction fails, the tip is not transferred.

## Tip Addresses

We will provide the tip addresses upon access.

## Gain Access

To gain access to FullSend, please complete this [form](https://form.typeform.com/to/Sbp2rwtT) and the team will reach out shortly.
