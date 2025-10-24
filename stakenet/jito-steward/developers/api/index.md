---
title: Steward API
order: 1
subtitle: ''
section_type: page
---

# Steward API

## Events Endpoint

This endpoint allows you to retrieve various events related to the Steward program. Events are emitted by the Steward program when certain actions occur, such as when a validator is scored, or when rebalancing takes place.

### Endpoint

`GET https://kobe.mainnet.jito.network/api/v1/steward_events`

### Parameters

| Parameter    | Type    | Required | Description                                         |
| ------------ | ------- | -------- | --------------------------------------------------- |
| vote_account | String  | No       | Filter events by validator vote account public key  |
| epoch        | Integer | No       | Filter events by epoch number                       |
| event_type   | String  | No       | Filter events by type (see Valid Event Types below) |
| page         | Integer | No       | Page number for pagination (default: 1)             |
| limit        | Integer | No       | Number of events per page (default: 100, max: 1000) |

### Valid Event Types

Most relevant to validators:

- `ScoreComponentsV4`: Validator scoring details using the 4-tier hierarchical scoring system. Emitted once every 10 epochs
- `InstantUnstakeComponentsV3`: Information about instant unstaking events
- `RebalanceEvent`: Details about stake rebalancing operations

Updates to overall state:

- `StateTransition`: Changes in the Steward program's state machine
- `DecreaseComponents`: Included in RebalanceEvent, provides specifics on stake decreases
- `AutoRemoveValidatorEvent`: Automatic removal of offline validators from the pool
- `AutoAddValidatorEvent`: Automatic addition of new validators to the pool
- `EpochMaintenanceEvent`: Epoch maintenance operations

### Example Request: Get a validator's scores

`GET https://kobe.mainnet.jito.network/api/v1/steward_events?vote_account=J1to3PQfXidUUhprQWgdKkQAMWPJAEqSJ7amkBDE9qhF&event_type=ScoreComponentsV4`

```json
{
  "events": [
    {
      "signature": "5N3hVRpuqsiXCiChrm3GuaWRfi2zZMYAkx6jnM3YTocAC5RBTsrukk4ghFHeCyZawC7Ca72i7fo8TNg2MsG1zXP7",
      "event_type": "ScoreComponentsV4",
      "vote_account": "J1to3PQfXidUUhprQWgdKkQAMWPJAEqSJ7amkBDE9qhF",
      "timestamp": "2024-08-20T06:18:46Z",
      "data": {
        "score": 7260571231234567890,
        "raw_score": 7260571231234567890,
        "commission_max": 5,
        "mev_commission_avg": 800,
        "validator_age": 1250,
        "vote_credits_avg": 9650000,
        "mev_commission_score": 1,
        "blacklisted_score": 1,
        "superminority_score": 1,
        "delinquency_score": 1,
        "running_jito_score": 1,
        "commission_score": 1,
        "historical_commission_score": 1,
        "merkle_root_upload_authority_score": 1,
        "priority_fee_commission_score": 1,
        "priority_fee_merkle_root_upload_authority_score": 1,
        "details": {
          "max_mev_commission": 1000,
          "max_mev_commission_epoch": 658,
          "superminority_epoch": 65535,
          "delinquency_ratio": 0.98,
          "delinquency_epoch": 65535,
          "max_commission": 5,
          "max_commission_epoch": 659,
          "max_historical_commission": 10,
          "max_historical_commission_epoch": 520,
          "avg_priority_fee_commission": 450,
          "max_priority_fee_commission_epoch": 658
        }
      },
      "epoch": 659
    },
    ...
  ]
}
```

**ScoreComponentsV4 Fields:**

- `score`: Final score (u64). If 0, validator is ineligible. Otherwise, equals `raw_score`
- `raw_score`: 4-tier encoded score before binary filters applied
- `commission_max`: Maximum inflation commission observed (0-100, Tier 1 component)
- `mev_commission_avg`: Average MEV commission in basis points (0-10000, Tier 2 component)
- `validator_age`: Number of epochs with non-zero vote credits (Tier 3 component)
- `vote_credits_avg`: Scaled vote credits ratio (Tier 4 component)
- Binary eligibility scores (1 = pass, 0 = fail):
  - `mev_commission_score`: MEV commission check
  - `commission_score`: Recent commission check
  - `historical_commission_score`: Historical commission check
  - `blacklisted_score`: Blacklist check
  - `superminority_score`: Superminority check
  - `delinquency_score`: Voting delinquency check
  - `running_jito_score`: Running Jito MEV client check
  - `merkle_root_upload_authority_score`: Tip distribution authority check
  - `priority_fee_commission_score`: Priority fee commission check
  - `priority_fee_merkle_root_upload_authority_score`: Priority fee authority check
- `details`: Additional scoring details for debugging and transparency

### Example Request: See stake movements by epoch

`GET https://kobe.mainnet.jito.network/api/v1/steward_events?event_type=RebalanceEvent&epoch=657&limit=2000`

```json
{
  "events": [
    {
      "signature": "64GGjM2QtrKw4SPocR5hmw17Kenf9qBdRRM5KrrM9gkr8XUgyyjXNQkuzfxq3ZhDJgHU8jvhUKxaAfMnnGp85Uss",
      "event_type": "RebalanceEvent",
      "vote_account": "7emL18Bnve7wbYE9Az7vYJjikxN6YPU81igf6rVU5FN8",
      "timestamp": "2024-08-17T20:20:57Z",
      "data": {
        "rebalance_type_tag": "Increase",
        "increase_lamports": 2762842586176,
          "decrease_components": {
          "scoring_unstake_lamports": 0,
          "instant_unstake_lamports": 0,
          "stake_deposit_unstake_lamports": 0,
          "total_unstake_lamports": 0
        }
      },
      "epoch": 657
    },
    ...
  ]
}
```
