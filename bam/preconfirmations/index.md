---
title: Preconfirmations
subtitle: What preconfirmation streaming means for BAM validators, and how the revenue reaches you.
section_type: page
order: 25
---

# Preconfirmations

BAM Preconfirmations are live, distributed through Helius and Triton. If you run
a BAM client, your slots now earn from them. This page covers what that means
for validators; for the full picture, read
[BAM preconfirmations are live](https://bam.dev/blog/bam-preconfirmations-are-live/).

**The bottom line**

| | |
| --- | --- |
| Your share | 35% of total preconfirmation revenue |
| Revenue starts | October 2026 |
| Action needed | None |
| Paid as | Priority fees, on-chain |

If you run **AgaveBAM or FireBAM**, you are automatically opted in to streaming
preconfirmations to Jito's distribution partners, and you start monetizing them
immediately. There is nothing to configure and no new account to open.

## What you are actually selling

A preconfirmation is the stream of transactions the current BAM-enabled leader
has **committed to executing**, as scheduled by a BAM Node. It sits upstream of
shreds — the commit fires before those transactions are shredded and propagated
across the network.

That head start is the product. Early testing with distribution partners
measured a **p50 advantage of 5–10ms** over their existing shred streams, which
is what makes the stream worth paying for to arbitrage, liquidation and
market-making desks. Collectively, BAM validators covered **over 34% of network
stake** at launch (September 2026); the
[BAM explorer](https://bam.dev/explorer/) reports the current share.

It is not a prediction and not finality. A preconfirmation is emitted only after
your validator has received a scheduled batch and committed to executing it, so
the stream reflects what you have already agreed to execute, in that order. You
can still skip the slot or land on a fork — a preconfirmation says what will
execute if the block lands, not that the block will land.

## Where the money comes from, and how it reaches you

Distributors bill their own subscribers and pay the Jito DAO. Total revenue
splits three ways:

- **35%** — BAM validators
- **35%** — Jito DAO
- **30%** — Distributors

The validator 35% is shared across the whole network rather than paid to
whoever produced a given stream. The mechanics:

**Cadence** — Slot by slot, over the month following the distributors' payment
to the DAO.

**Instrument** — The connected BAM Node submits a transaction for the
[market-tick program](https://github.com/firedancer-io/market-tick), and for
opted-in leaders it attaches a priority fee to that transaction.

**Why it's fair** — Leader slots are already stake-weighted, so paying the same
amount per slot comes out stake-proportional without any extra weighting.

**What pays nothing** — Slots where you are not connected to BAM. Skipped and
disconnected slots earn nothing.

**How it lands** — As an on-chain block reward. The payout stays inside
Solana's in-protocol fee mechanism rather than arriving as an off-chain
transfer.

## Your obligation in exchange

Executing committed batches as scheduled is a **protocol obligation** for every
BAM validator — it is what makes the stream trustworthy enough to sell.

The [BAM Verifier](https://bam.dev/blog/the-bam-verifier-ensuring-verifiable-execution-on-solana/)
checks produced blocks against those commitments. A validator that deviates is
detected and can be disconnected from the network.

## How a preconfirmation reaches a subscriber

1. A BAM-enabled validator comes up on the leader schedule; the BAM Node
   receives orderflow and schedules it.
2. The BAM Node sends the scheduled transactions to the leader for execution.
3. The leader commits to executing them and sends a commit confirmation back to
   the BAM Node.
4. That confirmation triggers the BAM Node to stream the preconfirmation out to
   co-located distributors.
5. Distributors receive the preconfirmations and serve them to their
   subscribers.

## If you would rather not stream

- You can opt out and forgo the associated revenue. Nothing else about your BAM
  operation changes.
- **Self-serve opt-out is not available yet** — it is expected in a future BAM
  client release.
- To opt out today, open a ticket on the
  [Jito Developers Discord](https://discord.gg/jito) to be added manually to the
  opt-out list (see below).

## Questions and support

Open a ticket in the [Jito Developers Discord](https://discord.gg/jito)
[#open-ticket](https://discord.com/channels/938287290806042626/1336799632898134037)
channel and choose **Validator Support**. Pricing and subscriber access are
handled by the distributors, not by Jito.

- [Helius](https://www.helius.dev/docs/pre-confirmations/overview) — distribution
  partner, subscriber docs
- [Triton](https://customers.triton.one/onboarding/) — distribution partner,
  onboarding
