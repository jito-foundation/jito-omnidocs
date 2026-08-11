---
title: BAM Documentation
subtitle: System architecture, validator flow, and operational basics.
section_type: page
order: 10
---

# **BAM Documentation**

BAM builds on top of existing Solana validator infrastructure (Agave and Jito-Solana) with enhanced trust \+ performance.

It introduces a dedicated **BAM Node** and a lightweight **BAM Client** that connect to validators via gRPC and QUIC, as shown below.

The BAM System facilitates transaction scheduling on the Solana Network.

- **BAM Node**: Ingests Bundles/Transactions, Solana cluster state and current leader state. Validates, sequences and finally sends the Bundles/Transactions to the leader _BAM Validator_. Receives execution results back and updates its local awareness of everything as best as possible. A _BAM Node_ can serve multiple _BAM Validators_.
- **BAM Validator(s):** Receives and executes a transaction stream received from the _BAM Node_. Receives _Leader State_ messages and transaction execution results. A _BAM Validator_ can connect to only one _BAM Node_ at a time.
- **Block Engine:** Existing Jito Labs infrastructure that provides Packet and Pre-Simulated Bundle streams to Solana Validators. The _BAM Node_ creates one connection to the Block Engine in lieu of each connected validator in order to maintain backwards compatibility.

![BAM System Architecture](/shared/images/bam/image3.png)

## **BAM Node**

The _BAM Node_ core functional requirements:

- Shall receive _Transactions and Bundles_ and validate them according to Solana network standards, combined with the most recent available state.
- Shall not permit invalid transactions into the scheduled sequence.
- Shall Sequence transactions according to programmatic, stable rules.
- Send transactions out to a confirmed, connected validator when their leader rotation arrives.

## **Validator**

The _BAM Validator_ is responsible for upholding the following contract:

- Execute all received transactions in that exact order
- Provide _correct_ execution feedback and state information.

If any of the above are violated, the _BAM Node_ reserves the right to temporarily or permanently disconnect the _BAM Validator_.

The following diagram illustrates the general flow of messages, transactions, and data within the BAM Validator implementation.

![BAM Validator Flow](/shared/images/bam/image1.png)

### **FAQ's**

<!-- #### **How do BAM rewards compare to Jito-Solana / Agave / Firedancer?** -->

#### **How do I migrate from the Jito-Solana client to BAM?**

- All existing Jito flags and features are retained.
- Add the `--bam-url` flag pointing to the generic BAM Node URL.
- No other CLI syntax changes are required.

See [https://bam.dev/validators/](https://bam.dev/validators/) for more information.

#### **Can I run BAM on my existing hardware?**

Yes. Your existing validator running jito-solana is sufficient to run AgaveBAM, or your existing Firedancer validator is sufficient to run FireBAM. No equipment upgrades are required.

#### **Does BAM work with Jito Bundles?**

Yes, AgaveBAM and FireBAM sequence both normal transactions and Jito Bundles.

#### **Does BAM affect my JitoSOL rank or SFDP delegation?**

- **JitoSOL rank:** AgaveBAM and FireBAM do **not** directly affect your rank unless downtime occurs.
- **Vote credits:** Unaffected — AgaveBAM and FireBAM do not interfere with vote production.
- **SFDP delegation:** AgaveBAM and FireBAM do not impact SFDP eligibility as long as you're running a compatible Jito client version.

#### **Does BAM currently support Firedancer?**

Yes, FireBAM supports Firedancer. See [https://bam.dev/validators/#firebam](https://bam.dev/validators/#firebam) for more information.

#### **How does BAM interact with transactions sent via RPC or directly to TPU?**

- **RPC flow:** If your validator is connected to BAM and scheduled to be a leader soon, transactions submitted via RPC are routed through BAM.
- **Direct TPU flow:** Transactions sent directly to your TPU port are processed through BAM before execution.

#### **Can I run BAM with a hot spare validator?**

Hot spare configurations should work normally, similar to Jito-Solana and Agave setups. However, you need to manually re-run `set-bam-url` after switching over to a hot spare to ensure that the connection connects with the correct leader. You may see this in the logs otherwise:

> Example log output:
>
> ```
> 4 [2025-10-24T17:38:12.279721584Z ERROR solana_core::bam_connection]
>   Failed to receive message from inbound stream:
>   Status {
>     code: PermissionDenied,
>     message: "Validator is not on the leader schedule",
>     source: None
>   }
> ```
