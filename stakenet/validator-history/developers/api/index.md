---
title: Validator History API
order: 0
subtitle: ''
section_type: page
---

# Validator History API

## Validator History Endpoint

This endpoint allows you to fetch all validator histories by vote account

### Endpoint

`GET https://kobe.mainnet.jito.network/api/v1/validator_history/{vote_account}`

### Parameters

| Parameter    | Type    | Required | Description                                         |
| ------------ | ------- | -------- | --------------------------------------------------- |
| epoch        | Integer | No       | Filter validator history entry by epoch number      |


### Example Request: Get a validator's scores

`GET https://kobe.mainnet.jito.network/api/v1/validator_history/J1to1yufRnoWn81KYg1XkTWzmKjnYSnmE2VY8DGUJ9Qv?epoch=861`

```json
{
    "struct_version": 0,
    "vote_account": "J1to1yufRnoWn81KYg1XkTWzmKjnYSnmE2VY8DGUJ9Qv",
    "index": 321,
    "last_ip_timestamp": 1760935613523,
    "last_version_timestamp": 1760935613523,
    "validator_age": 542,
    "validator_age_last_updated_epoch": 866,
    "history": [
        {
            "activated_stake_lamports": 825617784728539,
            "epoch": 861,
            "mev_commission": 800,
            "epoch_credits": 6901581,
            "commission": 4,
            "client_type": "BAM",
            "version": "2.3.11",
            "ip": "88.211.250.188",
            "merkle_root_upload_authority": "TipRouter",
            "is_superminority": 0,
            "rank": 97,
            "vote_account_last_update_slot": 372342468,
            "mev_earned": 396,
            "priority_fee_commission": 5000,
            "priority_fee_tips": 4781931582,
            "total_priority_fees": 2570378128,
            "total_leader_slots": 240,
            "blocks_produced": 240,
            "block_data_updated_at_slot": 372384000,
            "priority_fee_merkle_root_upload_authority": "TipRouter"
        }
    ]
}
```
