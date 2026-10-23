---
title: Overview
subtitle: Low-latency, direct-to-leader Solana transaction sending
---

The Transaction Service provides a Solana JSON-RPC compatible `sendTransaction` interface for low-latency direct-to-leader sends with 100% land rates.

## Endpoint

- Base URL: `https://mainnet.hudson.jito.wtf`

Add your API key as a query parameter:

```text
https://mainnet.hudson.jito.wtf/?api_key=<YOUR_API_KEY>
```

Both MEV protection lists are enabled by default.
Only include query params in the URL if you want to turn one off:

```text
https://mainnet.hudson.jito.wtf/?api_key=<YOUR_API_KEY>&mev_protection_custom=false
```

Continue to [sendTransaction](/fullsend/sending-transactions/send-transaction) for integration examples.
