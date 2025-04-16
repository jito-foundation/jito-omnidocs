---
title: "Searcher API"
description: "Guide to using Jito's Searcher API for MEV opportunities"
section_type: "page"
order: 20
domain: "jitosol"
---

# Jito Searcher API

The Jito Searcher API allows developers to submit transaction bundles to the Jito Block Engine for inclusion in blocks. This API is designed for MEV searchers who want to capture value through strategies like arbitrage, liquidations, and sandwich trading.

## Getting Started

### Obtaining API Access

To access the Searcher API, you need to:

1. Register for an account at [searcher.jito.network](https://searcher.jito.network)
2. Generate API credentials in the dashboard
3. Deposit funds to pay for tip inclusion

### API Endpoints

The main endpoints for the Searcher API are:

| Endpoint | Description |
|----------|-------------|
| `v1/bundle/submit` | Submit a transaction bundle |
| `v1/bundle/status` | Check the status of a submitted bundle |
| `v1/account/balance` | Check your account balance |
| `v1/account/transactions` | View your transaction history |

## Bundle Submission

A bundle is a collection of transactions that should be executed in a specific order. Here's how to submit a bundle:

```javascript
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { JitoSearcherClient, Bundle } from '@jito-foundation/searcher-client';

// Create a Jito searcher client
const searcherClient = new JitoSearcherClient({
  url: 'https://api.searcher.jito.network',
  authToken: 'your_auth_token',
});

// Create transactions for your MEV strategy
const transaction1 = new Transaction().add(/* instructions */);
const transaction2 = new Transaction().add(/* instructions */);

// Sign transactions
const keypair = Keypair.fromSecretKey(/* your secret key */);
transaction1.sign(keypair);
transaction2.sign(keypair);

// Create a bundle
const bundle = new Bundle({
  transactions: [transaction1, transaction2],
  tipOptions: {
    tipLamports: 10000, // 0.00001 SOL tip
    spilloverPercentage: 0, // No spillover
  },
});

// Submit the bundle
const result = await searcherClient.submitBundle(bundle);
console.log(`Bundle submitted with ID: ${result.bundleId}`);
```

### Bundle Tips

Tips are payments to validators for including your bundle in a block. Higher tips increase the likelihood of inclusion, especially during periods of high demand. Tips are specified in SOL (lamports) and are deducted from your account balance.

## Common MEV Strategies

Using the Searcher API, you can implement various MEV strategies:

### Arbitrage

```javascript
// Example of a simple arbitrage bundle
const getArbitrageBundle = async (
  connection: Connection,
  keypair: Keypair,
  marketA: PublicKey,
  marketB: PublicKey,
  amount: number
) => {
  // Step 1: Buy token on market A
  const buyTx = createBuyTransaction(marketA, amount);
  
  // Step 2: Sell token on market B
  const sellTx = createSellTransaction(marketB, amount);
  
  // Sign transactions
  buyTx.sign(keypair);
  sellTx.sign(keypair);
  
  // Create a bundle with a tip
  const bundle = new Bundle({
    transactions: [buyTx, sellTx],
    tipOptions: {
      tipLamports: 100000, // 0.0001 SOL tip
      spilloverPercentage: 0,
    },
  });
  
  return bundle;
};
```

### Liquidations

```javascript
// Example of a liquidation bundle
const getLiquidationBundle = async (
  connection: Connection,
  keypair: Keypair,
  liquidationTarget: PublicKey,
  amount: number
) => {
  // Check if account is liquidatable
  const position = await fetchPosition(connection, liquidationTarget);
  if (!position.isLiquidatable) {
    return null;
  }
  
  // Create liquidation transaction
  const liquidateTx = createLiquidationTransaction(liquidationTarget, amount);
  liquidateTx.sign(keypair);
  
  // Create a bundle with a tip
  const bundle = new Bundle({
    transactions: [liquidateTx],
    tipOptions: {
      tipLamports: 500000, // 0.0005 SOL tip
      spilloverPercentage: 20, // Share 20% of profit with validators
    },
  });
  
  return bundle;
};
```

## Best Practices

For optimal results with the Searcher API:

1. **Efficient Bundles**: Keep bundles as small as possible to minimize fees
2. **Dynamic Tips**: Adjust tips based on network congestion and expected profit
3. **Error Handling**: Implement robust error handling for failed bundles
4. **Rate Limiting**: Respect API rate limits to avoid being throttled
5. **Monitor Results**: Track your bundle success rate and profitability

## Monitoring and Analytics

The Searcher API provides tools for monitoring your bundles:

```javascript
// Check the status of a submitted bundle
const bundleStatus = await searcherClient.getBundleStatus(bundleId);
console.log(`Bundle status: ${bundleStatus.status}`);

// Get your account balance
const balance = await searcherClient.getAccountBalance();
console.log(`Account balance: ${balance.balanceSol} SOL`);

// View recent transactions
const transactions = await searcherClient.getAccountTransactions({
  limit: 10,
});
console.log(`Recent transactions:`, transactions);
```

For detailed information about the Searcher API, refer to the [API Reference](/jitosol/mev/searcher-api-reference). 