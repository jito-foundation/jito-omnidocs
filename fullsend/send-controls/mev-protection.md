---
title: MEV Protection API
---

Use these endpoints to manage your customer-specific MEV blacklist and inspect the default blacklist.

Both lists are applied to `sendTransaction` requests by default.
Set `mev_protection_default=false` and/or `mev_protection_custom=false` on the send URL only when you want to disable one.


## Auth

Customer-list endpoints require `api_key`.

```text
?api_key=<YOUR_API_KEY>
```

## Add to Custom MEV Blacklist

- Endpoint: `POST /mev-protection/custom-blacklist`
- Auth: required

Request:

```http
POST /mev-protection/custom-blacklist?api_key=<YOUR_API_KEY>
Content-Type: application/json

{
  "validator_vote_accounts": [
    "<vote_account_pubkey_1>",
    "<vote_account_pubkey_2>"
  ]
}
```

Response:

```json
{
  "success": true,
  "inserted": ["<vote_account_pubkey_1>"],
  "already_present": ["<vote_account_pubkey_2>"],
  "message": "Inserted 1 of 2 pubkeys (1 already present)"
}
```

## Remove from Custom MEV Blacklist

- Endpoint: `DELETE /mev-protection/custom-blacklist`
- Auth: required

Request:

```http
DELETE /mev-protection/custom-blacklist?api_key=<YOUR_API_KEY>
Content-Type: application/json

{
  "validator_vote_accounts": [
    "<vote_account_pubkey_1>",
    "<vote_account_pubkey_2>"
  ]
}
```

Response:

```json
{
  "success": true,
  "removed": ["<vote_account_pubkey_1>"],
  "not_present": ["<vote_account_pubkey_2>"],
  "message": "Removed 1 pubkeys (1 were not present)"
}
```

## Get Custom MEV Blacklist

- Endpoint: `GET /mev-protection/custom-blacklist`
- Auth: required

Request:

```http
GET /mev-protection/custom-blacklist?api_key=<YOUR_API_KEY>
```

Response:

```json
{
  "success": true,
  "validator_vote_accounts": ["<vote_account_pubkey_1>", "<vote_account_pubkey_2>"]
}
```

## Get Default MEV Blacklist

- Endpoint: `GET /mev-protection/default-blacklist`
- Auth: required

Request:

```http
GET /mev-protection/default-blacklist?api_key=<YOUR_API_KEY>
```

Response:

```json
{
  "success": true,
  "validator_vote_accounts": []
}
```
