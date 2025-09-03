---
title: Steward API
subtitle: "Steward program event monitoring "
section_type: page
order: 20
---

## API Endpoints

### 1. Steward Events

**Purpose**: Retrieves Jito Steward program events with filtering and pagination support. Returns detailed information about stakenet decisions and operations.

**Endpoint**: `/api/v1/steward_events`

**Method**: `GET or POST`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter      | Type   | Required | Default | Description                                                   |
| -------------- | ------ | -------- |-------- | ------------------------------------------------------------- |
| `event_type`   | string | No       | -       | Filter by specific steward event type (see Event Types below) |
| `vote_account` | string | No       | -       | Filter by validator vote account public key                   |
| `epoch`        | number | No       | -       | Filter by specific epoch number                               |
| `limit`        | number | No       | 100     | Number of results to return (used with skip for pagination)   |
| `skip`         | number | No       | 0       | Number of results to skip for pagination                      |

#### Event Types

| Event Type.                | Versions Supported | Description                                            |
| -------------------------- | ------------------ | ------------------------------------------------------ |
| `ScoreComponents`          | V1, V2, V3         | Validator scoring calculations and performance metrics |
| `InstantUnstakeComponents` | V1, V2, V3         | Emergency unstaking events for problematic validators  |
| `RebalanceEvent`           | V1                 | Stake rebalancing operations across validators         |
| `DecreaseComponents`       | V1                 | Stake reduction events for underperforming validators  |
| `StateTransition`          | V1                 | Steward operational state changes                      |
| `AutoAddValidatorEvent`    | V1                 | Automatic validator additions to the stake pool        |
| `AutoRemoveValidatorEvent` | V1                 | Automatic validator removals from the stake pool       |
| `EpochMaintenanceEvent`    | V1                 | Routine epoch-boundary maintenance operations          |

#### Special Event Type Handling

- **ScoreComponents**: Queries all versions (ScoreComponents, ScoreComponentsV2, ScoreComponentsV3)
- **InstantUnstakeComponents**: Queries all versions (InstantUnstakeComponents, InstantUnstakeComponentsV2, InstantUnstakeComponentsV3)

#### Response Fields

| Field    | Type    | Description                    |
| -------- |-------- | ------------------------------ |
| `events` | array   | Array of steward event objects |

#### Steward Event Object Fields

| Field          | Type        | Description                                                       |
| -------------- |------------ | ----------------------------------------------------------------- |
| `signature`    | string      | Transaction signature where the event occurred                    |
| `event_type`   | string      | Type of steward event (e.g., "AutoAddValidatorEvent")             |
| `vote_account` | string      | Validator vote account public key associated with the event       |
| `timestamp`    | string      | ISO 8601 timestamp when the event occurred                        |
| `epoch`        | number      | Epoch number when the event took place                            |
| `slot`         | number      | Blockchain slot number where the event occurred                   |
| `data`         | object      | Event-specific data (varies by event type)                        |
| `tx_error`     | string/null | Transaction error message if the event failed, null if successful |

#### Sorting and Pagination

- **Default Sort**: Events are sorted by slot number in descending order (newest first)
- **Pagination**: Use `limit` and `skip` parameters for pagination
- **Total Count**: Response includes total count for pagination calculation

#### Example Request

```bash
 curl -X POST \
  https://kobe.mainnet.jito.network/api/v1/steward_events?event_type=ScoreComponents | jq
```

#### Example Response

```json
{
    "events": [
        {
            "signature": "48TciVTNG2kVVE8CnCbAQjRG7qCk7HMyunNRZR1zT8gYNWRvg2kPPjSDuwwrHnTjvXGAqQ6WJY18DQybQPBGw2Uc",
            "event_type": "AutoAddValidatorEvent",
            "vote_account": "Csp2hDVRX4cRitFEswJJcoH9ju4rcPUSsqU9pkh5JBQU",
            "timestamp": "2025-08-21T18:42:42Z",
            "data": {
                "validator_list_index": 1039
            },
            "epoch": 837,
            "tx_error": null
        },
    // …
  ]
}
```
