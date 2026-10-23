---
title: Send from the Browser
subtitle: The sendTransactionWeb endpoint, built for browser clients
---

Low-latency, browser-optimized transaction submission. Eliminates CORS preflight overhead and JSON-RPC parsing by accepting raw base64 as `text/plain`, and returns CORS headers so browser code can read the response cross-origin.

## Why Use This Endpoint

Browser clients sending transactions via the standard JSON-RPC `sendTransaction` endpoint incur extra latency:

1. **CORS preflight** — `Content-Type: application/json` is not a [CORS-safelisted](https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header) content type, so browsers send an `OPTIONS` preflight request before every `POST`. That's an extra round trip on every transaction.
2. **JSON-RPC overhead** — encoding the transaction inside a JSON-RPC envelope and parsing the response adds unnecessary work for browser clients that just need to fire a transaction.

`sendTransactionWeb` removes both:

- Uses **`text/plain`** content type — a CORS simple request, so browsers skip the preflight entirely.
- Accepts the **raw base64-encoded transaction** as the body — no JSON-RPC wrapper needed.
- Returns **HTTP status codes** only — no response body to parse.
- Returns **`Access-Control-Allow-Origin: *`** on every response, so browser code can read the status directly.

## Endpoint

```text
POST /api/v1/sendTransactionWeb
```

## Authentication

This endpoint authenticates via [Authorized Signers](/fullsend/send-controls/authorized-signers). The fee payer (first signer) of the transaction must be registered as an authorized signer. No API key is passed in the request, which makes it safe to call directly from browser/mobile clients.

The authorized signer must map to an enabled API key with available rate limit capacity.

See [Setup](#setup) below for how to register your signer.

## Request Format

Send the **base64-encoded signed transaction** as the raw request body with `Content-Type: text/plain`.

```http
POST /api/v1/sendTransactionWeb?mev_protection_default=true
Content-Type: text/plain

<base64_encoded_transaction>
```

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `mev_protection_default` | bool | `true` | Enable default MEV protection blacklist |
| `mev_protection_custom` | bool | `true` | Enable your custom MEV protection blacklist |

## Response

Returns an HTTP status code with an empty body.

All responses include:

```http
Access-Control-Allow-Origin: *
```

That lets cross-origin browser code inspect `response.ok` and `response.status`.

| Status | Meaning |
|---|---|
| `200 OK` | Transaction queued successfully |
| `400 Bad Request` | Invalid body (empty, not valid UTF-8, base64 decode failure, transaction too large, or deserialization failure) |
| `401 Unauthorized` | Fee payer is not a registered authorized signer, or the backing API key is disabled |
| `429 Too Many Requests` | Backing API key is rate-limited |
| `500 Internal Server Error` | Failed to queue the transaction internally |

## TypeScript Example

```ts
import { VersionedTransaction } from "@solana/web3.js";

const ENDPOINT = "https://mainnet.hudson.jito.wtf/api/v1/sendTransactionWeb";

export async function sendTransactionWeb(
  signedTx: VersionedTransaction,
  mevProtectionDefault = true,
  mevProtectionCustom = true
): Promise<void> {
  const serialized = signedTx.serialize();
  const base64Tx = btoa(String.fromCharCode(...serialized));

  const url = new URL(ENDPOINT);
  url.searchParams.set("mev_protection_default", String(mevProtectionDefault));
  url.searchParams.set("mev_protection_custom", String(mevProtectionCustom));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: base64Tx,
  });

  if (!response.ok) {
    throw new Error(`sendTransactionWeb failed: ${response.status}`);
  }
}
```

## Connection Warm-Up

If you want to warm a connection before submitting a transaction, use [`GET /api/v1/ping`](/fullsend/sending-transactions/ping).

## Setup

Register your fee-payer pubkey as an authorized signer using the [Authorized Signers API](/fullsend/send-controls/authorized-signers). Once registered, your browser client can call `sendTransactionWeb` directly with no API key.

## Comparison with sendTransaction

| | `sendTransaction` | `sendTransactionWeb` |
|---|---|---|
| Optimized for | Server-side / general purpose | Browser clients |
| Content type | `application/json` (JSON-RPC) | `text/plain` (raw base64) |
| CORS preflight | Yes (`application/json` triggers preflight) | No for simple requests (`text/plain` body, no custom headers) |
| Response format | JSON-RPC envelope | HTTP status code only |
| Browser-readable cross-origin response | Not intended for direct browser use | Yes |
| Encoding | Base58 (default) or base64 | Base64 only |
| Auth | API key or authorized signer | Authorized signer only |
