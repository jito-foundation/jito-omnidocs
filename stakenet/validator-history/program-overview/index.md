---
title: Program Overview
order: 0
subtitle: 'On-chain validator data aggregation and historical tracking'
section_type: page
---

The Validator History Program is a foundational component of Jito StakeNet that creates an on-chain record of verified Solana validator data, storing up to 512 epochs of history per validator.

## What It Does

The program aggregates diverse validator metrics that are typically scattered across different data sources into a single, easily accessible on-chain account. This includes:

- **Runtime-accessible data**: validator performance history, validator commission, MEV commission
- **Gossip network data**: validator IP addresses, software versions, and client types  
- **Network position data**: total active stake per validator, stake rank, and superminority status

All these fields are consolidated into a single ValidatorHistory account per validator, enabling seamless composition with other on-chain programs while providing extensive historical lookback capabilities.

## Why It Matters

Before the Validator History Program, accessing comprehensive validator data required querying multiple disparate sources and APIs. This created friction for:

- **Stake pool managers** needing to evaluate validator performance over time
- **On-chain programs** requiring historical validator context for decision-making
- **Network participants** seeking transparent, verifiable validator metrics

By consolidating this data on-chain with a long historical record, the program enables more sophisticated validator selection algorithms and transparent network analysis.

## Role in StakeNet

The Validator History Program serves as the data foundation for StakeNet's autonomous operations.
The [Jito Steward Program](/stakenet/jito-steward/program-overview/) relies on this historical data to make informed staking decisions, using the comprehensive validator metrics to optimize stake allocation across the network.

## Core Accounts

The Validator History Program operates through three main account types:

- **Config**: Global configuration and admin authorities for the Validator History Program
- **ValidatorHistory**: Tracks historical metadata on-chain for a single validator using a circular buffer structure
- **ClusterHistory**: Stores network-wide cluster information and metrics

This architecture ensures efficient data storage while maintaining the flexibility needed for complex validator analysis and automated decision-making.
