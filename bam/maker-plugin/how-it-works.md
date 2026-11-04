---
title: How it works
subtitle: Batch scheduling model and maker-specific execution behavior.
---
# BAM Maker Priority Plugin (v0)

BAM's maker priority plugin adds a dedicated, priority transaction ingress path for enrolled market makers. It provides top-of-batch scheduling for market maker transactions without interfering with standard transaction or bundle handling.

## How it works

The maker priority plugin introduces a **Plugin TPU (PTPU)** — a separate UDP endpoint that accepts pre-signed market maker price update transactions. These transactions are:

- **Validated** against the node's enrollment config (signer, program, market, seqno format)
- **Coalesced** so only the newest update per market account per auction round reaches the validator
- **Scheduled first** in every auction batch, ahead of all bundles and regular transactions

Maker Priority Plugin transactions follow a completely separate ingestion path from all other traffic, land in a dedicated scheduling buffer, and drain in the first phase of every auction. This guarantees that validator blocks begin each batch with the maker's most recent market state applied.

| Role | Effect |
| --- | --- |
| **Market Maker (MM)** | Submits price updates via the PTPU. Must be enrolled by Jito. Transactions are prioritized at the top of the subsequent batch. |
| **Jito** | Manages enrollment (signer pubkeys, programs, markets, seqno layout, CU-price floor) on each BAM node. Every node publishes its live enrollment config at `/api/v1/mpp/config`. |

---

## Scheduling Logic

Every auction round, BAM assembles a batch of transactions for the validator in two sequential phases. A round lasts a tenth of the cluster's slot time (50 ms for slots of 400 ms or more), which is **20 ms** at today's 200 ms slots.

Phase 1 drains all maker priority plugin transactions received during the previously scheduled round and schedules the surviving updates at the top of the batch in ascending sequence-number order before Phase 2 begins. This ordering is structural and cannot be changed by paying higher fees or tips. Within Phase 2, bundles and regular transactions compete on the same priority score under the same scheduling logic.

---

## Key Properties

**Priority without fee competition.** Maker transactions are scheduled before bundles and regular transactions. No tip or priority fee can move other transactions ahead of them within the same batch.

**Nonce coalescing.** Only the most recent update per market per batch executes. The maker can send transactions to the Plugin TPU, and the system schedules the latest update per market per cycle (the freshest one). Stale updates, and copies of a scheduled update that also arrive on the normal TPU, are dropped.

**Managed enrollment.** There is no self-serve registration API. Jito configures authorized signers and markets on each BAM node, and each node publishes the live set at `/api/v1/mpp/config`. This keeps the validation path fast and secure.

**Transparent to non-makers.** Regular transaction senders and bundle submitters observe maker updates as already-committed state.

**Separate failure domain.** The PTPU is isolated from the standard TPU. A malformed or invalid maker packet cannot disrupt normal transaction ingestion.

**No Jito tip required.** Maker plugin transactions are standard Solana transactions paying compute unit fees. They do not require tips to Jito tip PDAs, but they must meet a compute-unit price floor of **1 lamport per compute unit** (1,000,000 micro-lamports per CU), reported live as `minimum_maker_lamports`.

---

## Validation Requirements

Every packet arriving at the PTPU must pass all of the following checks or it is silently discarded:

| Check | Requirement |
| --- | --- |
| Exactly one signer | Multi-sig transactions are rejected |
| Enrolled signer | The signing keypair must be enrolled |
| Enrolled market account | The transaction must write to an enrolled market account, and may write only to enrolled market accounts (and the signer) |
| Allowed programs only | Only the enrolled market program, Compute Budget program, and System program are permitted. Any other program causes rejection. |
| Compute unit price floor | At least 1 lamport per compute unit (`minimum_maker_lamports`) |
| Sequence number (seqno) | A little-endian u64 (8 bytes) or u32 (4 bytes) must be present at the enrolled byte offset in the instruction data |

---

## Nonce Coalescing

Validated maker transactions are held in a dedicated buffer, separate from the regular transaction and bundle containers. When a new maker transaction arrives for a given market:

- A transaction is kept only if it carries the highest seqno seen so far for at least one of the market accounts it writes.
- At scheduling time (each auction round), stale entries are dropped and survivors are scheduled in ascending seqno order.

The result: no matter how many updates a maker sends within one auction round, **only one update per market reaches the validator. Because only the latest one is scheduled, the plugin always forwards the freshest update.**

A `multi_market` enrollment lets one instruction update several market accounts; the same per-account rule applies to each account it writes. Worked examples are in [multi-market-coalesce.md](https://github.com/jito-foundation/bam-plugins/blob/master/maker-priority/multi-market-coalesce.md).
