---
title: Overview
subtitle: Low-latency, direct-to-leader Solana transaction sending
---

FullSend provides a Solana JSON-RPC compatible `sendTransaction` interface for low-latency SWQOS direct-to-leader sends with 100% land rates. It is designed to serve applications that want fast, reliable execution and control over who interacts, handles, or sees your transactions.

## Features and Benefits

- **Low-latency**: Direct-to-leader TPU transaction delivery
- **Easy adoption**: Solana-compatible sendTransaction API
- **Browser-optimized**: fast CORS-safe sending
- **Direct regional endpoints**: Send directly to servers in New York, Frankfurt, and Tokyo
- **Secure client side integration**: API-key and authorized-signer authentication
- **Greater control over MEV exposure**: Apply default and custom MEV-protection blacklists

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

## Gain Access

To gain access to FullSend, please complete this [form](https://form.typeform.com/to/Sbp2rwtT) and the team will reach out shortly.
