---
title: Operators
order: 20
subtitle: 'Infrastructure providers that run NCN software and manage delegated assets in the Jito Restaking ecosystem'
section_type: page
---

## What is an Operator?

An **Operator** is an entity responsible for running Node Consensus Network (NCN) software and managing delegated assets from vaults. Operators serve as the infrastructure providers in the Jito Restaking ecosystem, executing the actual work required by NCNs while being held accountable through economic incentives and slashing mechanisms.

Operators are infrastructure providers that run the offchain services for NCNs and are delegated stake. They opt in to serve specific NCNs and receive stake from approved vaults. Operators have no direct control of the stake and they are usually rewarded in proportion to the stake they have. Operators can serve multiple NCNs simultaneously, enabling efficient resource usage and shared security.

## Key Responsibilities

- **NCN Software Execution**: Run and maintain software for various NCNs they opt into
- **Asset Management**: Manage delegated assets from vaults with proper security measures  
- **Fee Collection**: Earn fees (in basis points) for providing services to NCNs
- **Slashing Risk**: Accept slashing risk for misbehavior or poor performance
- **Offchain Services**: Execute the offchain service and protocol designed by the NCN, including generating ZK proofs, querying external APIs, performing computations, or validating event data
- **Vote Submission**: Cast signed votes for specific results to the NCN's onchain program during consensus cycles
- **Performance Requirements**: Stay online and responsive throughout each consensus cycle, maintaining uptime, correctness, and participation as required by each NCN

## Operator Account Structure

The Operator account stores global metadata and configuration:

| Field | Type | Description |
|-------|------|-------------|
| `base` | Pubkey | Base account used as PDA seed |
| `admin` | Pubkey | Primary administrator with full control |
| `ncn_admin` | Pubkey | Admin for managing NCN relationships |
| `vault_admin` | Pubkey | Admin for managing vault relationships |
| `delegate_admin` | Pubkey | Admin for asset delegation operations |
| `metadata_admin` | Pubkey | Admin for updating operator metadata |
| `voter` | Pubkey | Key used for signing NCN transactions |
| `index` | u64 | Unique operator index |
| `ncn_count` | u64 | Number of associated NCNs |
| `vault_count` | u64 | Number of associated vaults |
| `operator_fee_bps` | u16 | Operator fee in basis points |

### Finding Operator PDA

```rust
use jito_restaking_core::operator::Operator;

let program_id = jito_restaking_program::id();
let base_pubkey = pubkey!("base pubkey here");
let operator_pubkey = Operator::find_program_address(&program_id, &base_pubkey).0;
```

## Admin Role Separation

Operators use role-based access control for security:

- **Primary Admin**: Full control over the operator account
- **NCN Admin**: Can add/remove NCN support and manage NCN relationships
- **Vault Admin**: Can add/remove vault support and manage vault relationships  
- **Delegate Admin**: Can delegate assets from operator token accounts
- **Metadata Admin**: Can update operator metadata and configuration
- **Voter**: Can sign transactions for NCN interactions

## Relationship Management

Operators participate in a mutual opt-in system where all connections between NCNs, vaults, and operators must be explicitly approved by each party. This ensures no forced connections and creates a modular, flexible system.

### Vault Relationships (OperatorVaultTicket)
Operators create **OperatorVaultTickets** to establish relationships with vaults:
- Operators opt into vaults they want to receive delegation from
- Tickets track the state of the relationship (inactive, warming up, active, cooling down)
- Only the operator's `vault_admin` can manage these relationships
- This ticket represents the relationship between an Operator and a Vault, created by the Operator to opt in to work with a Vault

### NCN Relationships (NcnOperatorState) 
Operators participate in **NcnOperatorState** for mutual opt-in with NCNs:
- Both the NCN and operator must opt into each other
- Enables operators to provide services to specific NCNs
- Managed through the operator's `ncn_admin` role
- This state represents the mutual opt-in relationship between an NCN and an Operator
- The NCN initializes this state, then both NCN and operator can warm-up and cooldown the state to show support for each other

## Operator Operations

### Offchain Execution
Operators execute the core work required by NCNs offchain, which may include:
- Generating zero-knowledge proofs
- Querying external APIs for data feeds
- Performing complex computations
- Validating event data from external sources
- Processing and transforming data according to NCN requirements

### Voting and Consensus
- Operators cast signed votes for specific results to the NCN's onchain program
- Voting power is weighted by the amount of stake delegated to them from vaults
- Votes are submitted onchain during consensus cycles
- Finalized results require reaching a threshold of weighted agreement
- The NCN program is responsible for tallying votes and determining consensus

### Rewards and Penalties
- Operators are rewarded based on performance including uptime, correctness, and participation
- Rewards are distributed based on stake-weighted performance
- Operators earn fees based on their `operator_fee_bps` setting
- Subject to slashing for misbehavior, poor performance, missed votes, invalid data submission, or malicious behavior
- Economic incentives ensure operators remain aligned with protocol requirements

## Operator Lifecycle

### 1. Registration and Initialization
```rust
// Find operator PDA
let operator_pubkey = Operator::find_program_address(&program_id, &base_pubkey).0;
```

The operator registration process involves:
- Creating an operator account through the restaking program
- Setting initial configuration including operator fee (in basis points)
- Establishing admin roles for different operational aspects
- Registering with a unique operator index

### 2. Vault Opt-in and Warmup
- Create OperatorVaultTicket to signal interest in a vault
- Warmup period before relationship becomes active (lasts for one full epoch)
- Begin receiving delegated assets from the vault once active
- Vault must also opt into the operator for the relationship to activate

### 3. NCN Participation
- Opt into NCNs to provide services through NcnOperatorState
- Both NCN and operator must mutually opt in
- Run required NCN software infrastructure
- Participate in consensus cycles through voting
- Earn fees based on `operator_fee_bps` setting

### 4. Active Operations
- Execute offchain services as specified by each NCN
- Submit votes during consensus cycles
- Maintain performance standards (uptime, correctness, participation)
- Manage delegated assets using `delegate_admin` role
- Handle relationship states through appropriate admin roles

### 5. Relationship Management
- Use `vault_admin` to manage vault relationships
- Use `ncn_admin` to manage NCN relationships  
- Cooldown periods when opting out of relationships
- Ability to serve multiple NCNs simultaneously for resource efficiency

## Economic Model

### Fee Structure
- Operators set fees in basis points (`operator_fee_bps`)
- Fees are earned for providing services to NCNs
- Rewards distributed based on stake-weighted performance
- Fee structure incentivizes quality service provision

### Stake Delegation
- Operators receive delegated stake from vaults but have no direct control over it
- Stake delegation enables voting power in NCN consensus
- Operators are economically incentivized through stake-weighted rewards
- Risk of slashing provides accountability mechanism

### Multi-NCN Operations
- Operators can serve multiple NCNs simultaneously
- Enables efficient resource usage and shared security model
- Same stake can secure multiple services through different NCNs
- Operators benefit from diversified service provision

## Administrative Configuration

Operators can configure several variables through the restaking program:
- Add and remove support for vaults through OperatorVaultTickets
- Add and remove support for NCNs through NcnOperatorState
- Change voter keys for NCN transaction signing
- Update operator fee structure
- Manage admin role assignments
- Withdraw funds sent to the operator from rewards, airdrops, and other sources

## Security Considerations

### Role-Based Access Control
- Separation of admin responsibilities reduces single point of failure risk
- Different keys for different operational aspects enhance security
- Primary admin maintains overall control while delegating specific functions

### Slashing Protection
- Operators accept slashing risk as part of their service provision
- Economic incentives ensure proper behavior and performance
- Slashing mechanisms (currently in development) will penalize misbehavior

### Relationship Validation
- Mutual opt-in requirements prevent forced connections
- Warmup and cooldown periods provide protection against rapid changes
- Transparent onchain relationship management ensures accountability