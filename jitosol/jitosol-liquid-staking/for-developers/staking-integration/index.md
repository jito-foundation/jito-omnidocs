---
title: 'Staking Integration'
subtitle: 'Code examples for integrating JitoSOL staking functionality'
section_type: 'page'
order: 30
---

## Developer Integration Guide

This guide shows how to integrate JitoSOL staking and unstaking functionality using both assisted (SPL stake pool library) and manual transaction building methods.

## Installation

```bash
npm install @solana/spl-stake-pool
npm install @solana/web3.js
npm install @solana/spl-token
```

## Basic Setup

```typescript
import * as solanaStakePool from '@solana/spl-stake-pool'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

// JitoSOL stake pool address (Mainnet)
const JITO_STAKE_POOL_ADDRESS = new PublicKey('Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb')

// JitoSOL mint address
const JITO_MINT_ADDRESS = new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn')

const connection = new Connection('YOUR_RPC_ENDPOINT')
```

## Assisted Staking (Recommended)

### Staking SOL for JitoSOL

```typescript
async function stakeSOL(amount: number, userWallet: any) {
  // Convert SOL to lamports
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL)
  
  // Get deposit instructions from SPL stake pool library
  const { instructions, signers } = await solanaStakePool.depositSol(
    connection,
    JITO_STAKE_POOL_ADDRESS,
    userWallet.publicKey,
    lamports
  )
  
  // Create and send transaction
  const transaction = new Transaction()
  transaction.add(...instructions)
  
  const { blockhash } = await connection.getLatestBlockhash('finalized')
  transaction.recentBlockhash = blockhash
  transaction.feePayer = userWallet.publicKey
  
  // Sign with any additional signers
  if (signers.length > 0) {
    transaction.sign(...signers)
  }
  
  const signedTransaction = await userWallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signedTransaction.serialize())
  
  return signature
}
```

### Unstaking JitoSOL for SOL

```typescript
async function unstakeJitoSOL(amount: number, userWallet: any, useReserve: boolean = false) {
  // Get withdraw instructions from SPL stake pool library
  const { instructions, signers } = await solanaStakePool.withdrawStake(
    connection,
    JITO_STAKE_POOL_ADDRESS,
    userWallet.publicKey,
    amount, // Amount in JitoSOL tokens
    useReserve // false = withdraw to stake account, true = instant SOL via reserve
  )
  
  const transaction = new Transaction()
  transaction.add(...instructions)
  
  const { blockhash } = await connection.getLatestBlockhash('finalized')
  transaction.recentBlockhash = blockhash
  transaction.feePayer = userWallet.publicKey
  
  if (signers.length > 0) {
    transaction.sign(...signers)
  }
  
  const signedTransaction = await userWallet.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signedTransaction.serialize())
  
  return signature
}
```

## Getting Pool Information

```typescript
async function getPoolInfo() {
  const stakePoolAccount = await solanaStakePool.getStakePoolAccount(
    connection,
    JITO_STAKE_POOL_ADDRESS
  )
  
  if (!stakePoolAccount?.account?.data) {
    throw new Error('Failed to fetch stake pool account data')
  }
  
  const stakePoolData = stakePoolAccount.account.data
  
  // Calculate conversion rate
  const solJitoConversion = !stakePoolData.poolTokenSupply.isZero()
    ? Number(stakePoolData.totalLamports.toString()) / Number(stakePoolData.poolTokenSupply.toString())
    : 0
  
  return {
    totalLamports: stakePoolData.totalLamports,
    totalPoolTokens: stakePoolData.poolTokenSupply,
    solJitoConversion,
    poolMint: stakePoolData.poolMint,
    reserveStake: stakePoolData.reserveStake,
    validatorList: stakePoolData.validatorList,
    manager: stakePoolData.manager
  }
}
```

## Manual Transaction Building

For developers who need more control or want to understand the underlying mechanics, transactions can be built manually instead of using the SPL stake pool library helpers.

### High-Level Manual Approach

**Manual Staking:**
- Create associated token account for JitoSOL if needed
- Build `DepositSol` instruction (instruction index 14) with proper account metas
- Handle withdraw authority PDA derivation
- Manage compute budget and transaction signing

**Manual Unstaking:**
- Create approval instruction for token transfer
- Find suitable validator stake account within the pool
- Create temporary stake account for receiving unstaked funds
- Build `WithdrawStake` instruction (instruction index 10)
- Handle all required account metas and signers

The manual approach involves:
1. **Account Discovery**: Finding the right accounts (withdraw authority, validator stake accounts, etc.)
2. **Instruction Building**: Manually constructing the raw instruction data and account metas
3. **Signer Management**: Handling ephemeral keypairs and approval authorities
4. **Error Handling**: Managing edge cases like insufficient validator balances

### Detailed Manual Implementation

For complete manual implementation examples, see the reference repository at:
**[https://github.com/jito-foundation/jito-stake-unstake-reference](https://github.com/jito-foundation/jito-stake-unstake-reference)**

The repository includes:
- `useManualStake.ts` - Manual DepositSol instruction building
- `useManualUnstake.ts` - Manual WithdrawStake instruction building with validator selection
- Working examples of account derivation, instruction data encoding, and transaction construction

## Important Considerations

### Unstaking Options
- **Withdraw to Stake Account** (`useReserve: false`): Creates a stake account that requires deactivation (1 epoch) before SOL is liquid
- **Instant Reserve Withdrawal** (`useReserve: true`): Immediate SOL but subject to available liquidity and fees

### Network Differences
- Pool parameters and minimum balances differ between Mainnet and Testnet
- Always verify addresses and test on Testnet first

## Additional Resources

- [Solana Stake Pool Documentation](https://spl.solana.com/stake-pool)
- [SPL Stake Pool TypeScript SDK](https://github.com/solana-program/stake-pool/tree/main/clients/js-legacy)
- [JitoSOL Stake/Unstake Reference Implementation](https://github.com/jito-foundation/jito-stake-unstake-reference)
- [Jito Network Documentation](https://docs.jito.network/)

## Support

For integration support:
- [Jito Discord](https://discord.gg/jito)

This guide provides both assisted (library-based) and manual transaction building approaches. For production applications, transaction confirmation, and user experience considerations. 