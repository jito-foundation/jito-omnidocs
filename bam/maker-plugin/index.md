---
title: Maker Plugin
subtitle: Deterministic quote scheduling for market makers during BAM slots.
section_type: expandable
order: 20
---

# Maker Plugin Overview

The BAM Maker Plugin enables market makers to submit price update transactions that are scheduled at the start of every batch. This enables sub-slot deterministic transaction processing for market makers, ensuring quotes are executed consistently and predictably with minimal latency during BAM slots.

## Key Features

- Price updates are scheduled at the top of each 50ms batch, ahead of general transaction flow.
- Only the most recent update per market is included. Stale quotes are automatically discarded.
- Transactions are validated before entering the pipeline, so invalid submissions are dropped early without consuming batch capacity.
- BAM automatically deduplicates updates received between batches, ensuring only the most recent quotes are scheduled via the maker plugin.

## In This Section

Use the pages in this section to understand how the maker path behaves, how to integrate, how access works, and what operational constraints apply.
