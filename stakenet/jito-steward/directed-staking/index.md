---
title: Directed Staking
order: 3
subtitle: 'How JitoSOL holders direct stake to specific validators'
section_type: page
---

# Directed Staking

Directed Staking, introduced in [JIP-27](https://forum.jito.network/t/jip-27-introduce-directed-staking-to-the-jito-stake-pool/903), allows whitelisted JitoSOL holders and DeFi protocols to specify which validators the stake underpinning their JitoSOL holdings is delegated to. Stake that is not directed continues to be delegated algorithmically by the Steward's [scoring system](/stakenet/jito-steward/validators/scoring-system/).

At a high level:

1. The DAO-controlled whitelist authority approves stakers (users or protocols) and the validators eligible to receive directed stake.
2. A whitelisted staker creates a **ticket** expressing their validator preferences as percentages of their JitoSOL balance.
3. Each epoch, an off-chain process aggregates all tickets and current JitoSOL balances into per-validator lamport **targets** and uploads them on-chain.
4. At the start of each epoch, the Steward state machine enters the **RebalanceDirected** state and moves stake toward those targets before performing any algorithmic (undirected) operations.

Because targets are recomputed from live JitoSOL balances every epoch, directed stake automatically scales up or down as a holder's JitoSOL balance changes — no re-submission is needed.

## Core Accounts

Three accounts power directed staking, all PDAs derived from the Steward `Config`:

### DirectedStakeWhitelist

Controls who can participate. It stores three lists:

- **Permissioned user stakers** (up to 2,048): individual wallets allowed to direct stake. Per JIP-27, initially holders of at least 100k JitoSOL.
- **Permissioned protocol stakers** (up to 2,048): DeFi protocols allowed to direct stake on behalf of their users.
- **Permissioned validators** (up to 5,000): validators eligible to receive directed stake.

Only the `directed_stake_whitelist_authority` can add or remove entries.

### DirectedStakeTicket

One ticket per staker, derived from the staker's pubkey (`ticket_update_authority`). A ticket holds up to **8 validator preferences**, each a validator vote account and a `stake_share_bps` (basis points of the holder's JitoSOL balance). The preferences must sum to at most 10,000 bps (100%); any unallocated share remains algorithmically staked. Every validator referenced in a ticket must be on the whitelist.

Tickets can be created, updated, or closed at any time by the ticket's update authority (or by the `directed_stake_ticket_override_authority` on the holder's behalf).

### DirectedStakeMeta

The aggregation account consumed by the state machine. For each target validator it tracks:

- `total_target_lamports`: the directed stake the validator should have, recomputed each epoch.
- `total_staked_lamports`: the directed stake currently applied to the validator.
- The epochs when the target and applied amounts were last updated, which serve as per-epoch progress markers for rebalancing.

It also tracks `directed_unstake_total`, the amount of directed unstaking performed in the current scoring cycle, used to enforce the unstake cap.

## Epoch Lifecycle

### 1. Target computation (off-chain)

Each epoch, the keeper run by the `directed_stake_meta_upload_authority`:

1. Loads all `DirectedStakeTicket` accounts.
2. Reads each ticket authority's current JitoSOL balance.
3. Converts each preference into lamports: `JitoSOL balance × stake_share_bps / 10,000`, multiplied by the current JitoSOL/SOL conversion rate.
4. Sums the allocations per validator and uploads one `CopyDirectedStakeTargets` instruction per validator to update the `DirectedStakeMeta`.

### 2. RebalanceDirected (on-chain)

After stake pool updates and epoch maintenance complete at the start of each epoch, the state machine enters the `RebalanceDirected` state — before any undirected operations. One permissionless `rebalance_directed` instruction is cranked per target validator, comparing its applied directed stake against its target:

- **Increase** (applied < target): the validator receives a pro-rata share of the reserve, proportional to its deficit relative to the total deficit across all targets. Increases are capped at the validator's deficit so it is never over-delegated, and the reserve always retains 2× the stake-account rent.
- **Decrease** (applied > target): the excess is unstaked, subject to the cycle-wide directed unstake cap (see below). If total excess across all targets exceeds the remaining cap headroom, decreases are applied pro-rata.
- Rebalances below the minimum stake delegation are skipped to avoid creating invalid transient stake accounts.

Before each rebalance, the instruction also reconciles external activity: stake deposits to a validator are credited against its directed deficit, and user withdrawals reduce directed accounting first, rolling any remainder over to undirected stake.

The state is complete once every target validator has been processed for the epoch. If directed rebalancing is not finished by the epoch midpoint (the `compute_score_epoch_progress` threshold, 50%), the state machine moves on so that undirected operations are never stalled.

## Safeguards

Directed staking operates under several protections to preserve pool yield and health:

| Safeguard | Mechanism |
| --------- | --------- |
| Directed unstake cap | At most `directed_stake_unstake_cap_bps` (currently 1000 bps = 10%) of total pool lamports can be unstaked per scoring cycle to move validators down toward lower targets. Prevents yield drag from mass redirections. |
| Undirected stake ceiling | `undirected_stake_ceiling_lamports` caps the size of the undirected (algorithmic) portion of the pool during regular rebalancing. Currently set to `u64::MAX`, i.e. disabled. |
| Validator eligibility | Only whitelisted validators can receive directed stake, and only whitelisted stakers can direct it. |
| No over-delegation | Increases are capped at each validator's target delta, preventing stake that would immediately need to be unstaked. |
| Epoch deadline | Directed rebalancing that isn't complete by 50% epoch progress is force-completed so undirected stake management continues uninterrupted. |

## Authorities

Directed staking adds three authorities to the Steward `Config`, all ultimately governed by the [Jito DAO](https://gov.jito.network/dao/Jito):

| Authority | Capability |
| --------- | ---------- |
| `directed_stake_whitelist_authority` | Adds/removes stakers, protocols, and validators on the whitelist |
| `directed_stake_meta_upload_authority` | Uploads per-validator lamport targets to the `DirectedStakeMeta` each epoch |
| `directed_stake_ticket_override_authority` | Can create and update tickets on behalf of ticket holders |

Additionally, the Steward `admin` can execute a one-time `migrate_directed_to_algorithmic` instruction, which zeroes all directed targets and reclassifies existing directed stake as algorithmic without unstaking anything.

## Governance

- [JIP-27](https://forum.jito.network/t/jip-27-introduce-directed-staking-to-the-jito-stake-pool/903) introduced directed staking to the JitoSOL stake pool.
- [JIP-33](https://forum.jito.network/t/jip-33-a-jito-x-coinbase-collaboration/923) directs stake to Coinbase-operated validators under the JIP-27 framework.

See [StakeNet Governance](/stakenet/governance/) for summaries.

## For Developers

- Ticket, whitelist, and target management commands are documented in the [Steward CLI Guide](/stakenet/jito-steward/developers/cli/).
- Program source: [directed_stake.rs (state)](https://github.com/jito-foundation/stakenet/blob/master/programs/steward/src/state/directed_stake.rs) and [directed_delegation.rs (rebalance math)](https://github.com/jito-foundation/stakenet/blob/master/programs/steward/src/directed_delegation.rs).
