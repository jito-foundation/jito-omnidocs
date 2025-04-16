---
title: "Proposal Voting"
description: "How to vote on governance proposals"
section_type: "page"
order: 20
domain: "governance"
---

# Proposal Voting

This guide explains the voting process for Jito governance proposals and how to participate as a token holder.

## Voting Basics

### Voting Power

Voting power in the Jito governance system is determined by:

- The number of JITO tokens you hold or have delegated to you
- The lock duration of your tokens (longer locks provide higher voting power)

The formula for calculating voting power is:

```
Voting Power = Token Amount × (1 + Lock Duration Bonus)
```

where the Lock Duration Bonus ranges from 0% (no lock) to 100% (maximum lock duration).

### Voting Options

When voting on a proposal, you typically have the following options:

- **Yes**: Approve the proposal
- **No**: Reject the proposal
- **Abstain**: Neither approve nor reject, but count towards quorum

## How to Vote

### 1. Connect Your Wallet

To vote on a proposal:

1. Go to [governance.jito.network](https://governance.jito.network)
2. Connect your wallet (Phantom, Solflare, etc.)
3. Navigate to the "Active Proposals" section

### 2. Review the Proposal

Before voting:

1. Read the complete proposal details
2. Review community discussions on the forum
3. Consider the potential impacts of the proposal

### 3. Cast Your Vote

To cast your vote:

1. Click on the proposal you want to vote on
2. Select your voting option (Yes, No, Abstain)
3. Confirm the transaction in your wallet

```javascript
// Example of voting on a proposal using the Jito SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { JitoGovernanceClient, VoteOption } from '@jito-foundation/governance-sdk';

const voteOnProposal = async (
  connection: Connection,
  voterKeypair: Keypair,
  proposalId: string,
  vote: VoteOption
) => {
  const governanceClient = new JitoGovernanceClient({
    connection,
    wallet: { publicKey: voterKeypair.publicKey, signTransaction: async (tx) => tx },
  });
  
  const result = await governanceClient.vote({
    proposalId,
    vote,
  });
  
  return result;
};
```

## Delegation

If you prefer not to vote directly, you can delegate your voting power to another address:

### Delegating Your Voting Power

1. Go to [governance.jito.network/delegate](https://governance.jito.network/delegate)
2. Connect your wallet
3. Enter the address you want to delegate to
4. Specify the amount to delegate
5. Confirm the transaction

```javascript
// Example of delegating voting power using the Jito SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { JitoGovernanceClient } from '@jito-foundation/governance-sdk';

const delegateVotingPower = async (
  connection: Connection,
  delegatorKeypair: Keypair,
  delegateeAddress: string,
  amount: number
) => {
  const governanceClient = new JitoGovernanceClient({
    connection,
    wallet: { publicKey: delegatorKeypair.publicKey, signTransaction: async (tx) => tx },
  });
  
  const result = await governanceClient.delegate({
    delegatee: new PublicKey(delegateeAddress),
    amount,
  });
  
  return result;
};
```

### Removing Delegation

You can remove your delegation at any time:

1. Go to [governance.jito.network/delegate](https://governance.jito.network/delegate)
2. Connect your wallet
3. Select "Remove Delegation"
4. Confirm the transaction

## Voting Rules

### Quorum

For a proposal to be valid, it must reach quorum, which is the minimum participation required:

- **Parameter Change Proposals**: 10% of total voting power
- **Program Upgrade Proposals**: 15% of total voting power
- **Treasury Expenditure Proposals**: 20% of total voting power
- **Text Proposals**: 5% of total voting power

### Voting Period

The standard voting period is 7 days. During this time, all eligible token holders can cast their votes.

### Approval Thresholds

Proposals must meet the following approval thresholds to pass:

- **Parameter Change Proposals**: >50% approval
- **Program Upgrade Proposals**: >66% approval
- **Treasury Expenditure Proposals**: >60% approval
- **Text Proposals**: >50% approval

## Viewing Results

You can view voting results in real-time:

1. Go to the proposal page
2. Check the current votes and percentages
3. See the remaining time in the voting period

After the voting period ends, the proposal is marked as "Passed" or "Rejected" based on the final tally.

## Governance Analytics

The governance portal provides analytics on voting patterns:

- **Voter Participation**: Percentage of total tokens that voted
- **Voting History**: Historical voting data for all proposals
- **Top Voters**: Most active participants in governance

These analytics help the community understand governance participation trends and identify areas for improvement. 