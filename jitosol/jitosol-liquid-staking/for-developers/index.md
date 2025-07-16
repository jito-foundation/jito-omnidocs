---
title: For Developers
subtitle: ""
section_type: page
order: 5
---
JitoSOL leverages the native stake pool program developed by Solana Labs. This is the most secure stake pool implementation on Solana. See their GitHub repo for SDKs and documentation: [link](https://github.com/solana-labs/solana-program-library/tree/master/stake-pool)

### POST /api/v1/validators

To get validator stats for a given epoch, use the following POST request. Note that the current epoch will have MEV rewards set to zero.

Parameters: 
<code>epoch</code>: int

<u>Example Request: </u>

<code>CURL -X POST https://kobe.mainnet.jito.network/api/v1/validators  -H "Content-Type: application/json" -d '{"epoch":600}' </code>

<u>Example Response:</u>

<pre><code>{
  "validators": [
    {
      "vote_account": "GdRKUZKdiXMEATjddQW6q4W8bPgXRBYJKayfeqdQcEPa",
      "mev_commission_bps": 10000,
      "mev_rewards": 4438669326,
      "running_jito": true,
      "active_stake": 57968373482697,
      "priority_fee_commission_bps": 5000,
      "priority_fee_rewards": 31269273876
    },
    {
      "vote_account": "B6nDYYLc2iwYqY3zdmavMmU9GjUL2hf79MkufviM2bXv",
      "mev_commission_bps": 500,
      "mev_rewards": 9214553780,
      "running_jito": true,
      "active_stake": 598871747692941,
      "priority_fee_commission_bps": 5000,
      "priority_fee_rewards": 94572974753
    },
    {
      "vote_account": "2PpHNHPLseBb4doTu1ajTwAxCrjmu7ubReDHKPrjxi9F",
      "mev_commission_bps": 800,
      "mev_rewards": 6123234290,
      "running_jito": true,
      "active_stake": 88295901191147
      "priority_fee_commission_bps": 5000,
      "priority_fee_rewards": 85937362840,
    }...
  ]}</code></pre>

### GET /api/v1/validators/{vote_account}

You can also get MEV rewards for a specific validator by vote account. This will return results for a specific validator, sorted by epoch.

Parameters: None 

<u>Example request:</u>

<code>curl https://kobe.mainnet.jito.network/api/v1/validators/63a15aZm4rphdQJcZfL8oSMPwLDmvUW2dFw3WqZpjxEt</code>

<u>Example response:</u>

<pre><code>[
  {
    "epoch": 608,
    "mev_commission_bps": 10000,
    "mev_rewards": 59355050,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 43328291
  },
  {
    "epoch": 607,
    "mev_commission_bps": 10000,
    "mev_rewards": 31870726,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 23288520
  },
  {
    "epoch": 605,
    "mev_commission_bps": 10000,
    "mev_rewards": 535874838,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 388885626
  },
  {
    "epoch": 604,
    "mev_commission_bps": 10000,
    "mev_rewards": 29926950,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 21809850
  },
  {
    "epoch": 603,
    "mev_commission_bps": 10000,
    "mev_rewards": 46862475,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 34125000
  },
  {
    "epoch": 602,
    "mev_commission_bps": 10000,
    "mev_rewards": 939666610,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 682500000
  },
  {
    "epoch": 601,
    "mev_commission_bps": 10000,
    "mev_rewards": 254418752,
    "priority_fee_commission_bps": 5000,
    "priority_fee_rewards": 184687500
  },
]</code></pre>

### GET /api/v1/jito_stake_over_time

Gets the percent of Jito Stake per epoch

<u>Example Request: </u>

<code> curl https://kobe.mainnet.jito.network/api/v1/jito_stake_over_time</code>

<u>Example Response: </u>

<code>{
  "stake_ratio_over_time": {
    "484": 0.27771625202212147,
    "485": 0.27866636980357196,
   }	
}</code>

### POST /api/v1/mev_rewards

Gets total MEV rewards, Jito stake weight, and MEV rewards per lamport for the network for a given epoch 

<u>Example Request </u>

<code>CURL -X POST https://kobe.mainnet.jito.network/api/v1/mev_rewards  -H "Content-Type: application/json" -d '{"epoch":600}'</code>

<u>Example Response </u>

<code>{
  "epoch": 600,
  "total_network_mev_lamports": 14471997205343,
  "jito_stake_weight_lamports": 287482861698565570,
  "mev_reward_per_lamport": 5.034038244866689e-05
}</code>


### GET /api/v1/daily_mev_rewards

Gets daily mev rewards for the network for a given epoch

<u>Example response</u>

<pre><code>[
  {
    "day": "2024-01-01 00:00:00.000 UTC",
    "count_mev_tips": 634438,
    "jito_tips": 31.16084152154873,
    "tippers": 19577,
    "validator_tips": 592.055988909449
  },
  {
    "day": "2024-01-02 00:00:00.000 UTC",
    "count_mev_tips": 677464,
    "jito_tips": 76.4981846909486,
    "tippers": 22453,
    "validator_tips": 1453.46550912805
  },
]</code></pre>
