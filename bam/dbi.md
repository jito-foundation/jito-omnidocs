---
title: DBI
subtitle: Direct Bundle Ingest — send bundles straight to a BAM Node over JSON-RPC or QUIC.
---

# BAM Direct Bundle Ingest (DBI)

BAM Direct Bundle Ingest (DBI) lets an approved searcher or application send
bundles straight to a BAM Node over JSON-RPC or QUIC, without routing through
the Block Engine. Access is allowlisted.

## Who it is for

DBI is allowlisted, and in this early phase of the rollout new users are
added gradually. Apply with the
[DBI access form](https://form.typeform.com/to/tQDIpkYh). Approvals aren't
immediate; Jito will contact you when your key is ready, so you don't need to
follow up in a new ticket. **A Block Engine UUID or gRPC key does not grant
DBI access.** DBI credentials are issued separately.

You do not need DBI to reach BAM leaders. Bundles sent to the Block Engine
from an approved key for a BAM leader are forwarded to the BAM Node. DBI
removes the Block Engine hop for senders who want the shortest path to BAM
leader slots.

## Transports

| | JSON-RPC | QUIC |
|---|---|---|
| Endpoint | `http://<region>.mainnet.bam.jito.wtf:9090/api/v1/bundles` | `<region>.mainnet.bam.jito.wtf:11228` |
| Request | Standard `sendBundle` with `{"encoding": "base64"}` | One bundle per unidirectional stream, ALPN `solana-tpu` |
| Credential | Jito-issued UUID in the `x-jito-auth` header | Jito-allowlisted Ed25519 keypair |
| Response | A bundle ID (32 bytes, base64) | A stream acknowledgment only, no bundle ID |

- **The two credentials are separate.** A JSON-RPC UUID cannot authenticate
  QUIC, and a QUIC keypair cannot authenticate JSON-RPC. A JSON-RPC request
  without a valid UUID is answered with HTTP 401.
- New or changed access can take up to 80 seconds to reach every BAM node.
- For QUIC, use a dedicated keypair. It needs no SOL and should be neither
  your fee payer nor a trading wallet. Share only its public key with Jito.
- `<region>` is a BAM region code; see
  [Choose Your Region](https://bam.dev/validators/#choose-region).

### QUIC connection closed with code 2

A QUIC connection closed with application error code 2 means the keypair is
not allowlisted, or its access has not been activated yet. If you have just
been approved, reconnect after activation (allow up to 80 seconds). The same
close code is also used when connections from one IP arrive too fast, so
reconnect with backoff rather than in a tight loop.

## Rate limits

DBI keys have their own rate limit, applied separately at each BAM node, so
sending to several nodes doesn't share one budget. Requests over the limit get
HTTP 429 on JSON-RPC; on QUIC, excess packets are dropped. Your limit is set
when your key is issued.

## Tips and fees

DBI does not enforce a minimum tip or priority fee. BAM ranks bundles by
reward per compute unit (tips plus priority fees), so a bundle that pays
neither has nothing to win the auction with, and in practice will not land
when there is competition.

## What happens to a DBI bundle

1. You submit one to five fully signed transactions, in bundle order.
2. The BAM Node verifies the signature on every transaction.
3. The bundle is simulated. Only bundles in which every transaction succeeds
   move forward.
4. Survivors enter BAM's auction and are ranked by total fees (priority fees
   and Jito tips) over compute units, the same ordering signal as other BAM
   work.
5. Winners go to the current BAM leader as one atomic batch. If any
   transaction fails at execution, the whole bundle reverts.

You keep the usual bundle properties: pre-execution privacy, revert
protection, and all-or-nothing execution.

## Transaction versions

Both transports accept legacy, v0 and v1 (SIMD-0385) transactions, and one
bundle may mix them. The node reads each transaction's version from its bytes;
there is no request option for version or size.

| | Legacy / v0 | v1 (SIMD-0385) |
|---|---|---|
| Max serialized size | 1,232 bytes | 4,096 bytes |
| First wire byte | Signature count | `0x81` |
| Address lookup tables | v0 only | Not supported |
| Max accounts / instructions / signatures | Bounded by size | 64 / 64 / 12 |
| Compute budget settings | `ComputeBudget` instructions | Message header |

For v1 transactions:

- Set both the compute-unit limit and the loaded-accounts-data-size limit in
  the message header. Unset means 0.
- The priority fee is a total in lamports, not micro-lamports per compute
  unit. BAM ranks the transaction on it together with the compute-unit limit.
- List every account statically, because v1 has no address lookup tables.
- v1 transactions land only where the `enable_tx_v1` feature is active. On
  mainnet it has been active since slot 447,120,000 (epoch 1035). BAM accepts
  v1 regardless, so on a cluster without the feature a v1 bundle is
  acknowledged but will not land.

## Checking the outcome

A JSON-RPC bundle ID means the node accepted the request into its ingress
queue. A QUIC acknowledgment means the allowlisted connection was set up and
the bundle frame was written without the node stopping the stream. Neither
means the bundle was selected or landed.

The bundle explorer and its API do not show bundles submitted through DBI.
DBI and the Block Engine also derive bundle IDs differently, so a DBI bundle ID
will not match any Block Engine record. Confirm landing with
`getSignatureStatuses` on your own RPC, using your transaction signatures.

## When DBI is unavailable

DBI serves BAM leader slots only, and it pauses while BAM Nodes are in
Maintenance Mode. Block Engine bundles keep flowing during maintenance. Keep
the Block Engine path wired up as your fallback: it serves both BAM and
non-BAM leaders.

## Reference clients

[jito-labs/bam-dbi](https://github.com/jito-labs/bam-dbi) has Rust clients for
both transports, including the QUIC frame format, with signed-transfer
examples for legacy, v0 and v1 transactions and mixed bundles.
