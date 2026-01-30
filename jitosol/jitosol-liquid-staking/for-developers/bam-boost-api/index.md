---
title: BAM Boost API
subtitle: "BAM Boost"
section_type: page
order: 40
---

### 1. BAM Boost Validators

**Purpose**: Returns BAM boost information for all validators in a given epoch

**Endpoint**: `/api/v1/bam_boost_validators`

**Method**: `GET`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Query Parameters

| Parameter      | Type    | Required | Default | Description                     |
| -------------- | ------- | -------- |-------- | ------------------------------- |
| `epoch`        | number  | Yes      | -       | Filter by specific epoch        |

#### Response Fields

The response contains a `bam_boost_validators` array with the following fields per entry:

| Field                  | Type           | Description                          |
| ---------------------- | -------------- | ------------------------------------ |
| `name`                 | string \| null | Validator name (null if not set)     |
| `epoch`                | number         | Epoch number                         |
| `identity_account`     | string         | Validator identity public key        |
| `amount`               | number         | BAM boost amount in lamports         |
| `claimed`              | boolean        | Whether the boost has been claimed   |
| `claim_status_address` | string         | Claim status account public key      |


#### Example Request

```bash
curl -X GET \
  https://kobe.mainnet.jito.network/api/v1/bam_boost_validators?epoch=900
```

#### Example Response

```json
{
    "bam_boost_validators": [
        {
            "name": "IBB Club",
            "epoch": 900,
            "identity_account": "2KFrkqEeSBKEHiMjUugPxTkBJ2jXepgFBqHu5ZFxtaFg",
            "amount": 5185289422,
            "claimed": false,
            "claim_status_address": "Grhjd1iPxRbDpdcpMnHTjj6gHgPLqqny8yVzRYX1DHFk"
        },
        {
            "name": null,
            "epoch": 900,
            "identity_account": "Ha1CoNmAcbCQbg9QcCjLH79gLCqVZdxABwccQH3xexXE",
            "amount": 5243935756,
            "claimed": false,
            "claim_status_address": "58ic9vW34xN8FyPAm4guHgJxvcQ37peXJeamNjuNFVUk"
        }
    ]
}
```

---

### 2. Claim

**Purpose**: Returns the claim proof and details required to claim BAM boost rewards for a specific validator

**Endpoint**: `/api/v1/claim/{network}/{epoch}/{identity_account}`

**Method**: `GET`

**Base URL**: `https://kobe.mainnet.jito.network`

#### Path Parameters

| Parameter          | Type   | Required | Description                                      |
| ------------------ | ------ | -------- | ------------------------------------------------ |
| `network`          | string | Yes      | Network name (e.g., `mainnet`)                   |
| `epoch`            | number | Yes      | Epoch number for the claim                       |
| `identity_account` | string | Yes      | Validator identity public key                    |

#### Response Fields

| Field                  | Type       | Description                                           |
| ---------------------- | ---------- | ----------------------------------------------------- |
| `amount`               | number     | Claimable amount in lamports                          |
| `claimant`             | string     | Public key of the claimant                            |
| `proof`                | number[][] | Merkle proof as array of 32-byte arrays               |
| `merkle_root`          | number[]   | 32-byte merkle root                                   |
| `distributor_address`  | string     | Merkle distributor program address                    |
| `claim_status_address` | string     | Account address tracking the claim status             |

#### Example Request

```bash
curl -X GET \
  https://kobe.mainnet.jito.network/api/v1/claim/mainnet/915/5zuNci3TV79w6zLoJZzbZujMvkVZb2FcSPhgv9aT24AK
```

#### Example Response

```json
{
    "amount": 1014322740,
    "claimant": "5zuNci3TV79w6zLoJZzbZujMvkVZb2FcSPhgv9aT24AK",
    "proof": [
        [...],
        [...]
    ],
    "merkle_root": [...],
    "distributor_address": "CCRhL2ynYebEzxLWNUHCcEXrKqmJa2jJjnZrr7bDbgnb",
    "claim_status_address": "FYvKEnv3i36SwNRwFTvAKaQH8oo1F3EFTGfVc55oVkqm"
}
```

> **Note**: The `proof` array in the example response is truncated for readability. The actual response contains all proof nodes required for merkle verification.
