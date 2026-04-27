---
title: How it works
subtitle: Batch scheduling model and maker-specific execution behavior.
section_type: page
order: 21
---

# How it works

The Maker Plugin is designed for market makers that need deterministic quote placement at sub-slot granularity.

## Scheduling Model

At the start of each 50ms BAM batch, eligible maker-plugin price update transactions are scheduled before general transaction flow. This gives market makers a predictable insertion point for quote refreshes during BAM slots.

## Replacement Behavior

Between two batch boundaries, BAM may receive multiple quote updates for the same market from the same integration path. The Maker Plugin keeps only the most recent eligible update per market and discards older updates before scheduling.

This means:

- stale quotes are not carried forward into the next batch,
- the most recent market view wins,
- batch capacity is reserved for fresh maker state rather than superseded updates.

## Validation Behavior

Transactions are validated before they enter the scheduling pipeline. Invalid submissions are dropped early and do not consume maker-plugin scheduling capacity.

## Deterministic Outcome

The practical result is a deterministic quote update phase at the top of each batch, followed by the normal BAM transaction flow for the rest of the batch.
