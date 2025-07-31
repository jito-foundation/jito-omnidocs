---
title: 'Technical FAQs'
subtitle: 'Technical questions about JitoSOL mechanics and implementation'
section_type: 'page'
order: 2
---

## JitoSOL Token Mechanics

**Q: How is the JitoSOL exchange rate calculated?**

The JitoSOL exchange rate can be calculated using the standard SPL stake pool formula:

```
Exchange Rate = Total Pool Lamports / Pool Token Supply
```

Where:
- **Total Pool Lamports**: The total amount of SOL staked in the pool (including accumulated rewards)
- **Pool Token Supply**: The total supply of JitoSOL tokens in circulation

As staking and MEV rewards accumulate in the pool, the total pool lamports increase while the token supply remains constant, causing the exchange rate to appreciate over time.

**Q: When exactly do rewards get distributed to JitoSOL holders?**

JitoSOL holders receive rewards automatically through the appreciating exchange rate rather than direct token distributions:

**Staking Rewards:**
- Distributed by the Solana protocol at each epoch boundary (approximately every 2 days)
- As stakes earn rewards, the pool and pool tokens grow proportionally in value
- The SPL stake pool program automatically incorporates these rewards into the total pool lamports

**MEV Rewards:**
- MEV rewards are handled by the TipRouter system at epoch boundaries
- At the end of every epoch, a state snapshot is taken of the last slot in an epoch. A script generates a merkle tree which contains information about the amount of MEV distributed to a validator and their stakers on a pro-rata basis
- Each TipRouter operator calculates the merkle tree to produce merkle root then cast vote with produced merkle root. After consensus reached with more than 2/3, the cranker can upload the merkle tree from which claims can be made against

**Q: Can the JitoSOL exchange rate ever go down?**

Under normal circumstances, the JitoSOL exchange rate should only increase as rewards accumulate. However, theoretically it could decrease in extreme scenarios:

- **Validator Slashing**: If validators in the pool are slashed for malicious behavior (though slashing does not really exist right now on Solana)
- **Smart Contract Issues**: Critical bugs in the stake pool program (mitigated by multiple security firms have audited the stake pool program to ensure total safety of funds)

The StakeNet system provides additional protection by automatically removing underperforming or malicious validators from the pool.

## Validator Management

**Q: How does Jito select which validators to delegate to?**

Jito uses **StakeNet**, an automated validator selection system with transparent on-chain criteria:

**Binary Requirements (must meet ALL):**
- Run the Jito MEV-enabled client (have MEV commission in the last 10 epochs)
- MEV commission ≤ 10% (evaluated over the last 10 epochs)
- Validator commission ≤ 5% (evaluated over the last 30 epochs)
- Historical commission ≤ 50% (across all validator history)
- Not belong to the validator superminority (top 33.3% of total stake)
- Not run unsafe consensus modifications
- Not blacklisted by governance
- Maintain ≥ 5 epochs of continuous voting with ≥ 5,000 SOL minimum stake
- Vote on ≥ 85% of expected slots (evaluated over the last 30 epochs)

**Scoring Formula:**
```
yield_score = (average_vote_credits / average_blocks) * (1 - commission)
```

Where:
- `average_vote_credits` = vote credits earned over the last 30 epochs
- `average_blocks` = total blocks produced by the cluster over the last 30 epochs  
- `commission` = maximum commission over the last 30 epochs (as decimal, e.g., 0.05 for 5%)

The top 200 validators by overall score are selected for delegation in each 10-epoch cycle.

**Q: What happens if a validator in the Jito pool performs poorly?**

The StakeNet system automatically handles underperforming validators:

**Performance-based Rebalancing (every 10 epochs):**
- Maximum 7.5% of total pool can be unstaked per cycle
- Priority given to removing stake from lowest-performing validators

**Instant Unstaking Triggers (evaluated each epoch):**
- **Delinquency**: Voting on <70% of expected slots
- **Commission manipulation**: Increasing above 5% validator or 10% MEV commission
- **Blacklist addition** by governance
- Maximum 10% of total pool can be instantly unstaked per epoch

**Q: How often does Jito rebalance stake between validators?**

- **Regular Rebalancing**: Every 10 epochs (approximately 20-30 days)
- **Instant Unstaking**: Evaluated every epoch for critical issues
- **Target Allocation**: Each selected validator gets 1/200th of the total pool
- **Safety Caps**: Various limits protect against excessive stake movement

## MEV and Priority Fee Distribution

**Q: How are MEV and priority fee rewards calculated and distributed?**

Both MEV and priority fee rewards flow through the **TipRouter** system:

**Collection Process:**
1. **MEV Tips**: Block builders and searchers pay tips to validators for transaction inclusion
2. **Priority Fees**: TipRouter now distributes priority fees (commonly referred to as block rewards) to stakers
3. **Accumulation**: Tips accumulate in designated accounts during each epoch

**Distribution Process:**
1. **Snapshot**: TipRouter operators take a snapshot of Solana validator and stake accounts at the end of the last slot of each epoch
2. **Calculation**: Operators calculate the distribution split:
   - **MEV**: 97% to validators/stakers, 3% protocol fee
   - **Priority Fees**: 1.5% fee on priority fee distributions, split between LST vault operators (5%), JTO vault operators (5%), and the Jito DAO (90%)
3. **Consensus**: TipRouter operators submit the merkle root of the tree to a BallotBox. Once quorum is reached, the winning merkle root is set
4. **Execution**: Rewards are distributed via merkle trees for gas-efficient claiming

**Q: Why do MEV rewards vary between epochs?**

MEV rewards fluctuate based on:
- **Network Activity**: More transaction volume = higher MEV opportunities
- **Market Conditions**: Volatility creates arbitrage and liquidation opportunities
- **Searcher Competition**: More searchers bidding = higher tips
- **Protocol Adoption**: DeFi activity drives MEV generation
- **Seasonal Patterns**: Trading patterns vary by time and market cycles

**Q: How can I track my MEV rewards separately from staking rewards?**

You can track MEV rewards using several methods:

**Jito Rewards Interface:**
- Visit [jito.network/staking/?mode=rewards_view](https://www.jito.network/staking/?mode=rewards_view)
- Shows **YTD Estimated MEV Rewards** as a separate metric from total rewards
- Displays cumulative MEV rewards over different timeframes (7d, 30d, 180d, 1y, YTD, All)
- Export options available for CSV downloads with MEV breakdowns

**Key Limitations:**
- Values are approximate and for informational purposes only
- Does not account for JitoSOL used in DeFi protocols
- MEV rewards fluctuate significantly between epochs based on network activity

**MEV Rewards API (Advanced Users):**
- **Base URL**: `https://kobe.mainnet.jito.network`
- **Staker Rewards Endpoint**: `/api/v1/staker_rewards` - Individual claimable MEV amounts
- **Validator Rewards Endpoint**: `/api/v1/validator_rewards` - Aggregated MEV revenue data

For most users, the rewards interface provides sufficient MEV tracking.

## Smart Contract and Technical Details

**Q: What is the JitoSOL token contract address?**

**JitoSOL Token Address:** `J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn`

**Additional Details:**
- **Stake Pool Address:** `Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb`
- **Token Program:** SPL Token Program (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
- **Decimals:** 9
- **Token Standard:** SPL Token

You can verify this information on [Solscan](https://solscan.io/token/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn) or [Solana Explorer](https://explorer.solana.com/address/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn).

**Q: Is JitoSOL compatible with all Solana wallets and dApps?**

Yes, JitoSOL is a standard SPL token and is compatible with:

- **All Solana Wallets**: Phantom, Solflare, Backpack, Ledger, etc.
- **DeFi Protocols**: Can be used in lending, DEXs, yield farming
- **Bridges**: Supported for cross-chain transfers via Wormhole NTT
- **Custodial Services**: Compatible with institutional custody solutions

The only requirement is that the wallet/dApp supports SPL tokens, which is standard across the Solana ecosystem.

**Q: How does the underlying stake pool program work?**

JitoSOL is built on Solana Labs' audited Stake Pool program (SPL):

- **Aggregation**: Pools together SOL to be staked by a manager, allowing SOL holders to stake and earn rewards without managing stakes
- **Delegation**: Automatically distributes stake across selected validators using StakeNet
- **Token Minting**: Users deposit SOL in exchange for SPL tokens (staking derivatives) that represent their ownership in the stake pool
- **Reward Handling**: As stakes earn rewards, the pool and pool tokens grow proportionally in value
- **Withdrawal**: Allows conversion back to SOL through unstaking or burning tokens

The program is battle-tested and used by multiple liquid staking protocols on Solana.

## Integration Questions

**Q: Can I use JitoSOL as collateral in lending protocols?**

Yes, JitoSOL is widely accepted as collateral in major Solana lending protocols:

- **Supported Protocols**: Most major Solana lending platforms accept JitoSOL
- **Loan-to-Value**: Typically competitive with other liquid staking tokens
- **Liquidation Risk**: Standard liquidation mechanics apply based on JitoSOL price
- **Rewards**: You continue earning staking+MEV rewards while using as collateral

Always check the specific protocol's documentation for current LTV ratios and supported assets.

**Q: Are there any restrictions on transferring JitoSOL?**

No, JitoSOL transfers freely like any SPL token:

- **No Lock-ups**: Unlike direct staking, no waiting periods for transfers
- **No Minimum Amounts**: Can transfer any amount
- **Cross-wallet**: Transfer between any Solana wallets
- **Programmatic**: Full support for automated/smart contract transfers

## Advanced Topics

**Q: How does the Interceptor mechanism work technically?**

The **Jito Interceptor** protects against "toxic flow" during stake account deposits using an on-chain program that controls the stake pool's deposit authority:

**Program Architecture:**
- **Deposit Authority**: Interceptor program becomes the `stake_deposit_authority` of the JitoSOL stake pool
- **Deposit Receipts**: Creates on-chain receipt accounts (PDAs) tracking each deposit with timestamp and amount
- **Temporary Vault**: Holds minted JitoSOL tokens in a program-controlled account during cooldown

**Technical Flow:**
1. **Intercept**: When users deposit stake accounts, program mints JitoSOL but holds it in vault
2. **Time Lock**: On-chain timestamp enforcement prevents early claims for 10 hours (36,000 seconds)
3. **Fee Calculation**: Early claim fee decreases linearly from ~10% to 0% over the cooldown period
4. **Automatic Claim**: Cranker service automatically delivers JitoSOL after cooldown with no fees

This creates an economic moat around JitoSOL's liquidity while maintaining full on-chain transparency and decentralization.

**Q: What are the differences between direct unstaking and selling on Jupiter?**

| Aspect | Direct Unstaking | Jupiter Trading |
|--------|------------------|-----------------|
| **Speed** | Up to 1 epoch (~2-3 days max) | Instant |
| **Fee** | 0.1% fixed | Market spread (variable) |
| **Process** | Multi-step (deactivate + withdraw) | Single transaction |
| **Slippage** | None (exact rate) | Possible on large trades |
| **Destination** | SOL only | Any supported token |
| **Requirements** | Epoch waiting period | Sufficient liquidity |

Most users prefer Jupiter for convenience, while direct unstaking is better for very large amounts or fee optimization.

**Q: How does JitoSOL maintain its peg to SOL?**

JitoSOL doesn't maintain a fixed peg, it appreciates against SOL as rewards accumulate:

- **Exchange Rate Growth**: Designed to increase over time as rewards accrue
- **Arbitrage Mechanisms**: Price differences between DEXs and direct unstaking create arbitrage opportunities
- **Liquidity Provision**: Deep liquidity pools on Jupiter and other DEXs help maintain efficient pricing
- **Redemption Backstop**: Direct unstaking always available at exact on-chain rate

**Q: How does StakeNet ensure decentralization and transparency?**

**On-Chain Decision Making:**
- All validator selection logic runs on-chain via the Steward Program
- Validator performance data stored on-chain via the Validator History Program
- All parameters and decisions are publicly verifiable

**Community Governance:**
- All system parameters can be adjusted through Jito DAO governance
- Changes require community consensus before implementation

**Decentralized Execution:**
- Multiple independent keepers can execute the system's decisions
- No single point of failure in the operational layer
- Anyone can run a keeper to help maintain the system

**Transparency Tools:**
- Current parameters viewable at [jito.network/stakenet/steward/config](https://www.jito.network/stakenet/steward/config)
- Event API: `https://kobe.mainnet.jito.network/api/v1/steward_events`
- Real-time validator selection and scoring visible on-chain


