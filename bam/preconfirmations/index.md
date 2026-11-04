---
title: Preconfirmations
subtitle: The stream of transactions a BAM leader has committed to executing, published before shreds.
---

# Preconfirmations

BAM Preconfirmations are a stream of the transactions a BAM-connected leader
has committed to executing, published before those transactions are shredded
and propagated across the network. They are distributed through Helius and
Triton. For the launch announcement, read
[BAM preconfirmations are live](https://bam.dev/blog/bam-preconfirmations-are-live/).

- **Consuming the stream** (trading desks, searchers, apps):
  [Searchers](/bam/preconfirmations/searchers)
- **Running a BAM validator**: [Validators](/bam/preconfirmations/validators)

## What a preconfirmation is

When a BAM Node schedules a batch, it sends the batch to the leader. The
leader commits to executing it and sends a commit confirmation back to the
node. That confirmation is what triggers publication of the batch's
transactions on the preconfirmation stream. Because this happens before the
leader shreds the block, subscribers see the transactions further upstream
than any shred-based feed.

- **It is a commitment, not a prediction.** It reflects work the leader has
  already agreed to execute, in that order. Executing committed batches as
  scheduled is a protocol obligation for every BAM validator; the
  [BAM Verifier](https://bam.dev/blog/the-bam-verifier-ensuring-verifiable-execution-on-solana/)
  checks the resulting blocks against those commitments, and a validator that
  deviates can be disconnected.
- **It is not finality.** The leader can still skip its slot, or the block
  can land on a fork. A preconfirmation says what will execute *if* the block
  lands, not that it will land.
- **It only covers BAM leaders**, and only those that have not opted out.
  Non-BAM leaders produce no preconfirmations.

## How a preconfirmation reaches a subscriber

1. A BAM-enabled validator comes up on the leader schedule; the BAM Node
   receives orderflow and schedules it.
2. The BAM Node sends the scheduled transactions to the leader for execution.
3. The leader commits to executing them and sends a commit confirmation back
   to the BAM Node.
4. That confirmation triggers the BAM Node to stream the preconfirmation out
   to co-located distributors.
5. Distributors receive the preconfirmations and serve them to their
   subscribers.
