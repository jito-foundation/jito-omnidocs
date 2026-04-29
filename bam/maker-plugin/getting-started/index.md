---
title: Getting started
subtitle: Integration and onboarding path for market maker teams.
section_type: page
order: 22
---

# Getting started

## Getting Enrolled

Enrollment is configured by the BAM node operator before the node starts. Provide the following details:

| Field | What to provide |
| --- | --- |
| Signing pubkey | The pubkey of the keypair your transactions will be signed with (up to 32) |
| Program ID | The Solana program your market update instruction targets |
| Market account | The writable market account pubkey your transactions update (up to 64) |
| Seqno offset | Byte offset within your instruction data where the u64 sequence number begins |
| Seqno length | Must be 8 (u64 = 8 bytes) |
| Account filter | Optional additional account used to disambiguate markets |

If you would like to get enrolled, please fill out this [form](https://forms.gle/b4eTh2tD97rTnA2x9).

---

## Transaction Format

### Canonical structure

```
Transaction {
    signers: [ <enrolled_signing_keypair> ],
    instructions: [
        SetComputeUnitLimit { units: <your_cu_limit> },
        SetComputeUnitPrice { micro_lamports: <>= operator_minimum> },
        MarketUpdateInstruction {
            program: <enrolled_program_id>,
            data: [
                <...prefix bytes...>,
                <seqno as u64 little-endian at configured offset>,
                <...suffix bytes...>
            ],
            accounts: [
                { pubkey: <enrolled_signer>,  signer: true,  writable: false },
                { pubkey: <market_account>,   signer: false, writable: true  },
                ...
            ]
        }
    ]
}
```

### Sending protocol

Send raw wire-format Solana transactions as **UDP datagrams** to the PTPU socket.

| Parameter | Value |
| --- | --- |
| Protocol | UDP (raw datagrams, no framing) |
| Encoding | Standard Solana wire format |
| Port | **5012** (default — confirm with operator) |

There is no connection handshake. Send and forget. Retransmitting the same packet within the 370ms deduplication window is safe — duplicates are filtered at no cost. For a newer update, send a new transaction with a higher seqno rather than retransmitting.

### Blockhash

Refresh your blockhash every 30–60 seconds via `getLatestBlockhash` (the Solana JSON-RPC method for fetching a fresh blockhash). Transactions that fail the age check are dropped silently during buffering.

---

## Seqno Strategy

The seqno determines which update survives coalescing within a batch. Rules:

- **Always increase seqno for newer data.** The buffer keeps only the highest seqno per market. A lower seqno than one already buffered will be dropped.
- **Per-market counters.** Coalescing is independent per market.
- **No gap requirement.** Any monotonically increasing scheme works (increment by 1, by microseconds, etc.).
- **Globally monotonic.** The highest seen seqno persists across auction cycles; use a source that is monotonic over the full process lifetime.

**Recommended:** Unix timestamp in microseconds (`u64`).
