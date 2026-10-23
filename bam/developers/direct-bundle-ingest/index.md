---
title: "Jito BAM: Direct Bundle Ingest Testing"
subtitle: Submit ordered bundles straight to BAM over JSON-RPC or QUIC.
section_type: page
order: 31
hidden: true
---

# Jito BAM: Direct Bundle Ingest Testing

Use the direct BAM JSON-RPC and QUIC to submit an ordered bundle of signed Solana transactions.

## What this is

We are testing BAM's JSON-RPC and QUIC interface which lets searchers submit bundles directly to BAM, eliminating the Block Engine hop. Accepted bundles enter BAM's normal validation, auction, and validator-forwarding pipeline.

This is for **TESTING PURPOSES ONLY.** Please revisit our Terms of Service here: [Terms of Use](https://www.jito.wtf/terms-of-use/). If you have any questions, comments, or concerns, please reach out to us.

## Initial setup

### JSON-RPC

| Field | Value |
| ----- | ----- |
| Protocol | HTTP only. HTTPS is not currently supported. |
| Method | JSON-RPC `sendBundle` |
| Port | `9090` |
| Path | `/api/v1/bundles` |
| Authentication | UUID provided by Jito, sent as a bare `x-jito-auth` header value |
| Initial rate limit | 25 bundle submissions per second, per credential, per BAM node |

To get started, Jito will create and provide your UUID credential. You do not need to generate one yourself. New or changed access may take up to 80 seconds to reach every BAM node.

Active BAM regions are listed in the [BAM node explorer](/explorer/#nodes). Build the endpoint with the region code:

```
http://<region-code>.mainnet.bam.jito.wtf:9090/api/v1/bundles
```

For example, the New York (`ewr`) endpoint is:

```
http://ewr.mainnet.bam.jito.wtf:9090/api/v1/bundles
```

It is recommended to send bundles to all BAM node regions.

Useful discovery endpoints:

```
https://explorer.bam.dev/api/v1/validators
http://<region-code>.mainnet.bam.jito.wtf:9090/api/v1/validators
```

The explorer endpoint returns validators considered connected leaders and which BAM node they are connected to. The regional endpoint checks connected leaders for a specific BAM node in real time. For example:

```
http://ewr.mainnet.bam.jito.wtf:9090/api/v1/validators
```

### QUIC

| Field | Value |
| ----- | ----- |
| Protocol | QUIC over UDP |
| Port | `11228`, unless Jito provides a different port |
| Endpoint shape | `<region-code>.mainnet.bam.jito.wtf:11228` |
| Authentication | Ed25519 client certificate keypair allowlisted by Jito |
| ALPN | `solana-tpu` |
| Payload | One BAMB v0 frame per unidirectional QUIC stream |
| Initial rate limit | 25 bundle submissions per second, per QUIC credential, per BAM node |

For QUIC access, use a dedicated Ed25519 keypair for transport authentication. This keypair is not the transaction fee payer and does not need SOL. Do not reuse a trading wallet or fee-payer key as the QUIC authentication key.

Jito will register the public key you provide. If you generate the keypair, share only the public key with Jito. New or changed QUIC access may take up to 80 seconds to reach every BAM node.

Example New York (`ewr`) QUIC endpoint:

```
ewr.mainnet.bam.jito.wtf:11228
```

QUIC and HTTP credentials are separate credentials with separate rate limits. A UUID used for JSON-RPC does not authenticate QUIC, and a QUIC keypair does not authenticate JSON-RPC.

## Sending a bundle (JSON-RPC)

Submit one to five fully signed, serialized transactions as base64 strings. Send the UUID as a bare `x-jito-auth` value.

```shell
curl \
  'http://ewr.mainnet.bam.jito.wtf:9090/api/v1/bundles' \
  --header 'content-type: application/json' \
  --header 'x-jito-auth: <provided-uuid>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sendBundle",
    "params": [
      ["<base64-signed-transaction>"]
    ]
  }'
```

A successful request returns a bundle ID:

```json
{"jsonrpc":"2.0","id":1,"result":"<bundle-id>"}
```

This response confirms that BAM accepted the bundle into its ingress queue. It does not guarantee that the bundle will be selected or land on-chain. Confirm landing through the transaction signatures using normal Solana RPC.

Common HTTP responses:

| Response | Meaning |
| ----- | ----- |
| `401 Unauthorized` | The credential is missing or unknown. |
| `429 Too Many Requests` | The credential exceeded its bundle submissions per second limit. |
| `503 Service Unavailable` | The bundle access policy is temporarily unavailable. |

### JSON-RPC CLI example

The following example uses environment variables to avoid putting the credential directly in shell history. `SIGNED_TX_B64` must be a fully signed, serialized transaction encoded as base64.

```shell
export BAM_BUNDLE_URL='http://ewr.mainnet.bam.jito.wtf:9090/api/v1/bundles'
export JITO_AUTH_UUID='<provided-uuid>'
export SIGNED_TX_B64='<base64-signed-transaction>'

curl -sS "$BAM_BUNDLE_URL" \
  --header 'content-type: application/json' \
  --header "x-jito-auth: $JITO_AUTH_UUID" \
  --data "{
    \"jsonrpc\": \"2.0\",
    \"id\": 1,
    \"method\": \"sendBundle\",
    \"params\": [[\"$SIGNED_TX_B64\"]]
  }"
```

Example output:

```json
{"jsonrpc":"2.0","id":1,"result":"<bundle-id>"}
```

That output means BAM accepted the bundle into its ingress queue. It does not mean the transaction landed. Check the transaction signature through Solana RPC:

```shell
export SOLANA_RPC_URL='https://api.mainnet-beta.solana.com'
export TX_SIGNATURE='<first-signature-from-signed-transaction>'

curl -sS "$SOLANA_RPC_URL" \
  --header 'content-type: application/json' \
  --data "{
    \"jsonrpc\": \"2.0\",
    \"id\": 1,
    \"method\": \"getSignatureStatuses\",
    \"params\": [[\"$TX_SIGNATURE\"], {\"searchTransactionHistory\": true}]
  }"
```

Example landed output:

```json
{"jsonrpc":"2.0","result":{"context":{"slot":123456789},"value":[{"confirmationStatus":"finalized","confirmations":null,"err":null,"slot":123456700,"status":{"Ok":null}}]},"id":1}
```

## Sending a bundle with QUIC

QUIC submissions use BAMB v0 framing. A QUIC bundle submission is one BAMB frame written to one unidirectional QUIC stream.

QUIC does not return a JSON-RPC response or bundle ID. A successful QUIC stream write only proves that the transport accepted the bytes. BAM can still drop the bundle later because of rate limiting, malformed framing, validation failure, auction outcome, or normal leader-window behavior. Confirm landing through the transaction signatures using normal Solana RPC.

### QUIC client requirements

Your QUIC client must:

| Requirement | Value |
| ----- | ----- |
| Remote address | `<region-code>.mainnet.bam.jito.wtf:11228`, unless Jito provides a different port |
| Transport | QUIC over UDP |
| Client authentication | Present the allowlisted Ed25519 keypair as the client TLS certificate |
| ALPN | `solana-tpu` |
| Stream shape | Open one unidirectional stream per bundle |
| Stream payload | Exactly one complete BAMB v0 frame |

The QUIC authentication keypair is only a transport credential. The submitted Solana transactions must still be fully signed by their fee payers and required signers.

### BAMB v0 frame format

All integers are little-endian. The frame starts with a fixed 26-byte header, followed by the raw signed transaction bytes in bundle order.

| Offset | Bytes | Field | Rule |
| ----- | ----- | ----- | ----- |
| `0` | `4` | Magic | ASCII `BAMB` |
| `4` | `1` | Version | `0` |
| `5` | `1` | Flags | `0` |
| `6` | `1` | Transaction count | `1` through `5` |
| `7` | `1` | Header length | `26` |
| `8` | `8` | Maximum scheduling slot | `0`; bundle expiry is not currently supported |
| `16` | `10` | Transaction lengths | Five `u16` lengths. Unused entries must be `0`. |
| `26` | variable | Transaction payloads | Raw serialized signed transaction bytes, concatenated in order |

For current mainnet transaction formats, keep each serialized transaction within the standard 1,232-byte packet size. BAMB v0 has a larger hard envelope cap for future transaction versions, but clients should not rely on that unless Jito explicitly enables support for the relevant transaction format.

Python frame-encoding helper:

```py
def encode_bamb_v0(signed_transactions: list[bytes]) -> bytes:
    if not 1 <= len(signed_transactions) <= 5:
        raise ValueError("a bundle must contain 1 to 5 transactions")

    lengths = [len(tx) for tx in signed_transactions]
    if any(length == 0 for length in lengths):
        raise ValueError("transactions must be non-empty")

    header = bytearray()
    header += b"BAMB"
    header += bytes([0])      # version
    header += bytes([0])      # flags
    header += bytes([len(signed_transactions)])
    header += bytes([26])     # header length
    header += (0).to_bytes(8, "little")  # max_schedule_slot, currently unsupported

    for length in lengths:
        header += length.to_bytes(2, "little")
    for _ in range(5 - len(lengths)):
        header += (0).to_bytes(2, "little")

    return bytes(header) + b"".join(signed_transactions)
```

Each call to `encode_bamb_v0(...)` produces the payload for one QUIC unidirectional stream.

### QUIC test flow

1. Select an active region from the BAM node explorer.
2. Confirm UDP reachability to the QUIC endpoint from your test host.
3. Prepare one bundle of one to five fully signed Solana transactions.
4. Encode the raw serialized transaction bytes as one BAMB v0 frame.
5. Open a QUIC connection using the allowlisted Ed25519 client certificate and ALPN `solana-tpu`.
6. Open a unidirectional stream.
7. Write exactly one BAMB frame to the stream and finish the stream.
8. Confirm the transaction signatures through Solana RPC.

`curl` is useful for the JSON-RPC path only. The QUIC path is not HTTP/3: it requires a QUIC client that presents the allowlisted Ed25519 keypair as its client certificate, negotiates ALPN `solana-tpu`, and writes a BAMB frame to a unidirectional stream.

The examples below show the Python command shape and expected output. Full Python client source and dependency setup are in the appendix.

These example clients only read the local QUIC authentication keypair file, encode the signed transactions provided on the command line, and send one BAMB frame over QUIC.

### Python QUIC example

The Python client in the appendix accepts one to five base64-encoded signed transactions, wraps them in one BAMB v0 frame, and sends the frame over QUIC.

Run it with the QUIC endpoint, the QUIC authentication keypair, and one to five signed transactions:

```shell
python3 send_bam_quic_bundle.py \
  --address ewr.mainnet.bam.jito.wtf:11228 \
  --quic-keypair /path/to/quic-auth-keypair.json \
  '<base64-signed-transaction-1>' '<base64-signed-transaction-2>'
```

Example QUIC run:

```shell
export BAM_QUIC_ADDR='ewr.mainnet.bam.jito.wtf:11228'
export BAM_QUIC_KEYPAIR='./jito-bam-quic-auth.json'
export SIGNED_TX_B64='<base64-signed-transaction>'

python3 send_bam_quic_bundle.py \
  --address "$BAM_QUIC_ADDR" \
  --quic-keypair "$BAM_QUIC_KEYPAIR" \
  "$SIGNED_TX_B64"
```

Example output:

```
transaction_count=1
transaction_1_bytes=284
bamb_frame_bytes=310
quic_ping=ack
quic_send=ok
```

Example result summary:

| Check | Example value | Meaning |
| ----- | ----- | ----- |
| Transactions in bundle | `1` | The client decoded one base64 signed transaction. |
| Serialized transaction size | `284` bytes | The transaction is within the standard packet-size limit. |
| BAMB frame size | `310` bytes | The 26-byte BAMB header plus the serialized transaction bytes. |
| QUIC transport acknowledgement | `quic_ping=ack` | The peer responded to a QUIC PING after the stream write. |
| Client send result | `quic_send=ok` | The client completed the handshake, wrote the BAMB frame, and finished the stream. |

`quic_send=ok` means the client completed the QUIC handshake, wrote one BAMB frame to a unidirectional stream, and received a transport-level PING acknowledgement from the peer. QUIC does not return a bundle ID or landing result, so you still need to check the transaction signature through Solana RPC.

Confirm the submitted transaction signature through your Solana RPC endpoint:

```shell
export SOLANA_RPC_URL='https://api.mainnet-beta.solana.com'
export TX_SIGNATURE='<submitted-transaction-signature>'

curl -sS "$SOLANA_RPC_URL" \
  --header 'content-type: application/json' \
  --data "{
    \"jsonrpc\": \"2.0\",
    \"id\": 1,
    \"method\": \"getSignatureStatuses\",
    \"params\": [[\"$TX_SIGNATURE\"], {\"searchTransactionHistory\": true}]
  }"
```

Example landed output:

```json
{"jsonrpc":"2.0","result":{"context":{"slot":123456789},"value":[{"confirmationStatus":"finalized","confirmations":null,"err":null,"slot":123456700,"status":{"Ok":null}}]},"id":1}
```

Example landing result summary:

| Check | Example value | Meaning |
| ----- | ----- | ----- |
| `confirmationStatus` | `finalized` | The transaction reached finalized commitment on the queried RPC endpoint. |
| `err` | `null` | The transaction landed successfully. |
| `status` | `{"Ok": null}` | Solana reports successful execution. |
| `slot` | `123456700` | The slot in which the transaction landed. |

The Python example sends exactly one bundle and then exits. It does not create or sign transactions. It spends real SOL only through the signed transactions you provide.

For existing Rust senders, see Appendix A.2 for the same BAMB v0 framing and QUIC stream logic as an integration snippet.

Common QUIC outcomes:

| Outcome | Likely meaning |
| ----- | ----- |
| QUIC handshake fails or connection is closed immediately | QUIC credential is missing, unknown, not yet propagated, or UDP is not reachable. |
| Stream write succeeds, but signatures never land | The bundle may not have been selected, may have failed validation, may have arrived outside a useful leader window, or may have exceeded the credential rate limit. |
| Only some test transactions appear in RPC | The observed transactions may be from different bundles. A single BAMB v0 bundle is atomic and should not land partially. |

### Rust QUIC example

For existing Rust senders, Appendix A.2 provides a minimal `send_bamb_bundle(...)` helper with the same BAMB v0 framing and QUIC stream logic. It assumes your application already has an authenticated `quinn::Connection` using the allowlisted QUIC keypair and ALPN `solana-tpu`.

Example call:

```rust
let signed_transactions_b64 = vec![signed_tx_b64];
send_bamb_bundle(&connection, &signed_transactions_b64).await?;
```

Expected output:

```
transaction_count=1
transaction_1_bytes=284
bamb_frame_bytes=310
quic_send=ok
```

`quic_send=ok` means the Rust sender opened a unidirectional stream, wrote the BAMB frame, finished the stream, and the peer did not stop that stream with an error. It is not a bundle-status response; confirm landing through Solana RPC using the submitted transaction signature.

Common QUIC outcomes:

| Outcome | Likely meaning |
| ----- | ----- |
| QUIC handshake fails or connection is closed immediately | QUIC credential is missing, unknown, not yet propagated, or UDP is not reachable. |
| Stream write succeeds, but signatures never land | The bundle may not have been selected, may have failed validation, may have arrived outside a useful leader window, or may have exceeded the credential rate limit. |
| Only some test transactions appear in RPC | The observed transactions may be from different bundles. A single BAMB v0 bundle is atomic and should not land partially. |

## Supported features and rate limits

| Capability | Supported |
| ----- | ----- |
| One to five fully signed transactions per bundle | Yes |
| Ordered, atomic execution | Yes. If one transaction in a bundle fails, the bundle does not land partially. |
| Base64 JSON-RPC transaction encoding | Yes, for HTTP |
| Raw transaction bytes in BAMB v0 frame | Yes, for QUIC |
| Legacy and versioned transactions | Supported by the target cluster |
| Initial rate | 25 bundles per second, per credential, per BAM node |
| Maximum transaction rate at initial limit | Up to 125 transactions per second when every bundle contains five transactions |

Not currently supported on these endpoints:

| Feature | Status |
| ----- | ----- |
| HTTPS for JSON-RPC | Not supported |
| Base58 transaction encoding for JSON-RPC | Not supported |
| Bundle expiry | Not supported |
| Partial bundle execution | Not supported |
| Bundle-status method | Not supported |
| JSON-RPC response or bundle ID over QUIC | Not supported |

## Starting your test

1. Select an active region from the [BAM node explorer](/explorer/#nodes).
2. Send a JSON-RPC bundle with `curl` using your UUID credential.
3. Send a QUIC bundle with a client implementation using your allowlisted Ed25519 QUIC credential.
4. Repeat across all active BAM node regions.
5. Confirm landing through Solana RPC using the submitted transaction signatures.

For low-rate functional testing, start at one bundle per second per node before increasing traffic. Stay below the provided rate limit unless Jito has explicitly approved a higher-rate test.

## Feedback

We will be in touch to gain feedback on latency, performance, and other metrics. Please let us know if you have any questions, comments, or concerns. We appreciate your collaboration!

## Appendix A: Example client source

### Appendix A.1: Python script

Setup:

```shell
python3 -m venv .venv
. .venv/bin/activate
python3 -m pip install aioquic cryptography
```

Save this as `send_bam_quic_bundle.py`:

```py
import argparse
import asyncio
import base64
import json
import os
import ssl
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

from aioquic.asyncio import connect
from aioquic.quic.configuration import QuicConfiguration
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.x509.oid import NameOID

MAX_TXS_PER_BUNDLE = 5
STANDARD_PACKET_SIZE = 1232

def encode_bamb_v0(signed_transactions: list[bytes]) -> bytes:
    if not 1 <= len(signed_transactions) <= MAX_TXS_PER_BUNDLE:
        raise ValueError("a bundle must contain 1 to 5 transactions")

    header = bytearray()
    header += b"BAMB"
    header += bytes([0])  # version
    header += bytes([0])  # flags
    header += bytes([len(signed_transactions)])
    header += bytes([26])  # header length
    header += (0).to_bytes(8, "little")  # max_schedule_slot, currently unsupported

    for tx in signed_transactions:
        if not tx:
            raise ValueError("transactions must be non-empty")
        if len(tx) > STANDARD_PACKET_SIZE:
            raise ValueError("serialized transaction exceeds the standard 1232-byte packet size")
        header += len(tx).to_bytes(2, "little")

    for _ in range(MAX_TXS_PER_BUNDLE - len(signed_transactions)):
        header += (0).to_bytes(2, "little")

    return bytes(header) + b"".join(signed_transactions)

def write_temp_ed25519_cert_chain(solana_keypair_json: str) -> tuple[str, str]:
    raw = bytes(json.loads(Path(solana_keypair_json).read_text()))
    if len(raw) < 32:
        raise ValueError("expected a Solana keypair JSON array")

    # Solana JSON keypairs are usually 64 bytes: 32-byte secret seed + 32-byte public key.
    private_key = ed25519.Ed25519PrivateKey.from_private_bytes(raw[:32])
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, "bam-quic-client"),
    ])
    now = datetime.now(timezone.utc)
    cert = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(minutes=5))
        .not_valid_after(now + timedelta(days=365))
        .sign(private_key, algorithm=None)
    )

    cert_file = tempfile.NamedTemporaryFile("wb", delete=False)
    key_file = tempfile.NamedTemporaryFile("wb", delete=False)
    cert_file.write(cert.public_bytes(serialization.Encoding.PEM))
    key_file.write(
        private_key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption(),
        )
    )
    cert_file.close()
    key_file.close()
    return cert_file.name, key_file.name

def split_host_port(address: str) -> tuple[str, int]:
    host, port = address.rsplit(":", 1)
    return host, int(port)

async def send_bundle(args: argparse.Namespace) -> None:
    host, port = split_host_port(args.address)
    transactions = [base64.b64decode(tx) for tx in args.transaction]
    frame = encode_bamb_v0(transactions)
    print(f"transaction_count={len(transactions)}")
    for index, tx in enumerate(transactions, start=1):
        print(f"transaction_{index}_bytes={len(tx)}")
    print(f"bamb_frame_bytes={len(frame)}")

    cert_path, key_path = write_temp_ed25519_cert_chain(args.quic_keypair)
    try:
        configuration = QuicConfiguration(is_client=True, alpn_protocols=["solana-tpu"])
        # BAM uses an ephemeral server certificate; the authenticated identity is the client cert.
        configuration.verify_mode = ssl.CERT_NONE
        configuration.server_name = "localhost"
        configuration.load_cert_chain(cert_path, key_path)

        async with connect(
            host,
            port,
            configuration=configuration,
        ) as client:
            _reader, writer = await client.create_stream(is_unidirectional=True)
            writer.write(frame)
            writer.write_eof()
            await writer.drain()
            # This is a transport-level acknowledgement only. QUIC has no bundle-status response.
            await asyncio.wait_for(client.ping(), timeout=3.0)
            print("quic_ping=ack")
            await asyncio.sleep(0.25)
            print("quic_send=ok")
    finally:
        os.unlink(cert_path)
        os.unlink(key_path)

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--address", required=True, help="for example ewr.mainnet.bam.jito.wtf:11228")
    parser.add_argument("--quic-keypair", required=True, help="allowlisted QUIC auth keypair JSON")
    parser.add_argument("transaction", nargs="+", help="base64 signed transaction, 1 to 5 values")
    asyncio.run(send_bundle(parser.parse_args()))

if __name__ == "__main__":
    main()
```

Arguments:

| Argument | Required | Meaning |
| ----- | ----- | ----- |
| `--address` | Yes | BAM QUIC endpoint, for example `ewr.mainnet.bam.jito.wtf:11228`. |
| `--quic-keypair` | Yes | Path to the allowlisted QUIC authentication keypair JSON. |
| `transaction` | Yes | One to five base64-encoded, fully signed Solana transactions. |

Help output:

```
$ python3 send_bam_quic_bundle.py --help
usage: send_bam_quic_bundle.py [-h] --address ADDRESS --quic-keypair QUIC_KEYPAIR transaction [transaction ...]

positional arguments:
  transaction           base64 signed transaction, 1 to 5 values

options:
  -h, --help            show this help message and exit
  --address ADDRESS     for example ewr.mainnet.bam.jito.wtf:11228
  --quic-keypair QUIC_KEYPAIR
                        allowlisted QUIC auth keypair JSON
```

Run:

```shell
python3 send_bam_quic_bundle.py \
  --address ewr.mainnet.bam.jito.wtf:11228 \
  --quic-keypair /path/to/quic-auth-keypair.json \
  '<base64-signed-transaction-1>' '<base64-signed-transaction-2>'
```

Expected output:

```
transaction_count=1
transaction_1_bytes=284
bamb_frame_bytes=310
quic_ping=ack
quic_send=ok
```

### Appendix A.2: Rust integration snippet

If you already have a Rust sender, the core QUIC payload is one BAMB v0 frame written to one unidirectional stream. This snippet assumes your `quinn::Connection` is already connected with the allowlisted QUIC authentication keypair and ALPN `solana-tpu`.

```rust
use anyhow::{bail, ensure, Context};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use tokio::io::AsyncWriteExt;

const MAX_TXS_PER_BUNDLE: usize = 5;
const STANDARD_PACKET_SIZE: usize = 1232;

fn encode_bamb_v0(signed_transactions: &[Vec<u8>]) -> anyhow::Result<Vec<u8>> {
    ensure!(
        (1..=MAX_TXS_PER_BUNDLE).contains(&signed_transactions.len()),
        "a bundle must contain 1 to 5 transactions"
    );

    let mut frame = Vec::with_capacity(26);
    frame.extend_from_slice(b"BAMB");
    frame.push(0); // version
    frame.push(0); // flags
    frame.push(signed_transactions.len() as u8);
    frame.push(26); // header length
    frame.extend_from_slice(&0u64.to_le_bytes()); // max_schedule_slot, currently unsupported

    for tx in signed_transactions {
        ensure!(!tx.is_empty(), "transactions must be non-empty");
        ensure!(
            tx.len() <= STANDARD_PACKET_SIZE,
            "serialized transaction exceeds the standard 1232-byte packet size"
        );
        frame.extend_from_slice(&(tx.len() as u16).to_le_bytes());
    }
    for _ in signed_transactions.len()..MAX_TXS_PER_BUNDLE {
        frame.extend_from_slice(&0u16.to_le_bytes());
    }
    for tx in signed_transactions {
        frame.extend_from_slice(tx);
    }

    Ok(frame)
}

pub async fn send_bamb_bundle(
    connection: &quinn::Connection,
    signed_transactions_b64: &[String],
) -> anyhow::Result<()> {
    let signed_transactions = signed_transactions_b64
        .iter()
        .map(|tx| STANDARD.decode(tx).context("transaction must be base64"))
        .collect::<anyhow::Result<Vec<_>>>()?;
    let frame = encode_bamb_v0(&signed_transactions)?;

    println!("transaction_count={}", signed_transactions.len());
    for (index, tx) in signed_transactions.iter().enumerate() {
        println!("transaction_{}_bytes={}", index + 1, tx.len());
    }
    println!("bamb_frame_bytes={}", frame.len());

    let mut stream = connection
        .open_uni()
        .await
        .context("open unidirectional QUIC stream")?;
    stream.write_all(&frame).await.context("write BAMB frame")?;
    stream.finish().context("finish QUIC stream")?;

    if let Some(code) = stream.stopped().await.context("wait for stream status")? {
        bail!("peer stopped QUIC stream with code {code}");
    }

    println!("quic_send=ok");
    Ok(())
}
```

Example call from an existing Rust sender:

```rust
let signed_transactions_b64 = vec![signed_tx_b64];
send_bamb_bundle(&connection, &signed_transactions_b64).await?;
```

Expected output:

```
transaction_count=1
transaction_1_bytes=284
bamb_frame_bytes=310
quic_send=ok
```

`quic_send=ok` means the Rust sender opened a unidirectional stream, wrote the BAMB frame, finished the stream, and the peer did not stop that stream with an error. As with Python, this is not a bundle-status response; confirm landing through Solana RPC using the submitted transaction signature.
