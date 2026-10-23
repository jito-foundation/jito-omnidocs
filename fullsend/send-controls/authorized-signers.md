---
title: Authorized Signers
subtitle: Submit from client-side apps without exposing your API key
---

Authorized signers are recommended when you need client-side transaction submission without exposing your API key.

## Why Use Authorized Signers

If you expose a raw service URL containing `api_key` in client code, the key can be extracted and your rate limit can be abused.

A safer pattern is:

1. Keep API key private on backend.
2. Have backend sign transactions as fee-payer.
3. Register those signer pubkeys as authorized signers.
4. Let client submit signed transactions without embedding API key.

Today, fallback auth for `sendTransaction` uses the first signer (fee payer). If you want to use this feature without signing as fee payer reach out and we can implement that.

## Authentication

All endpoints here require `api_key`.

```text
?api_key=<YOUR_API_KEY>
```

## Add Authorized Signers

- Endpoint: `POST /authorized-signers`

Request:

```http
POST /authorized-signers?api_key=<YOUR_API_KEY>
Content-Type: application/json

{
  "signers": [
    "<signer_pubkey_1>",
    "<signer_pubkey_2>"
  ]
}
```

Response:

```json
{
  "success": true,
  "inserted": ["<signer_pubkey_1>"],
  "already_present": ["<signer_pubkey_2>"],
  "message": "Inserted 1 of 2 signers (1 already present)"
}
```

## Remove Authorized Signers

- Endpoint: `DELETE /authorized-signers`

Request:

```http
DELETE /authorized-signers?api_key=<YOUR_API_KEY>
Content-Type: application/json

{
  "signers": [
    "<signer_pubkey_1>",
    "<signer_pubkey_2>"
  ]
}
```

Response:

```json
{
  "success": true,
  "removed": ["<signer_pubkey_1>"],
  "not_present": ["<signer_pubkey_2>"],
  "message": "Removed 1 signers (1 were not present)"
}
```

## Get Authorized Signers

- Endpoint: `GET /authorized-signers`

Request:

```http
GET /authorized-signers?api_key=<YOUR_API_KEY>
```

Response:

```json
{
  "success": true,
  "signers": ["<signer_pubkey_1>", "<signer_pubkey_2>"]
}
```
