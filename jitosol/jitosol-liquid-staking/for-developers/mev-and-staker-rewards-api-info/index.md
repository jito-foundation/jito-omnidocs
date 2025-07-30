---
title: 'MEV Rewards & Claims API'
order: 5
section_type: 'page'
subtitle: 'Individual reward claims, validator commissions, and distribution mechanics'
---

# MEV Rewards API Documentation

## Overview

The MEV Rewards API provides access to Maximal Extractable Value (MEV) and priority fee rewards distributed through the Jito network. The API offers two main endpoints for querying rewards data for different participants in the ecosystem.

## What are MEV Rewards?

**MEV (Maximal Extractable Value)** refers to the additional profit that validators can earn by reordering, including, or excluding transactions within the blocks they produce.

## What are Priority Fee Rewards?

**Priority Fees** are additional fees that users pay to prioritize their transactions. These fees are distributed between validators and their stakers similar to MEV rewards.

---

## API Endpoints

### 1. Staker Rewards

**Purpose**: Retrieve individual claimable MEV and priority fee rewards from the tip distribution merkle trees. This includes both:
- Rewards claimable by actual stakers (delegators) who have staked SOL with validators  
- Rewards claimable by validators for their own commission portion (when they act as their own claimant)

**Key Insight**: When `stake_authority` and `withdraw_authority` are both the system program (`11111111111111111111111111111111`), and `claimant` equals `validator_vote_account`, these are validator self-rewards for their commission.

**Endpoint**: `/api/v1/staker_rewards`  
**Method**: `GET` or `POST`  
**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `stake_authority` | string | No | - | Filter by stake authority public key |
| `validator_vote_account` | string | No | - | Filter by validator vote account public key |
| `epoch` | number | No | - | Filter by specific epoch |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 100 | Results per page (max: 10,000) |
| `sort_order` | string | No | "desc" | Sort order: "asc" or "desc" |

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `claimant` | string | The public key that can claim these rewards |
| `stake_authority` | string | The authority that controls the stake account (system program for validator self-rewards) |
| `withdraw_authority` | string | The authority that can withdraw from the stake account (system program for validator self-rewards) |
| `validator_vote_account` | string | The vote account of the validator these rewards came from |
| `claim_status_account` | string | Account tracking the claim status for MEV rewards |
| `priority_fee_claim_status_account` | string | Account tracking the claim status for priority fee rewards (may be null) |
| `epoch` | number | The epoch when these rewards were earned |
| `amount` | number | MEV reward amount in lamports |
| `priority_fee_amount` | number | Priority fee reward amount in lamports (may be null) |

#### Example Request

```bash
curl "https://kobe.mainnet.jito.network/api/v1/staker_rewards?limit=2"
```

#### Example Response

```json
{
  "rewards": [
    {
      "claimant": "DdCNGDpP7qMgoAy6paFzhhak2EeyCZcgjH7ak5u5v28m",
      "stake_authority": "11111111111111111111111111111111",
      "withdraw_authority": "11111111111111111111111111111111",
      "validator_vote_account": "DdCNGDpP7qMgoAy6paFzhhak2EeyCZcgjH7ak5u5v28m",
      "epoch": 824,
      "amount": 348145740523,
      "claim_status_account": "DQ3CwqPPCkRqkDyNvMMhNW5i5HJhQ733XoTez3BWkCBS",
      "priority_fee_amount": null,
      "priority_fee_claim_status_account": null
    },
    {
      "claimant": "9QU2QSxhb24FUX3Tu2FpczXjpK3VYrvRudywSZaM29mF",
      "stake_authority": "11111111111111111111111111111111",
      "withdraw_authority": "11111111111111111111111111111111",
      "validator_vote_account": "9QU2QSxhb24FUX3Tu2FpczXjpK3VYrvRudywSZaM29mF",
      "epoch": 824,
      "amount": 242405379963,
      "claim_status_account": "2Ykg9QPDqAXkNk4ChTcLKKEaiAp3WVra5Kqeozt1T5EW",
      "priority_fee_amount": null,
      "priority_fee_claim_status_account": null
    }
  ],
  "total_count": 0
}
```

*Note: This example shows validator self-rewards. Delegator leaves look identical except `stake_authority` / `withdraw_authority` will be real stake-account keys and `claimant` will **not** equal the validator vote account.*

---

### 2. Validator Rewards

**Purpose**: Retrieve aggregated MEV and priority fee rewards data per validator. This provides a high-level summary of each validator's performance including total revenue, commission rates, and number of stakers.

**Key Difference**: Unlike staker rewards which show individual claimable amounts, this endpoint aggregates data to show totals per validator.

**Endpoint**: `/api/v1/validator_rewards`  
**Method**: `GET` or `POST`  
**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vote_account` | string | No | - | Filter by validator vote account public key |
| `epoch` | number | No | - | Filter by specific epoch |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 100 | Results per page (max: 10,000) |
| `sort_order` | string | No | "desc" | Sort order: "asc" or "desc" |

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `vote_account` | string | The validator's vote account public key |
| `mev_revenue` | number | Total MEV revenue earned in lamports |
| `mev_commission` | number | MEV commission rate in basis points (bps) |
| `num_stakers` | number | Number of stakers delegated to this validator |
| `epoch` | number | The epoch when these rewards were earned |
| `claim_status_account` | string | Account tracking the claim status for MEV rewards |
| `priority_fee_commission` | number | Priority fee commission rate in basis points (bps) |
| `priority_fee_revenue` | number | Total priority fee revenue earned in lamports |

#### Example Request

```bash
curl "https://kobe.mainnet.jito.network/api/v1/validator_rewards?epoch=678&limit=2"
```

#### Example Response

```json
{
  "rewards": [
    {
      "vote_account": "he1iusunGwqrNtafDtLdhsUQDFvo13z9sUa36PauBtk",
      "mev_revenue": 934451876628,
      "mev_commission": 0,
      "priority_fee_revenue": 0,
      "priority_fee_commission": null,
      "num_stakers": 13222,
      "epoch": 678,
      "claim_status_account": "2aT6uw4FAnMr32JJLEQf5xDALHFcHTJDBBQKwsZfgsUa"
    },
    {
      "vote_account": "CvSb7wdQAFpHuSpTYTJnX5SYH4hCfQ9VuGnqrKaKwycB",
      "mev_revenue": 922545272656,
      "mev_commission": 2500,
      "priority_fee_revenue": 0,
      "priority_fee_commission": null,
      "num_stakers": 558,
      "epoch": 678,
      "claim_status_account": "BJKb86G3Ed3B7Mz1cdsEB49u5d1mjehGpK6fxoKofFZa"
    }
  ],
  "total_count": 1083
}
```

---

## Key Differences Between Endpoints

### Staker Rewards vs Validator Rewards

| Aspect | Staker Rewards | Validator Rewards |
|--------|---------------|-------------------|
| **Data Granularity** | Individual claimable amounts | Aggregated totals per validator |
| **What it shows** | Each specific reward claim from merkle trees | Summary statistics per validator |
| **Use case** | Finding specific claims, tracking individual rewards | Validator performance analysis, commission rates |
| **Includes** | Both delegator rewards AND validator self-rewards | Only validator-level aggregates |
| **Commission info** | Not included | Commission rates and revenue splits |

### Understanding Validator Self-Rewards

In the staker rewards endpoint, when you see:
- `claimant` = `validator_vote_account` 
- `stake_authority` = `withdraw_authority` = `11111111111111111111111111111111` (system program)

This indicates the validator claiming their own portion of MEV rewards.

### Reward Distribution Flow

1. **MEV Tips Generated**: Searchers submit bundles with tips to validators
2. **Merkle Tree Creation**: Tips are distributed via merkle trees to eligible claimants
3. **Staker Rewards Endpoint**: Shows individual entries from these merkle trees (one per claimant)
4. **Validator Rewards Endpoint**: Shows aggregated view with total revenue and commission data

---

## Important Notes

### Commission Rates
- **MEV Commission**: Percentage of MEV rewards that the validator keeps (rest goes to stakers)
- **Priority Fee Commission**: Percentage of priority fee rewards that the validator keeps
- Rates are expressed in basis points (bps), where 10,000 bps = 100%

### Claim Status Accounts
- **Stakers**: Have separate claim status accounts for MEV and priority fee rewards
- **Validators**: Only have MEV claim status accounts (priority fees flow directly to validators)

### Reward Distribution Flow
1. Searchers submit bundles with tips to validators
2. Validators earn MEV revenue and priority fees from successful bundles
3. Validators keep their commission and distribute the rest to stakers
4. Rewards are tracked per epoch and can be claimed using the respective claim status accounts

### Data Availability
- All amounts are denominated in lamports (1 SOL = 1,000,000,000 lamports)
- Data is available on a per-epoch basis
- Historical data is preserved for all previous epochs

---

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

In case of errors, both endpoints return appropriate error responses with details about what went wrong.

---

## Rate Limiting

The API implements caching with a 60-second lifespan to ensure optimal performance. Identical requests within this timeframe will return cached results. 