---
title: "TypeScript Client"
subtitle: "Learn how to use the Jito Restaking TypeScript client."
section_type: "page"
order: 1
---

Install like below:

```bash
yarn add @jito-foundation/restaking-sdk
yarn add @jito-foundation/vault-sdk
```

## Jito Restaking Client

Through `@jito-foundation/restaking-sdk`, you can handle the operation of NCN and Operator such as registering, making relationship with Vault.

**Example**:

Initializing NCN:

```ts
import { 
    address,
    generateKeyPairSigner, 
    getProgramDerivedAddress, 
    getAddressEncoder,
    addSignersToTransactionMessage, 
    createTransaction, 
    createSignerFromKeyPair,
    createSolanaClient,
    createKeyPairFromBytes 
} from "gill";
import { getInitializeNcnInstruction } from "@jito-foundation/restaking-sdk";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";

const cluster = "devnet";

const restakingProgramPubkey = address("RestkWeAVL8fRGgzhfeoqFhsqKRchg6aa1XrcH96z4Q");
const configPubkey = address("4vvKh3Ws4vGzgXRVdo8SdL4jePXDvCqKVmi21BCBGwvn");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: cluster,
});

const keypairFilePath = "~/.config/solana/id.json";

const resolvedKeypairPath = resolve(keypairFilePath.replace("~", homedir()));

const keypair = await createKeyPairFromBytes(
  Uint8Array.from(JSON.parse(readFileSync(resolvedKeypairPath, "utf8"))),
);

const adminKeypair = await createSignerFromKeyPair(keypair);
const baseKeypair = await generateKeyPairSigner();

const addressEncoder = getAddressEncoder();

const [ncnPubkey, bumpSeed] = await getProgramDerivedAddress({
    programAddress: restakingProgramPubkey, 
    seeds: [
        Buffer.from("ncn"),
        addressEncoder.encode(baseKeypair.address)
    ]
});

const input = {
    config: configPubkey,
    ncn: ncnPubkey,
    admin: adminKeypair,
    base: baseKeypair,
};

const instruction = getInitializeNcnInstruction(input);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
    feePayer: adminKeypair,
    instructions: [instruction],
    latestBlockhash,
    version: "legacy"
});
const signedTransaction = addSignersToTransactionMessage([adminKeypair, baseKeypair], transaction);

try {
    const signature = await sendAndConfirmTransaction(signedTransaction);
  
    console.log("Transaction confirmed!", signature);
} catch (err) {
    console.error("Unable to send and confirm the transaction");
    console.error(err);
}
```

Initializing Operator:

```ts
import { 
    address,
    generateKeyPairSigner, 
    getProgramDerivedAddress, 
    getAddressEncoder,
    addSignersToTransactionMessage, 
    createTransaction, 
    createSignerFromKeyPair,
    createSolanaClient,
    createKeyPairFromBytes 
} from "gill";
import { getInitializeNcnInstruction, getInitializeOperatorInstruction, InitializeOperatorInput } from "@jito-foundation/restaking-sdk";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";

const cluster = "devnet";

const restakingProgramPubkey = address("RestkWeAVL8fRGgzhfeoqFhsqKRchg6aa1XrcH96z4Q");
const configPubkey = address("4vvKh3Ws4vGzgXRVdo8SdL4jePXDvCqKVmi21BCBGwvn");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: cluster,
});

const keypairFilePath = "~/.config/solana/id.json";

const resolvedKeypairPath = resolve(keypairFilePath.replace("~", homedir()));

const keypair = await createKeyPairFromBytes(
  Uint8Array.from(JSON.parse(readFileSync(resolvedKeypairPath, "utf8"))),
);

const adminKeypair = await createSignerFromKeyPair(keypair);
const baseKeypair = await generateKeyPairSigner();

const addressEncoder = getAddressEncoder();

const [operatorPubkey, bumpSeed] = await getProgramDerivedAddress({
    programAddress: restakingProgramPubkey, 
    seeds: [
        Buffer.from("operator"),
        addressEncoder.encode(baseKeypair.address)
    ]
});

const input: InitializeOperatorInput = {
    config: configPubkey,
    operator: operatorPubkey,
    admin: adminKeypair,
    base: baseKeypair,
    operatorFeeBps: 1000,
};

const instruction = getInitializeOperatorInstruction(input);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
    feePayer: adminKeypair,
    instructions: [instruction],
    latestBlockhash,
    version: "legacy"
});
const signedTransaction = addSignersToTransactionMessage([adminKeypair, baseKeypair], transaction);

try {
    const signature = await sendAndConfirmTransaction(signedTransaction);
  
    console.log("Transaction confirmed!", signature);
} catch (err) {
    console.error("Unable to send and confirm the transaction");
    console.error(err);
}
```

## Jito Vault Client

Through `@jito-foundation/vault-sdk`, you can handle the operation of Vault such as minting VRT, withdrawing.

**Example**:

Initializing Vault:

```ts
import { 
    address,
    generateKeyPairSigner, 
    getProgramDerivedAddress, 
    getAddressEncoder,
    addSignersToTransactionMessage, 
    createTransaction, 
    createSignerFromKeyPair,
    createSolanaClient,
    createKeyPairFromBytes 
} from "gill";
import { resolve } from "node:path";
import { homedir } from "node:os";
import { readFileSync } from "node:fs";
import { getInitializeVaultInstruction, InitializeVaultInput } from "@jito-foundation/vault-sdk";
import { CreateAssociatedTokenIdempotentInput, getAssociatedTokenAccountAddress, getCreateAssociatedTokenIdempotentInstruction } from "gill/programs/token";

const cluster = "devnet";

const vaultProgramPubkey = address("3bw2Y3np6zzckFMxcwmk8X8GALS8apHsQX1NXz8ifNbG");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: cluster,
});

const keypairFilePath = "~/.config/solana/id.json";

const resolvedKeypairPath = resolve(keypairFilePath.replace("~", homedir()));

const keypair = await createKeyPairFromBytes(
  Uint8Array.from(JSON.parse(readFileSync(resolvedKeypairPath, "utf8"))),
);

const adminKeypair = await createSignerFromKeyPair(keypair);
console.log("Admin: ", adminKeypair.address);

const baseKeypair = await generateKeyPairSigner();
console.log("Base: ", baseKeypair.address);

const vrtMintKeypair = await generateKeyPairSigner();
console.log("VRT Mint Keypair Address: ", vrtMintKeypair.address);

const stMintPubkey = address("2oVqm2u7e2M6NQX8nk6drCqFHe7fi6qpkuqpmZh5ssiJ");

const addressEncoder = getAddressEncoder();

const [configPubkey] = await getProgramDerivedAddress({
    programAddress: vaultProgramPubkey, 
    seeds: [
        Buffer.from("config"),
    ]
});

const [vaultPubkey] = await getProgramDerivedAddress({
    programAddress: vaultProgramPubkey, 
    seeds: [
        Buffer.from("vault"),
        addressEncoder.encode(baseKeypair.address)
    ]
});
const adminStTokenAccount = await getAssociatedTokenAccountAddress(stMintPubkey, adminKeypair);
const vaultStTokenAccount = await getAssociatedTokenAccountAddress(stMintPubkey, vaultPubkey);

const [burnVaultPubkey] = await getProgramDerivedAddress({
    programAddress: vaultProgramPubkey,
    seeds: [
        Buffer.from("burn_vault"),
        addressEncoder.encode(baseKeypair.address),
    ]
});

const burnVaultVrtTokenAccount = await getAssociatedTokenAccountAddress(vrtMintKeypair.address, burnVaultPubkey);

const input: InitializeVaultInput = {
    config: configPubkey,
    vault: vaultPubkey,
    vrtMint: vrtMintKeypair,
    stMint: stMintPubkey,
    adminStTokenAccount,
    vaultStTokenAccount,
    burnVault: burnVaultPubkey,
    burnVaultVrtTokenAccount,
    admin: adminKeypair,
    base: baseKeypair,
    associatedTokenProgram: address("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
    depositFeeBps: 1000,
    withdrawalFeeBps: 1000,
    rewardFeeBps: 1000,
    decimals: 9,
    initializeTokenAmount: 1000,
};

const instruction = getInitializeVaultInstruction(input, {programAddress: vaultProgramPubkey});

const adminAssociatedTokenInput: CreateAssociatedTokenIdempotentInput = {
    mint: stMintPubkey,
    owner: adminKeypair.address,
    payer: adminKeypair,
    ata: adminStTokenAccount,
    tokenProgram: address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
};

const admin_st_token_account_ix = getCreateAssociatedTokenIdempotentInstruction(adminAssociatedTokenInput);

const vaultAssociatedTokenInput: CreateAssociatedTokenIdempotentInput = {
    mint: stMintPubkey,
    owner: vaultPubkey,
    payer: adminKeypair,
    ata: vaultStTokenAccount,
    tokenProgram: address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
};

const vault_st_token_account_ix = getCreateAssociatedTokenIdempotentInstruction(vaultAssociatedTokenInput);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
    feePayer: adminKeypair,
    instructions: [admin_st_token_account_ix, vault_st_token_account_ix, instruction],
    latestBlockhash,
    version: "legacy"
});
const signedTransaction = addSignersToTransactionMessage([adminKeypair, baseKeypair, vrtMintKeypair], transaction);

try {
    const signature = await sendAndConfirmTransaction(signedTransaction);
  
    console.log("Transaction confirmed!", signature);
} catch (err) {
    console.error("Unable to send and confirm the transaction");
    console.error(err);
}
```
