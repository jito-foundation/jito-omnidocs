---
title: Getting started
subtitle: Integration and onboarding path for market maker teams.
section_type: page
order: 22
---

# Getting started

Maker Plugin onboarding is intended for teams operating latency-sensitive quoting infrastructure on Solana.

## Recommended Integration Path

1. Review the [How it works](/docs/maker-plugin/how-it-works/) page so your team understands the batch-level scheduling model.
2. Request access through the [early access form](https://forms.gle/Expb5bZRxjrtUrRCA).
3. Coordinate onboarding details with the BAM team.
4. Validate your request format, update cadence, and operational handling before production rollout.

## What To Prepare

Before onboarding, teams should be ready to provide:

- the markets they plan to support,
- the systems that will generate quote updates,
- expected update frequency,
- an operational contact for launch coordination and incident response.

## Integration Notes

The Maker Plugin is designed around frequent quote-update submission. To integrate cleanly, your quoting system should assume:

- only the most recent eligible update per market is retained,
- invalid transactions are rejected before scheduling,
- update timing should align with the 50ms batch model rather than generic mempool assumptions.

## Environment-Specific Details

Exact integration requirements, submission format, and rollout sequencing may vary by onboarding cohort. Those details should be treated as part of the BAM onboarding process unless separately documented.
