---
title: Validator Performance API
subtitle: "Network analytics, validator rankings, and stake pool metrics"
section_type: page
order: 10
---

### 1. `/api/v1/validators`  `GET | POST`
Returns validator state for a given epoch (defaults to latest). The current epoch will always report `mev_rewards = 0` because rewards settle at epoch boundary.

| Query / JSON Field | Type | Required | Description |
|--------------------|------|----------|-------------|
| `epoch`            | `u64`| no       | Epoch to query. Omit for latest |

Example `curl`:
```bash
curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/validators \
  -H 'Content-Type: application/json' \
  -d '{"epoch":600, "limit":3}'
```

Example response:
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
Field reference:
| Field | Description |
|-------|-------------|
| `mev_commission_bps` | Validator’s MEV commission in basis-points |
| `priority_fee_commission_bps` | Priority-fee commission (bps) |
| `mev_rewards` | Post-commission MEV lamports paid to validator + stakers |
| `priority_fee_rewards` | Post-commission priority-fee lamports |
| `running_jito` | `true` if validator is running Jito-Solana |
| `active_stake` | Lamports actively staked with this validator |

---

### 2. `/api/v1/validators/{vote_account}`  `GET`
Returns historical reward data for a single validator, sorted by epoch (desc).

Example:
```bash
curl https://kobe.mainnet.jito.network/api/v1/validators/GdRKUZKdiXMEATjddQW6q4W8bPgXRBYJKayfeqdQcEPa
```
Response slice:
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

### 3. `/api/v1/jito_stake_over_time`  `GET | POST`
Returns a map of epoch → percentage of **all Solana stake** that is delegated to Jito-running validators.

```bash
curl https://kobe.mainnet.jito.network/api/v1/jito_stake_over_time
```
```json
{
  "stake_ratio_over_time": {
    "484": 0.27771625202212147,
    "485": 0.27866636980357196
  }
}
```

---

### 4. `/api/v1/mev_rewards`  `GET | POST`
Network-level statistics for a single epoch.

| Field | Description |
|-------|-------------|
| `epoch` | Epoch queried |
| `total_network_mev_lamports` | MEV paid (after protocol fee) across **all** validators |
| `jito_stake_weight_lamports` | Total Jito-validator active stake |
| `mev_reward_per_lamport` | Average MEV per staked lamport |

Example:
```bash
curl -X POST https://kobe.mainnet.jito.network/api/v1/mev_rewards -H 'Content-Type: application/json' -d '{"epoch":600}'
```

---

### 5. `/api/v1/daily_mev_rewards`  `GET`
Aggregated MEV tips per calendar day.
```bash
curl https://kobe.mainnet.jito.network/api/v1/daily_mev_rewards
```

Response:
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