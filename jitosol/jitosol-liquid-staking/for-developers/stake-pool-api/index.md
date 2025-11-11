---
title: Validator API
subtitle: "Network analytics, validator rankings, and stake pool APY metrics"
section_type: page
order: 10
---

## API Endpoints

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
| `running_bam`                 | boolean | `true` if validator is running BAM                       |
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
      "running_jito": true,
      "running_bam": false,
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

| Field                         | Type    | Description                                                                   |
| ----------------------------- |-------- | ----------------------------------------------------------------------------- |
| `vote_account`                | string  | Validator vote account public key                                             |
| `mev_commission_bps`          | number  | Validator’s MEV commission in basis-points                                    |
| `mev_rewards`                 | number  | Post-commission MEV lamports paid to validator + stakers                      |
| `priority_fee_commission_bps` | number  | Priority-fee commission (bps)                                                 |
| `priority_fee_rewards`        | number  | Post-commission priority-fee lamports                                         |
| `running_jito`                | boolean | `true` if validator is running Jito-Solana                                    |
| `running_bam`                 | boolean | `true` if validator is running BAM                                            |
| `active_stake`                | number  | Lamports actively staked with this validator                                  |
| `jito_sol_active_lamports`    | number  | Active stake lamports delegated to this validator from the JitoSOL stake-pool |


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
      "running_bam": false,
      "active_stake": 47753222427851,
      "jito_sol_active_lamports": 3282880
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

### 7. Stake Pool Stats

**Purpose**: Stake pool analytics including TVL, APY, validator count, supply metrics, and aggregated MEV rewards over time.

**Endpoint**: `/api/v1/stake_pool_stats`

**Method**: `GET` or `POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter            | Type   | Required | Default.     | Description                                                       |
| -------------------- | ------ | -------- |------------- | ----------------------------------------------------------------- |
| `bucket_type`        | string | No       | "Daily".     | Time bucket aggregation type. Currently only "Daily" is supported |
| `range_filter`       | object | No       | Last 7 days  | Date range filter with `start` and `end` DateTime fields          |
| `range_filter.start` | string | No       | 7 days ago   | Start date in ISO 8601 format (e.g., "2025-08-15T22:55:06Z")      |
| `range_filter.end`   | string | No       | Now.         | End date in ISO 8601 format (e.g., "2025-08-22T22:55:06Z")        |
| `sort_by`            | object | No       | Default sort | Sort configuration object                                         |
| `sort_by.field`      | string | No       | "BlockTime"  | Sort field. Currently only "BlockTime" is supported               |
| `sort_by.order`      | string | No.      | "Asc"        | Sort order: "Asc" or "Desc"                                       |

#### Response Fields

| Field                    | Type   | Description                                                            |
| ------------------------ |------- | ---------------------------------------------------------------------- |
| `aggregated_mev_rewards` | number | Total aggregated MEV rewards across all time periods (in lamports)     |
| `mev_rewards`            | array  | Time series data of MEV rewards with integer data points               |
| `tvl`                    | array  | Time series data of Total Value Locked in the stake pool (in lamports) |
| `apy`                    | array  | Time series data of Annual Percentage Yield as decimal values          |
| `num_validators`         | array  | Time series data of validator count in the stake pool                  |
| `supply`                 | array  | Time series data of JitoSOL token supply as decimal values             |


#### Example Request

```bash
curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/stake_pool_stats \
  -H 'Content-Type: application/json' \
  -d '{
    "bucket_type": "Daily",
    "range_filter": {
      "start": "2025-08-15T00:00:00Z",
      "end": "2025-08-16T00:00:00Z"
    },
    "sort_by": {
      "field": "BlockTime",
      "order": "Asc"
    }
  }'
```

#### Example Response

```json
{
  "aggregated_mev_rewards": 17917503591959,
  "mev_rewards": [
    {
      "data": 841552703382,
      "date": "2025-08-15T22:55:06Z"
    },
    {
      "data": 5244986563088,
      "date": "2025-08-16T23:20:47Z"
    }
  ],
  "tvl": [
    {
      "data": 15209213875510266,
      "date": "2025-08-15T22:55:06Z"
    },
    {
      "data": 15211604884230567,
      "date": "2025-08-16T23:20:47Z"
    }
  ],
  "apy": [
    {
      "data": 0.07184861225308525,
      "date": "2025-08-15T22:55:06Z"
    },
    {
      "data": 0.07184861239211937,
      "date": "2025-08-16T23:20:47Z"
    }
  ],
  "num_validators": [
    {
      "data": 1040,
      "date": "2025-08-15T22:55:06Z"
    },
    {
      "data": 1040,
      "date": "2025-08-16T23:20:47Z"
    }
  ],
  "supply": [
    {
      "data": 12420237.336776868,
      "date": "2025-08-15T22:55:06Z"
    },
    {
      "data": 12422189.896316852,
      "date": "2025-08-16T23:20:47Z"
    }
  ]
}
```

---

### 8. MEV Commission Average Overtime

**Purpose**: Returns stake-weighted average MEV commission rates by epoch for all Jito-running validators.

**Endpoint**: `/api/v1/mev_commission_average_over_time`

**Method**: `GET`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Response Fields

| Field                              | Type   | Description                                                         |
| ---------------------------------- |------- | ------------------------------------------------------------------- |
| `average_mev_commission_over_time` | object | Map of epoch numbers to stake-weighted average MEV commission rates |

#### Calculation Method

The average MEV commission is calculated as a **stake-weighted average**:

1. **Filter**: Only includes validators running Jito (`running_jito: true`)
2. **Weight by Stake**: Each validator's commission rate is weighted by their active stake amount
3. **Aggregate by Epoch**: Results are grouped and averaged per epoch
4. **Formula**: `(Sum of [MEV Commission × Active Stake]) / (Sum of Active Stake)`

This provides a more accurate representation of the effective commission rate experienced by stakers, as validators with more stake have proportionally more influence on the average.

#### Example Request

```bash
curl https://kobe.mainnet.jito.network/api/v1/mev_commission_average_over_time
```

#### Example Response

```json
{
  "aggregated_mev_rewards": 841552703382,
  "mev_rewards": [
    {
      "data": 841552703382,
      "date": "2025-08-15T22:55:06Z"
    }
  ],
  "tvl": [
    {
      "data": 15209213875510266,
      "date": "2025-08-15T22:55:06Z"
    }
  ],
  "apy": [
    {
      "data": 0.07184861225308525,
      "date": "2025-08-15T22:55:06Z"
    }
  ],
  "num_validators": [
    {
      "data": 1040,
      "date": "2025-08-15T22:55:06Z"
    }
  ],
  "supply": [
    {
      "data": 12420237.336776868,
      "date": "2025-08-15T22:55:06Z"
    }
  ]
}
```

---

### 9. JitoSOL/SOL Ratio

**Purpose**: Retrieve the historical exchange ratio between JitoSOL and SOL over time.

**Endpoint**: `/api/v1/jitosol_sol_ratio`

**Method**: `GET` or `POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter            | Type   | Required | Default     | Description                                                  |
|--------------------- | ------ | -------- | ----------- |------------------------------------------------------------- |
| `range_filter`       | object | No       | Last 7 days | Date range filter with `start` and `end` DateTime fields     |
| `range_filter.start` | string | No       | 7 days ago  | Start date in ISO 8601 format (e.g., "2025-08-15T00:00:00Z") |
| `range_filter.end`   | string | No       | Now         | End date in ISO 8601 format (e.g., "2025-08-22T00:00:00Z")   |

#### Response Fields


| Field    | Type   | Description                                        |
| -------- | ------ | -------------------------------------------------- |
| `ratios` | array  | Time series data of JitoSOL to SOL exchange ratios |

#### Example Request

```bash
curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/jitosol_sol_ratio \
  -H 'Content-Type: application/json' \
  -d '{
    "range_filter": {
      "start": "2025-08-15T00:00:00Z",
      "end": "2025-08-16T00:00:00Z"
    }
  }'
```

#### Example Response

```json
{
  "ratios": [
    {
      "data": 1.224550985871672,
      "date": "2025-08-15T22:55:06Z"
    }
  ]
}
```

---

## Frontend APY Calculation

The Jito frontend calculates the current APY displayed to users by fetching historical stake pool data and using the most recent available data point.

### Jito Frontend Implementation

Here's how the Jito frontend retrieves and processes APY data:

```javascript
export default async function handler(req, res) {
  const apiUrl = 'https://kobe.mainnet.jito.network/api/v1/stake_pool_stats'

  // Set up start and end dates
  const start = new Date('2022-10-31T00:00:00Z') // Launch date
  const end = new Date()

  const statsRequest = {
    bucket_type: 'Daily',
    range_filter: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    sort_by: {
      field: 'BlockTime',
      order: 'Asc',
    },
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statsRequest),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data) {
      const {
        aggregated_mev_rewards: aggregatedMevRewards,
        apy,
        mev_rewards: mevRewards,
        num_validators: numValidators,
        supply,
        tvl,
      } = data

      const camelCaseData = {
        getStakePoolStats: {
          aggregatedMevRewards,
          apy,
          mevRewards,
          numValidators,
          supply,
          tvl,
        },
      }

      res.status(200).json(camelCaseData)
    } else {
      res.status(200).json(data)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ message: `Error fetching data: ${error.message}` })
  }
}
```

### APY Selection Logic

To display the current APY on the frontend:

1. **Fetch Complete History**: The API call retrieves all historical data from JitoSOL's launch date (October 31, 2022) to the present
2. **Select Most Recent**: The frontend uses the most recent data point from the `apy` array
3. **Display Current Rate**: This most recent APY value represents the current annualized yield rate shown to users

The `apy` field in the response contains time-series data where each entry includes:
- `data`: The APY as a decimal value (e.g., 0.07184861225308525 = ~7.18%)
- `date`: The timestamp when this APY was calculated

Note that the stake_pool_stats endpoint returns smoothed values when requesting for periods longer than 10 epochs. Hence, the APY data we show on our frontend is smoothed.

---

## Notes & Caveats
* The **current epoch** always reports `mev_rewards = 0` because rewards are finalized at epoch-close.
* All lamport values are **post-commission** – delegators receive their share via separate claim paths documented in the *MEV Rewards API* page.
* Pagination caps: `limit ≤ 10 000` for list endpoints.
* All endpoints are cached for at least 60 s; identical requests within this window return cached data.
