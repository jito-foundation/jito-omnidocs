---
title: "Rust Client"
subtitle: "Learn how to use the Jito Restaking Rust client."
section_type: "page"
order: 0
---

Powered by [Codama](https://github.com/codama-idl/codama), there are Rust clients code `jito-restaking-client` and `jito-vault-client`.

Install like below:

```toml
[dependencies]
jito-restaking-client = { git = "https://github.com/jito-foundation/restaking.git", branch = "master" }
jito-vault-client = { git = "https://github.com/jito-foundation/restaking.git", branch = "master" }
```


## Jito Restaking Client

Through `jito-restaking-client`, you can handle the operation of NCN and Operator such as registering, making relationship with Vault.

**Example**:

Initializing NCN:

```rust
fn initialize_ncn(restaking_program_id: &Pubkey, rpc_client: &RpcClient, keypair: &Keypair) {
    let base = Keypair::new();
    let ncn = Ncn::find_program_address(restaking_program_id, &base.pubkey()).0;

    let mut ix_builder = InitializeNcnBuilder::new();
    let ix = ix_builder
        .config(Config::find_program_address(restaking_program_id).0)
        .ncn(ncn)
        .admin(keypair.pubkey())
        .base(base.pubkey())
        .instruction();

    let blockhash = rpc_client.get_latest_blockhash().unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&keypair.pubkey()),
        &[keypair, &base],
        blockhash,
    );

    let result = rpc_client.send_and_confirm_transaction(&tx).unwrap();

    println!("{:?}", result);
}
```

Initializing Operator:

```rust
fn initialize_operator(restaking_program_id: &Pubkey, rpc_client: &RpcClient, keypair: &Keypair) {
    let base = Keypair::new();
    let operator = Operator::find_program_address(restaking_program_id, &base.pubkey()).0;

    let mut ix_builder = InitializeOperatorBuilder::new();
    let ix = ix_builder
        .config(Config::find_program_address(restaking_program_id).0)
        .operator(operator)
        .admin(keypair.pubkey())
        .base(base.pubkey())
        .operator_fee_bps(1_000)
        .instruction();

    let blockhash = rpc_client.get_latest_blockhash().unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&keypair.pubkey()),
        &[keypair, &base],
        blockhash,
    );

    let result = rpc_client.send_and_confirm_transaction(&tx).unwrap();

    println!("{:?}", result);
}
```

## Jito Vault Client

Through `jito-vault-client`, you can handle the operation of Vault such as minting VRT, withdrawing.

**Example**:

Initializing Vault:

```rust
fn initialize_vault(
    vault_program_id: &Pubkey,
    rpc_client: &RpcClient,
    keypair: &Keypair,
) -> (Pubkey, Pubkey) {
    let base = Keypair::new();
    let vault = Vault::find_program_address(vault_program_id, &base.pubkey()).0;

    let vrt_mint = Keypair::new();
    let token_mint = pubkey!("HSkJ5428nHAvWsWA1AjeFuh79STnuUMvs4APoyAZXbkK");

    let mut ix_builder = InitializeVaultBuilder::new();
    let ix = ix_builder
        .config(Config::find_program_address(vault_program_id).0)
        .vault(vault)
        .vrt_mint(vrt_mint.pubkey())
        .token_mint(token_mint)
        .admin(keypair.pubkey())
        .base(base.pubkey())
        .deposit_fee_bps(1_000)
        .withdrawal_fee_bps(1_000)
        .reward_fee_bps(1_000)
        .decimals(9)
        .instruction();

    let blockhash = rpc_client.get_latest_blockhash().unwrap();
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&keypair.pubkey()),
        &[keypair, &base, &vrt_mint],
        blockhash,
    );

    let result = rpc_client.send_and_confirm_transaction(&tx).unwrap();

    println!("{:?}", result);

    (vault, vrt_mint.pubkey())
}
```

Create Token Metadata:

```rust
fn create_token_metadata(rpc_client: &RpcClient, keypair: &Keypair, pubkeys: (Pubkey, Pubkey)) {
    let inline_mpl_token_metadata_id = pubkey!("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    let metadata = Pubkey::find_program_address(
        &[
            b"metadata",
            inline_mpl_token_metadata_id.as_ref(),
            pubkeys.1.as_ref(),
        ],
        &inline_mpl_token_metadata_id,
    )
    .0;

    let mut ix_builder = CreateTokenMetadataBuilder::new();
    let ix = ix_builder
        .vault(pubkeys.0)
        .admin(keypair.pubkey())
        .vrt_mint(pubkeys.1)
        .payer(keypair.pubkey())
        .metadata(metadata)
        .name(String::from("Hello"))
        .symbol(String::from("HLO"))
        .uri(String::from("https://..."))
        .instruction();

    let blockhash = rpc_client.get_latest_blockhash().unwrap();
    let tx =
        Transaction::new_signed_with_payer(&[ix], Some(&keypair.pubkey()), &[keypair], blockhash);

    let result = rpc_client.send_and_confirm_transaction(&tx).unwrap();

    println!("{:?}", result);
}
```
