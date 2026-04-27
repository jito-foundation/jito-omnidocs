---
title: Authentication & Rate Limits
subtitle: Access control and operational constraints for Maker Plugin traffic.
section_type: page
order: 24
---

# Authentication & Rate Limits

Maker Plugin traffic is expected to be authenticated and subject to integration-specific controls.

## Current Status

Public authentication headers, credential format, and rate-limit policy are not finalized in this docs set yet.

## What Will Be Documented Here

When published, this page should define:

- the authentication mechanism required for Maker Plugin requests,
- credential issuance and rotation expectations,
- request-rate constraints,
- behavior on throttling or rejection,
- operational guidance for retries and backpressure.

## Integration Guidance For Now

Teams should assume that access-controlled submission and traffic-shaping requirements apply, and should confirm exact limits during onboarding rather than inferring them from other BAM interfaces.
