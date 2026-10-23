---
title: Regional Direct
---

Direct regional endpoints for server-to-server transaction submission.

**Requirements:**
- Your server IPs must be whitelisted (contact Jito)
- Server-side only — not for browser/web clients
- Self-signed TLS — disable certificate verification in your HTTP client

## Regional Endpoints

| Region | Endpoint |
|--------|----------|
| New York | `https://ewr1.mainnet.fullsend.jito.wtf:8443` |
| Frankfurt | `https://fra1.mainnet.fullsend.jito.wtf:8443` |
| Tokyo | `https://tyo1.mainnet.fullsend.jito.wtf:8443` |

## Request Format

POST to `/api/v1/sendTransaction` with JSON-RPC payload:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sendTransaction",
  "params": [
    "<base64_encoded_tx>",
    { "encoding": "base64" }
  ]
}
```

## Rust Example

Build your own HTTP client with TLS verification disabled:

```rust
use anyhow::{anyhow, Result};
use reqwest::Client;
use serde_json::{json, Value};
use solana_sdk::signature::Signature;
use solana_sdk::transaction::VersionedTransaction;
use std::str::FromStr;
use std::time::Duration;

const TIMEOUT_MS: u64 = 1_000;

const ENDPOINTS: &[&str] = &[
    "https://ewr1.mainnet.fullsend.jito.wtf:8443",
    "https://fra1.mainnet.fullsend.jito.wtf:8443",
    "https://tyo1.mainnet.fullsend.jito.wtf:8443",
];

fn build_client() -> Result<Client> {
    Client::builder()
        .danger_accept_invalid_certs(true)
        .timeout(Duration::from_millis(TIMEOUT_MS))
        .build()
        .map_err(|e| anyhow!("Failed to build client: {e}"))
}

async fn send_transaction(
    client: &Client,
    endpoint: &str,
    tx: &VersionedTransaction,
) -> Result<Signature> {
    let tx_bytes = bincode::serialize(tx)?;
    let tx_base64 = base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        &tx_bytes,
    );

    let request = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sendTransaction",
        "params": [tx_base64, { "encoding": "base64" }]
    });

    let url = format!("{endpoint}/api/v1/sendTransaction");
    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await?;

    let body: Value = response.json().await?;

    if let Some(error) = body.get("error") {
        return Err(anyhow!("JSON-RPC error: {error}"));
    }

    let sig = body
        .get("result")
        .and_then(|v| v.as_str())
        .ok_or_else(|| anyhow!("Missing result in response"))?;

    Signature::from_str(sig).map_err(|e| anyhow!("Invalid signature: {e}"))
}

/// Send with failover to next region on timeout/error
async fn send_with_failover(
    client: &Client,
    tx: &VersionedTransaction,
) -> Result<Signature> {
    for endpoint in ENDPOINTS {
        match send_transaction(client, endpoint, tx).await {
            Ok(sig) => return Ok(sig),
            Err(e) => eprintln!("Failed {endpoint}: {e}"),
        }
    }
    Err(anyhow!("All regional endpoints failed"))
}
```

## Failover Strategy

The client must manage failover manually:

1. Set an aggressive timeout (1000ms recommended)
2. On timeout or error, retry with the next closest regional endpoint
3. Order endpoints by proximity to your server location

Example ordering for a US-East server:
1. `ewr1` (New York) — primary
2. `fra1` (Frankfurt) — fallback
3. `tyo1` (Tokyo) — last resort
