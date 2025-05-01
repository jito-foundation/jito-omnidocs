---
title: 'MEV and Staker Rewards API Info'
order: 5
section_type: 'page'
subtitle: ''
---


### Staker Rewards

Retrieve MEV rewards for stakers.

Endpoint: <code>/api/v1/staker_rewards</code>

Method: GET

**Query Parameters:**

<code>stake_authority</code> (optional): Filter by stake authority public key

<code>validator_vote_account</code> (optional): Filter by validator vote account public key

<code>epoch</code> (optional): Filter by epoch

<code>page</code> (optional): Page number for pagination (default: 1)

<code>limit</code> (optional): Number of results per page (default: 100, max: 10000)

<code>sort_order</code> (optional): Sort order, either "asc" or "desc" (default: "desc")

<u>Example cURL command:</u>

<code>curl "https://jito.network/api/v1/staker_rewards?stake_authority=ABC123&epoch=100&limit=10"</code>

<code>{
  "rewards": [
    {
      "claimant": "HJUv4xr2EvNNLX14PFK16kyftyNW9ydd7WyWKPutV4nJ",
      "stake_authority": "43TnR14CP9asAakUS6bKwzotvVaTwwG8RcMgw2eDT8tC",
      "withdraw_authority": "43TnR14CP9asAakUS6bKwzotvVaTwwG8RcMgw2eDT8tC",
      "validator_vote_account": "4qvFxnUXYjBdcviCwVV7gKcGJMCENEBfS82hSLJUhyvu",
      "epoch": 678,
      "amount": 23308599,
      "claim_status_account": "D6WY3PX2eeyoBCxSybBjH2YoZh7c1pWg5W5DQAj1Lwza"
    },
    {
      "claimant": "J9gUWLZUgkZiKEL4Yt6qJ2nDM33s1pKczCV7nJVg8iEH",
      "stake_authority": "DL9Kq1nXSwcPsGGE9JWQwhRNnbcQqLjyVAzHjJKBTMsC",
      "withdraw_authority": "DL9Kq1nXSwcPsGGE9JWQwhRNnbcQqLjyVAzHjJKBTMsC",
      "validator_vote_account": "FiijvR2ibXEHaFqB127CxrL3vSj19K2Kx1jf2RbK4BWS",
      "epoch": 678,
      "amount": 23307187,
      "claim_status_account": "BuCtcuqrzWEJoP5prgSYiUJKbPzhFZRjPXEzjopZY2cj"
    }
  ],
  "total_count": 1170170
}</code>

### Validator Rewards

Retrieve MEV rewards for validators.

Endpoint:<code> /api/v1/validator_rewards</code>

Method: GET

**Query Parameters:**

<code>vote_account</code> (optional): Filter by validator vote account public key

<code>epoch</code> (optional): Filter by epoch

<code>page</code> (optional): Page number for pagination (default: 1)

<code>limit</code> (optional): Number of results per page (default: 100, max: 10000)

<code>sort_order</code> (optional): Sort order, either "asc" or "desc" (default: "desc")

<u>Example cURL command:</u>

<code>curl "https://jito.network/api/v1/validator_rewards?vote_account=XYZ789&epoch=100&limit=10"</code>

<u>Response:</u>

<code>{
  "rewards": [
    {
      "vote_account": "6D2jqw9hyVCpppZexquxa74Fn33rJzzBx38T58VucHx9",
      "mev_revenue": 719895757278,
      "mev_commission": 0,
      "num_stakers": 1422,
      "epoch": 678,
      "claim_status_account": "6m7RcCGGh9bzWuuyVuZYm7jzqp3vv5vCnxWSpsBVN2FY"
    },
    {
      "vote_account": "CcaHc2L43ZWjwCHART3oZoJvHLAe9hzT2DJNUpBzoTN1",
      "mev_revenue": 667561428458,
      "mev_commission": 700,
      "num_stakers": 5297,
      "epoch": 678,
      "claim_status_account": "GpYrV3H9WWkVff6QeMJcePYnFLm7dbpL1ogmPmiHL7VM"
    }
  ],
  "total_count": 1083
}</code>

Both endpoints return paginated results and support filtering and sorting options. The response includes the requested rewards data and a total count of matching records.

