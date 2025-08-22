---
title: Validator Performance API
subtitle: "Network analytics, validator rankings, and stake pool metrics"
section_type: page
order: 10
---

### 1. Validators

**Purpose**: Returns validator state for a given epoch (defaults to latest). The current epoch will always report `mev_rewards = 0` because rewards settle at epoch boundary.

**Endpoint**: `/api/v1/validators`

**Method**: `GET or POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |
| `epoch`   | number | No       | -       | Filter by specific epoch       |


#### Response Fields

| Field                         | Type    | Description                                              |
| ----------------------------- |-------- | -------------------------------------------------------- |
| `vote_account`                | string  | Validator vote account public key                        |
| `mev_commission_bps`          | number  | Validator’s MEV commission in basis-points               |
| `mev_rewards`                 | number  | Post-commission MEV lamports paid to validator + stakers |
| `priority_fee_commission_bps` | number  | Priority-fee commission (bps)                            |
| `priority_fee_rewards`        | number  | Post-commission priority-fee lamports                    |
| `running_jito`                | boolean | `true` if validator is running Jito-Solana               |
| `active_stake`                | number  | Lamports actively staked with this validator             |

#### Example Request

```bash
curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/validators \
  -H 'Content-Type: application/json' \
  -d '{ "epoch":600 }'
```

#### Example Response

```json
{
  "validators": [
    {
      "vote_account": "GdRKUZKdiXMEATjddQW6q4W8bPgXRBYJKayfeqdQcEPa",
      "mev_commission_bps": 10000,
      "mev_rewards": 4438669326,
      "priority_fee_commission_bps": 5000,
      "priority_fee_rewards": 31269273876,
      "active_stake": 57968373482697,
      "running_jito": true
    }
    // …
  ]
}
```

---

### 2. JitoSOL Validators

**Purpose**: Returns JitoSOL stake pool validators for a given epoch (defaults to latest). Only includes validators that are actively part of the JitoSOL validator set.

**Endpoint**: `/api/v1/jitosol_validators` 

**Method**: `GET | POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |
| `epoch`   | number | No       | -       | Filter by specific epoch       |

#### Response Fields

| Field                         | Type    | Description                                              |
| ----------------------------- |-------- | -------------------------------------------------------- |
| `vote_account`                | string  | Validator vote account public key                        |
| `mev_commission_bps`          | number  | Validator’s MEV commission in basis-points               |
| `mev_rewards`                 | number  | Post-commission MEV lamports paid to validator + stakers |
| `priority_fee_commission_bps` | number  | Priority-fee commission (bps)                            |
| `priority_fee_rewards`        | number  | Post-commission priority-fee lamports                    |
| `running_jito`                | boolean | `true` if validator is running Jito-Solana               |
| `active_stake`                | number  | Lamports actively staked with this validator             |


#### Example Request

```bash
curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/jitosol_validators \
  -H 'Content-Type: application/json' \
  -d '{ "epoch":600 }'
```

#### Example Response

```json
{
  "validators": [
    {
      "vote_account": "CviQXDMPZPVAZ5qgVGN2gSBSD9GqqwRt7VZidoHMpArr",
      "mev_commission_bps": 10000,
      "mev_rewards": 3204800942,
      "priority_fee_commission_bps": null,
      "priority_fee_rewards": null,
      "running_jito": true,
      "active_stake": 47753222427851
    },
    // …
  ]
}
```

---

### 3. Validator Historical Reward

**Purpose**: Returns historical reward data for a single validator, sorted by epoch (desc).

**Endpoint**: `/api/v1/validators/{vote_account}`

**Method**: `GET`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |


#### Response Fields

| Field                         | Type    | Description                                              |
| ----------------------------- |-------- | -------------------------------------------------------- |
| `epoch`                       | number  | The epoch when these rewards were earned                 |
| `mev_commission_bps`          | number  | Validator’s MEV commission in basis-points               |
| `mev_rewards`                 | number  | Post-commission MEV lamports paid to validator + stakers |
| `priority_fee_commission_bps` | number  | Priority-fee commission (bps)                            |
| `priority_fee_rewards`        | number  | Post-commission priority-fee lamports                    |

#### Example Request

```bash
curl https://kobe.mainnet.jito.network/api/v1/validators/GdRKUZKdiXMEATjddQW6q4W8bPgXRBYJKayfeqdQcEPa
```

#### Example Response

```json
[
  {
    "epoch": 608,
    "mev_commission_bps": 10000,
    "mev_rewards": 59355050,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 43328291
  }
  // …
]
```

---

### 4. Jito Stake Over Time

**Purpose**: Returns a map of epoch → percentage of **all Solana stake** that is delegated to Jito-running validators.

**Endpoint**: `/api/v1/jito_stake_over_time`

**Method**: `GET | POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |

#### Response Fields

| Field                   | Type    | Description                                                                                                           |
| ----------------------- |-------- | --------------------------------------------------------------------------------------------------------------------- |
| `stake_ratio_over_time` | object  | Map of epoch → decimal ratio representing the percentage of total Solana stake delegated to Jito validators (0.0-1.0) |

#### Example Request

```bash
curl https://kobe.mainnet.jito.network/api/v1/jito_stake_over_time
```

#### Example Response

```json
{
  "stake_ratio_over_time": {
    "484": 0.27771625202212147,
    "485": 0.27866636980357196
  }
}
```

---

### 5. MEV Rewards

**Purpose**: Network-level statistics for a single epoch.

**Endpoint**: `/api/v1/mev_rewards`

**Method**: `GET | POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |
| `epoch`   | number | No       | -       | Filter by specific epoch       |

#### Response Fields

| Field                        | Type    | Description                                                                                                                                       |
| ---------------------------- |-------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `epoch`                      | number  | The epoch number for which MEV rewards data is provided                                                                                           |
| `total_network_mev_lamports` | number  | Total MEV rewards generated across the entire Solana network during this epoch, measured in lamports                                              |
| `jito_stake_weight_lamports` | number  | Total amount of stake (in lamports) delegated to validators running Jito software during this epoch                                               |
| `mev_reward_per_lamport`     | number  | MEV rewards earned per lamport of stake for Jito validators in this epoch (calculated as total_network_mev_lamports / jito_stake_weight_lamports) |

#### Example Request

```bash
curl -X POST https://kobe.mainnet.jito.network/api/v1/mev_rewards -H 'Content-Type: application/json' -d '{ "epoch": 600 }'
```

#### Example Response

```json
{
  "epoch": 600,
  "total_network_mev_lamports": 19630470685094,
  "jito_stake_weight_lamports": 273972433518536409,
  "mev_reward_per_lamport": 0.0000716512622565213
}
```

---

### 6. Daily MEV Rewards

**Purpose**: Aggregated MEV tips per calendar day.

**Endpoint**: `/api/v1/daily_mev_rewards`

**Method**: `GET`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- |-------- | ------------------------------ |

#### Response Fields

| Field            | Type    | Description                                                                                                |
| ---------------- |-------- | ---------------------------------------------------------------------------------------------------------- |
| `day`            | string  | The calendar date in UTC format (YYYY-MM-DD HH:MM:SS.sss UTC) for which the MEV rewards data is aggregated |
| `count_mev_tips` | number  | Total number of individual MEV tip transactions that occurred on this day                                  |
| `jito_tips`      | number  | Total amount of MEV tips paid to Jito (in SOL) on this day                                                 |
| `tippers`        | number  | Total number of unique accounts that submitted MEV tips on this day                                        |
| `validator_tips` | number  | Total amount of MEV tips distributed to validators (in SOL) on this day                                    |


#### Example Request

```bash
curl https://kobe.mainnet.jito.network/api/v1/daily_mev_rewards
```

#### Example Response

```json
[
  {
    "day": "2025-07-29 00:00:00.000 UTC",
    "count_mev_tips": 23899823,
    "jito_tips": 385.815098392558,
    "tippers": 898619,
    "validator_tips": 7330.48686946401
  },
  {
    "day": "2025-07-30 00:00:00.000 UTC",
    "count_mev_tips": 16157401,
    "jito_tips": 232.975239402936,
    "tippers": 581839,
    "validator_tips": 4426.5295486581
  }
]
```

---

## Notes & Caveats
* The **current epoch** always reports `mev_rewards = 0` because rewards are finalized at epoch-close.
* All lamport values are **post-commission** – delegators receive their share via separate claim paths documented in the *MEV Rewards API* page.
* Pagination caps: `limit ≤ 10 000` for list endpoints.
* All endpoints are cached for at least 60 s; identical requests within this window return cached data.