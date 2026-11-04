---
title: Getting started
subtitle: Integration and onboarding path for market maker teams.
---

# Getting started

## Getting Enrolled

Jito manages enrollment; there is no self-serve registration API. For each market, provide:

| Field | What to provide |
| --- | --- |
| Signing pubkey | The pubkey of the keypair your transactions will be signed with (up to 64 per program) |
| Program ID | The Solana program your market update instruction targets |
| Market account | The writable market account pubkey your transactions update (up to 256 per program) |
| Update mode | `single_market` (one market per transaction) or `multi_market` (one instruction updates several markets) |
| Seqno offset | Byte offset within your instruction data where the u64 sequence number begins |
| Seqno length | `8` for a u64 or `4` for a u32, little-endian |
| Seqno indexed from end | Optional: read the offset backwards from the end of the instruction data |
| Seqno XOR mask | Optional: a mask XOR'd against the decoded value |
| Account filter | Optional additional account used to disambiguate markets |

If you would like to get enrolled, please fill out this [form](https://forms.gle/b4eTh2tD97rTnA2x9).

### Am I enrolled?

Every BAM node publishes its live enrollment config, including each enrolled program's signers, markets, seqno layout and the current CU-price floor (`minimum_maker_lamports`, in lamports per CU):

```sh
curl -sS http://fra.mainnet.bam.jito.wtf:9090/api/v1/mpp/config
```

### Checking a transaction before you send it

Packets that fail validation are silently discarded. To find out why, run a transaction through the same validation path:

```sh
curl -X POST http://<region>.mainnet.bam.jito.wtf:9090/api/v1/mpp/simulate \
  -H 'content-type: application/json' \
  -d '{"transaction":"<base64-encoded VersionedTransaction>"}'
```

An accepted transaction returns `{"status": "valid", "seqno": "..."}` with the seqno the node extracted; a rejected one returns `{"status": "invalid", "error": "..."}`. It does not execute the transaction or check its signature.

---

## Transaction Format

### Canonical structure

```
Transaction {
    signers: [ <enrolled_signing_keypair> ],
    instructions: [
        SetComputeUnitLimit { units: <your_cu_limit> },
        SetComputeUnitPrice { micro_lamports: >= 1_000_000 },   // 1 lamport/CU floor
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
| Port | **5012** |
| Mainnet hosts | `ams` `dfw` `dub` `ewr` `fra` `iad` `lax` `lon` `pit` `sea` `sin` `slc` `sqq` `tyo`, each as `<code>.mainnet.bam.jito.wtf` |
| Testnet hosts | `dfw` `ewr` `fra` `slc`, each as `<code>.testnet.bam.jito.wtf` |

Not every BAM region runs the PTPU. Jito recommends sending to every listed region, which needs no leader-tracking logic. Node IPs can change on failover, so re-resolve the DNS names regularly rather than pinning IPs. [jito-labs/mpp-sender](https://github.com/jito-labs/mpp-sender) is a working Rust example that targets upcoming BAM leaders instead.

There is no connection handshake. Send and forget. Retransmitting the same packet within the 370ms deduplication window is safe — duplicates are filtered at no cost. For a newer update, send a new transaction with a higher seqno rather than retransmitting.

### Blockhash

Refresh your blockhash with `getLatestBlockhash` well inside its 150-slot validity window, which is about 30 seconds at today's 200 ms slots. Transactions that fail the age check are dropped silently during buffering.

---

## Seqno Strategy

The seqno determines which update survives coalescing within a batch. Rules:

- **Always increase seqno for newer data.** The buffer keeps only the highest seqno per market. A lower seqno than one already buffered will be dropped.
- **Per-market coalescing.** Coalescing is independent per market account, so one counter that rises over time works for every market.
- **No gap requirement.** Any monotonically increasing scheme works (increment by 1, by microseconds, etc.).
- **Globally monotonic.** The highest seen seqno persists across auction cycles; use a source that is monotonic over the full process lifetime.

**Recommended:** Unix timestamp in microseconds (`u64`, 8-byte width).
