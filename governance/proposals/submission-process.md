---
title: "Proposal Submission Process"
description: "How to create and submit a governance proposal"
section_type: "page"
order: 10
domain: "governance"
---

# Proposal Submission Process

This guide explains how to create and submit a governance proposal in the Jito ecosystem.

## Proposal Types

The Jito governance system supports several types of proposals:

1. **Parameter Change**: Modify protocol parameters (e.g., tip distribution rates)
2. **Program Upgrade**: Deploy a new version of a protocol program
3. **Treasury Expenditure**: Allocate funds from the treasury
4. **Text Proposal**: Non-binding social consensus proposals
5. **Custom Action**: Specialized proposals with custom on-chain execution

## Proposal Requirements

To submit a proposal, you must meet the following requirements:

- Hold at least 10,000 JITO tokens or have them delegated to you
- Submit a proposal deposit of 1,000 JITO tokens (returned after the voting period if the proposal is not marked as spam)
- Provide a complete proposal document following the standard template

## Step-by-Step Submission Guide

### 1. Community Discussion

Before formal submission, discuss your idea with the community:

1. Post your idea in the [Jito Governance Forum](https://forum.jito.network)
2. Gather feedback and refine your proposal
3. Build community awareness and support

### 2. Draft Your Proposal

Create a formal proposal document using the standard template:

```markdown
# JIP-XX: [Title of Proposal]

## Summary
Brief 1-2 sentence summary of the proposal.

## Abstract
More detailed explanation (1-2 paragraphs).

## Motivation
Why this proposal is necessary or beneficial.

## Specification
Technical details of the implementation.

## Benefits
Expected benefits of the proposal.

## Risks
Potential risks and mitigation strategies.

## Timeline
Expected implementation timeline.

## Copyright
Copyright and license information.
```

### 3. Technical Review (If Applicable)

For technical proposals:

1. Create a pull request in the appropriate GitHub repository
2. Request review from the technical committee
3. Address feedback and make necessary adjustments

### 4. Formal Submission

Submit your proposal through the governance portal:

1. Go to [governance.jito.network](https://governance.jito.network)
2. Connect your wallet
3. Click "Create Proposal"
4. Fill in the required fields:
   - Title
   - Description
   - Link to forum discussion
   - Proposal type
   - Execution parameters (if applicable)
5. Submit the deposit

```javascript
// Example of creating a proposal using the Jito SDK
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { JitoGovernanceClient, ProposalType } from '@jito-foundation/governance-sdk';

const createParameterChangeProposal = async (
  connection: Connection,
  proposerKeypair: Keypair,
  title: string,
  description: string,
  parameterName: string,
  newValue: number
) => {
  const governanceClient = new JitoGovernanceClient({
    connection,
    wallet: { publicKey: proposerKeypair.publicKey, signTransaction: async (tx) => tx },
  });
  
  const proposal = await governanceClient.createProposal({
    title,
    description,
    proposalType: ProposalType.ParameterChange,
    parameters: {
      name: parameterName,
      value: newValue,
    },
  });
  
  return proposal;
};
```

### 5. Governance Review

After submission:

1. The governance council reviews the proposal for compliance
2. If approved, the proposal enters the voting phase
3. If rejected, feedback is provided for resubmission

## Proposal Lifecycle

Once submitted, your proposal goes through the following stages:

1. **Pending**: Initial review by the governance council
2. **Active**: Open for voting
3. **Passed/Rejected**: Final voting outcome
4. **Executed**: Implementation of passed proposals
5. **Expired**: Proposals that did not reach quorum

## Best Practices

- **Be Specific**: Clearly define what you're proposing and why
- **Provide Evidence**: Include data, research, or examples supporting your proposal
- **Consider Alternatives**: Discuss alternative approaches and why your solution is best
- **Engage with Feedback**: Be responsive to community questions and concerns
- **Technical Feasibility**: Ensure your proposal can be implemented as described

For examples of successful proposals, see the [Proposal Archive](/governance/proposals/archive). 