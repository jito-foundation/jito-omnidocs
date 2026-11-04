---
title: Searchers
subtitle: What a preconfirmation gives a subscriber, and how to start consuming the stream.
---

# Preconfirmations for Searchers

A preconfirmation is a transaction that the current BAM leader has
**committed to executing**, in a known order, published before the leader
shreds the block. Subscribers see what the rest of the slot is building on
earlier than any shred-based feed. Early testing with distribution partners
measured a **p50 advantage of 5–10ms** over their existing shred streams.

## What you get

Each update carries one committed transaction:

- the leader **slot** and the serialized **transaction**;
- the batch it was scheduled in (`sequence_id`) and its position within that
  batch (`bundle_position`);
- whether the batch is all-or-nothing (`is_revert_on_error`);
- optionally, whether the transaction executed successfully
  (`execution_success`), when that is known.

## What it is, and what it is not

- **A commitment, not a prediction.** A transaction appears only after the
  leader has committed to executing the batch that contains it. Pending work
  that has not yet been scheduled is never streamed.
- **Not finality.** The leader can still skip its slot or land on a fork. A
  preconfirmation says what will execute *if* the block lands.
- **No reordering.** Seeing a transaction early tells you what the slot is
  building on; it does not let anyone reorder or front-run that transaction
  within its batch.
- **BAM leaders only.** Non-BAM leaders, and BAM validators that have opted
  out, produce no preconfirmations. The
  [BAM explorer](https://bam.dev/explorer/) shows the current share of
  network stake running BAM.

## How to start consuming preconfirmations

Access is through Jito's distribution partners, who handle pricing, billing,
onboarding and support. You do not need an account with Jito, and Jito does
not sell the stream directly.

- **Helius:** [pre-confirmations documentation](https://www.helius.dev/docs/pre-confirmations/overview)
- **Triton:** [customer onboarding](https://customers.triton.one/onboarding/)

## Wire format

The stream is a server-streaming gRPC service. Its protobuf definition is
public in
[`preconf/preconf.proto`](https://github.com/jito-foundation/bam-plugins/blob/master/preconf/preconf.proto):

```protobuf
service PreconfStream {
  rpc Subscribe(PreconfSubscribeRequest) returns (stream PreconfUpdate);
}

message PreconfSubscribeRequest {
  uint64 slot = 1;
  bytes signature = 2;
}

message PreconfUpdate {
  uint64 slot = 1;
  uint32 sequence_id = 2;
  uint32 bundle_position = 3;
  bool is_revert_on_error = 4;
  bytes transaction = 5;
  optional bool execution_success = 6;
}
```

Your distribution partner documents how to connect and authenticate to their
endpoint.
