---
title: sendTransaction
---

The service accepts Solana JSON-RPC `sendTransaction` requests, so standard Solana RPC clients work with the service URL.

## Endpoint

Use either of these entrypoints:

- `POST /` (JSON-RPC dispatcher)
- `POST /api/v1/sendTransaction`

For most clients, set RPC URL to:

```text
https://mainnet.hudson.jito.wtf/?api_key=<YOUR_API_KEY>
```

Both the default MEV blacklist and your customer-specific MEV blacklist are enabled by default.
Only add `mev_protection_default=false` and/or `mev_protection_custom=false` if you want to disable one.


## Auth

Pass your API key as a query parameter on the RPC URL:

```text
https://mainnet.hudson.jito.wtf/?api_key=<YOUR_API_KEY>
```

If you need to expose the send URL from client-side apps (browser/mobile), use the [Authorized Signers API](/fullsend/send-controls/authorized-signers), or reach out to Jito for another auth model (for example IP allowlisting).

## Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sendTransaction",
  "params": [
    "<encoded_tx>",
    { "encoding": "base64", "minContextSlot": 123 }
  ]
}
```

- `params[0]`: required encoded signed transaction
- `params[1]`: optional send config

## Rust Example (`solana_client`)

```rust
use solana_client::rpc_client::RpcClient;
use solana_sdk::signature::Signature;
use solana_sdk::transaction::VersionedTransaction;

pub fn create_client(
    api_key: &str,
) -> RpcClient {
    let rpc_url = format!("https://mainnet.hudson.jito.wtf/?api_key={api_key}");
    RpcClient::new(rpc_url)
}

pub fn send_transaction(
    client: &RpcClient,
    tx: &VersionedTransaction,
) -> anyhow::Result<Signature> {
    // This "Jito send client" is just a normal Solana RPC client with the service URL.
    // Commitment/simulation/confirmation semantics are not provided by the service.
    // This endpoint accepts the signed tx and forwards it to leaders.
    Ok(client.send_transaction(tx)?)
}
```

## TypeScript Example (`@solana/web3.js`)

```ts
import { Connection, VersionedTransaction } from "@solana/web3.js";

export function createClient(
  apiKey: string
): Connection {
  const rpcUrl =
    `https://mainnet.hudson.jito.wtf/?api_key=${encodeURIComponent(apiKey)}`;
  return new Connection(rpcUrl, "confirmed");
}

export async function sendTransaction(
  client: Connection,
  signedTx: VersionedTransaction
): Promise<string> {
  // This "Jito send client" is just a normal Solana RPC client with the service URL.
  // Commitment/simulation/confirmation semantics are not provided by the service.
  // This endpoint accepts the signed tx and forwards it to leaders.
  return client.sendTransaction(signedTx, {
    skipPreflight: true,
    maxRetries: 0,
  });
}
```

## Send Controls

`sendTransaction` behavior can be controlled with:

- [MEV Protection API](/fullsend/send-controls/mev-protection): manage your custom blacklist and/or use the default blacklist.
- [Authorized Signers API](/fullsend/send-controls/authorized-signers): submit from client-side apps without exposing API keys.

## Compatibility Notes

The service is wire-compatible with Solana JSON-RPC `sendTransaction` request/response format.

Service behavior is intentionally focused on landing:

- Accepts your JSON-RPC encoded signed transaction and immediately forwards to current/upcoming leaders.
- Does not run transaction simulation.
- Does not provide confirmation tracking or commitment-level processing.
