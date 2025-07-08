---
title: Key Features & Capabilities
order: 1
subtitle: ''
section_type: page
---

The Validator History Program provides features designed to make validator data accessible, reliable, and actionable.

## Historical Data Persistence

**512 Epochs of History**:
    Each validator's historical data spans up to [512 epochs](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L105), providing approximately 3 years of performance history.

**Circular Buffer Architecture**:
    Data is stored using an efficient [circular buffer](https://github.com/jito-foundation/stakenet/blob/7ea745985c2e31d43d957ac5885e69b328b6f283/programs/validator-history/src/state.rs#L107-L114) that automatically manages storage space.
    As new epochs are added, the oldest data is overwritten, maintaining a consistent account size while preserving the most relevant historical information.

## Comprehensive Data Aggregation

Rather than requiring multiple API calls across different data sources, the Validator History Program consolidates all key validator metrics into a single account:

**Performance Metrics**
- Vote credits and block production history
- Skip rates and consensus participation
- Historical uptime and reliability scores

**Economic Data**
- Commission rate changes over time
- MEV commission tracking
- Stake rewards and distributions

**Network Participation**
- Gossip network data (IP addresses, ports)
- Software version history
- Client type

**Stake Information**
- Total active stake per epoch
- Validator ranking within the network
- Superminority status tracking

## Single Account Access

**Simplified Integration**: 
    Developers can access all validator data through a single ValidatorHistory account, eliminating the complexity of querying multiple data sources.
    This design enables seamless integration with other on-chain programs.

**Composability**:
    The unified account structure allows other programs, like the Jito Steward Program, to easily incorporate historical validator data into their decision-making algorithms without additional infrastructure.

## On-Chain Verification & Transparency

**Verifiable Data**:
    All validator information is stored on-chain and can be independently verified through standard Solana RPC calls.
    This transparency builds trust and enables permissionless access to validator performance data.

**Immutable History**:
    Once written to the blockchain, historical data cannot be altered, providing a reliable and tamper-proof record of validator performance over time.

## Developer-Friendly Architecture

**Zero-Copy Design**:
    The program uses zero-copy account structures that allow efficient initialization of large data spaces without hitting runtime memory limits.
    This enables the storage of extensive historical data while maintaining performance.

**Well-Defined Structures**: 
    Clear data structures and access patterns make it easy for developers to integrate validator history into their applications and programs.

## Automated Data Collection

**Epoch-Based Updates**:
    Data is automatically collected and updated each epoch, ensuring that the historical record stays current without manual intervention.

**Multi-Source Integration**:
    The program seamlessly combines data from Solana's runtime, gossip network, and other verifiable sources into a cohesive historical record.

These features work together to create a robust foundation for validator analysis, enabling sophisticated staking strategies and transparent network monitoring across the Solana ecosystem.
