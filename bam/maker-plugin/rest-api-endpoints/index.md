---
title: REST API endpoints
subtitle: Endpoint surface and integration notes.
section_type: page
order: 23
---

# REST API endpoints

Maker Plugin endpoint documentation will describe the request surface used to submit maker-plugin updates and related integration actions.

## Current Status

The public endpoint list is not finalized in this docs set yet.

## Placeholder API Definition

The example below is a placeholder wire shape for integration planning only. It is intended to show the kind of request and response structure teams should expect, not a finalized contract.

### Submit Quote Update

```http
POST /v1/maker-plugin/quotes
Authorization: Bearer <maker_api_key>
Content-Type: application/json
Idempotency-Key: 8c8f2a38-53c7-4d03-9d0d-a91de3e3ab12
```

```json
{
  "market": "SOL-PERP",
  "sequence": 128441,
  "client_timestamp_ms": 1776182400123,
  "quote": {
    "bid_price": "144.12",
    "bid_size": "25",
    "ask_price": "144.18",
    "ask_size": "20"
  },
  "metadata": {
    "source": "maker-primary",
    "strategy_id": "mm-sol-01"
  }
}
```

### Placeholder Success Response

```json
{
  "status": "accepted",
  "request_id": "req_01JX8J7X9K6M5P4Q3R2S1T0U",
  "market": "SOL-PERP",
  "sequence": 128441,
  "scheduled_batch": {
    "slot": 381245912,
    "batch_start_ms": 1776182400150
  }
}
```

### Placeholder Error Response

```json
{
  "status": "rejected",
  "request_id": "req_01JX8J7X9K6M5P4Q3R2S1T0U",
  "error": {
    "code": "INVALID_QUOTE",
    "message": "Quote update failed validation before scheduling."
  }
}
```

## Authentication Convention

The placeholder model assumes bearer-token authentication:

```http
Authorization: Bearer <maker_api_key>
```

Until the public auth model is finalized, treat the token format, issuance flow, and rotation policy as onboarding-provided details.

## Idempotency Convention

The placeholder model also assumes an idempotency key header so clients can safely retry submissions during transient network failures:

```http
Idempotency-Key: 8c8f2a38-53c7-4d03-9d0d-a91de3e3ab12
```

Expected placeholder behavior:

- repeated requests with the same idempotency key and identical payload should return the same logical result,
- changed payloads with the same idempotency key should be rejected,
- idempotency windows and retention duration are still TBD.

## Example cURL Request

```bash
curl -X POST "https://api.bam.dev/v1/maker-plugin/quotes" \
  -H "Authorization: Bearer <maker_api_key>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 8c8f2a38-53c7-4d03-9d0d-a91de3e3ab12" \
  -d '{
    "market": "SOL-PERP",
    "sequence": 128441,
    "client_timestamp_ms": 1776182400123,
    "quote": {
      "bid_price": "144.12",
      "bid_size": "25",
      "ask_price": "144.18",
      "ask_size": "20"
    },
    "metadata": {
      "source": "maker-primary",
      "strategy_id": "mm-sol-01"
    }
  }'
```

## Placeholder Error Codes

The placeholder error model below is illustrative only:

| Code | Meaning |
| --- | --- |
| `INVALID_QUOTE` | The submitted quote payload failed validation before scheduling. |
| `UNAUTHORIZED` | The provided API credential was missing, invalid, or expired. |
| `RATE_LIMITED` | The client exceeded an allowed request rate. |
| `STALE_SEQUENCE` | The update was superseded or too old to be accepted for scheduling. |
| `MARKET_NOT_ENABLED` | The requested market is not enabled for this maker integration. |
| `IDEMPOTENCY_CONFLICT` | The idempotency key was reused with a different payload. |

## What Will Be Documented Here

When available, this page should define:

- base URL and environment-specific hosts,
- endpoint paths,
- request and response schemas,
- success and error semantics,
- idempotency or replacement behavior where applicable.

## Implementation Guidance For Now

Do not assume generic BAM endpoints apply to Maker Plugin traffic. Treat endpoint and payload details as onboarding-provided until the public API surface is published.
