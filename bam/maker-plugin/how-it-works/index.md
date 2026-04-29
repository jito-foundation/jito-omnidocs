---
title: How it works
subtitle: Batch scheduling model and maker-specific execution behavior.
section_type: page
order: 21
---

# BAM Maker Priority Plugin (v0)

BAM's maker priority plugin adds a dedicated, priority transaction ingress path for enrolled market makers. It provides top-of-batch scheduling for market maker transactions without interfering with standard transaction or bundle handling.

## How it works

The maker priority plugin introduces a **Plugin TPU (PTPU)** — a separate UDP endpoint that accepts pre-signed market maker price update transactions. These transactions are:

- **Validated** against a static enrollment config (signer, program, market, seqno format)
- **Coalesced** so only the highest-sequence-number update per market per auction round reaches the validator
- **Scheduled first** in every auction batch, ahead of all bundles and regular transactions

Maker Priority Plugin transactions follow a completely separate ingestion path from all other traffic, land in a dedicated scheduling buffer, and drain in the first phase of every auction. This guarantees that validator blocks begin each batch with the maker's most recent market state applied.

| Role | Effect |
| --- | --- |
| **Market Maker (MM)** | Submits price updates via the PTPU. Must be enrolled by the BAM node operator. Transactions are prioritized at the top of the subsequent batch. |
| **BAM Node Operator** | Manages static enrollment (signer pubkeys, programs, markets, seqno byte offsets, fee floors). The plugin is inactive if no enrollment is configured. |

---

## Scheduling Logic

Every auction round (~50 ms), BAM assembles a batch of transactions for the validator in two sequential phases:

Phase 1 drains all maker priority plugin transactions received during the previously scheduled round and schedules the latest update per enrollee per market at the top of the batch before Phase 2 begins. This ordering is structural and cannot be changed by paying higher fees or tips. Within Phase 2, bundles and regular transactions compete on the same priority score under the same scheduling logic.

---

## Key Properties

**Priority without fee competition.** Maker transactions are scheduled before bundles and regular transactions. No tip or priority fee can move other transactions ahead of them within the same batch.

**Nonce coalescing.** Only the most recent update per market per batch executes. The maker can send transactions to the Plugin TPU, and the system schedules the latest update per market per cycle (the freshest one). Stale updates or a duplicate that hit the normal TPU are dropped.

**Static enrollment.** There is no runtime registration API. All authorized signers and markets are configured in each BAM node. This keeps the validation path fast and secure.

**Transparent to non-makers.** Regular transaction senders and bundle submitters observe maker updates as already-committed state.

**Separate failure domain.** The PTPU is isolated from the standard TPU. A malformed or invalid maker packet cannot disrupt normal transaction ingestion.

**No Jito tip required.** Maker plugin transactions are standard Solana transactions paying compute unit fees. They do not require tips to Jito tip PDAs.

---

## Validation Requirements

Every packet arriving at the PTPU must pass all of the following checks or it is silently discarded:

| Check | Requirement |
| --- | --- |
| Exactly one signer | Multi-sig transactions are rejected |
| Enrolled signer | The signing keypair must be pre-registered with the node operator |
| Enrolled market account | The transaction must write to a market account registered for that signer |
| Allowed programs only | Only the enrolled market program, Compute Budget program, and System program are permitted. Any other program causes rejection. |
| Compute unit price floor | Must meet or exceed the minimum configured by the operator |
| Sequence number (seqno) | An 8-byte little-endian u64 must be present at the configured byte offset in the instruction data |

---

## Nonce Coalescing

Validated maker transactions are held in a dedicated buffer, separate from the regular transaction and bundle containers. When a new maker transaction arrives for a given market:

- If a higher seqno for the same market has already been buffered, the new entry is marked stale immediately.
- At scheduling time (each auction round tick), stale entries are dropped.

The result: no matter how many updates a maker sends within one auction round, **only one update per market reaches the validator. Because only the latest one is scheduled, the plugin is to always forward the freshest update.**
