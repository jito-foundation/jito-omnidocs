---
title: 'MEV Harvesting Guide'
order: 50
section_type: 'page'
subtitle: 'Guide for stake account holders to claim unclaimed MEV rewards.'
---

## MEV Harvesting for Stake Account Holders

**This page is only for holders of native SOL stake accounts, not JitoSOL holders.** If you have JitoSOL, your MEV rewards are automatically included and compounded - you don't need to do anything.

The [Jito Harvest page](https://www.jito.network/harvest/) allows stake account holders to claim accumulated MEV rewards that haven't been automatically distributed.

![MEV Harvest Interface](/shared/images/jitosol/harvest-page-list-of-stakes-with-unclaimed-mev.png)

### Who Gets MEV Rewards?

**MEV rewards are only distributed if your validator is running the Jito client.** Rewards are determined by:
- **Stake amount:** Larger stakes earn proportionally more MEV
- **Duration:** How long your stake has been active
- **Validator participation:** Your validator must run Jito client software

### Understanding the Interface

**Unclaimed MEV Column:** Shows rewards in Lamports (1 SOL = 1 billion Lamports)
- Small amounts like "2 Lamports" = 0.000000002 SOL
- Larger amounts like "500,000,000 Lamports" = 0.5 SOL

**Stake Address:** The public key of your stake account

**Claim MEV Toggles:** Choose which stake accounts to harvest from

**Status Indicators:**
- **Inactive:** Stake account is deactivated but may still have unclaimed MEV
- **Locked:** Stake account is currently locked/delegated

### How to Harvest MEV

1. **Visit the harvest page:** Go to [jito.network/harvest](https://www.jito.network/harvest/)
2. **Connect your wallet:** Same wallet that owns the stake accounts
3. **Review available rewards:** Check unclaimed MEV amounts for each stake account
4. **Select accounts:** Toggle on the stake accounts you want to claim from
5. **Choose reward type:** 
   - Keep toggle off for SOL rewards
   - Turn on "Convert MEV to JitoSOL" to receive liquid staking tokens instead
6. **Confirm harvest:** Click "Harvest MEV as SOL" to proceed

### The Harvest Process

![Harvest Confirmation](/shared/images/jitosol/harvest-page-confirm-modal.png)

**Important details:**
- **Multiple transactions:** The process may require several transactions depending on how many stake accounts you're claiming from
- **All enabled rows:** The operation claims from all stake accounts you've toggled on

### When to Harvest

**Consider harvesting when:**
- You have meaningful amounts accumulated (worth more than transaction fees)
- You want to convert MEV rewards to JitoSOL for liquidity

**You might skip harvesting if:**
- Amounts are very small (may not cover transaction costs)
- Your validator isn't running Jito client (no rewards to claim)
- You prefer to leave rewards in the stake account

### MEV Rewards vs JitoSOL

**Stake Account MEV:** Manual claiming required, only works with Jito-enabled validators
**JitoSOL MEV:** Automatic inclusion, no manual claiming needed, benefits from all Jito validators

**Converting to JitoSOL:** If you toggle "Convert MEV to JitoSOL", your claimed MEV becomes liquid staking tokens that:
- Earn ongoing staking + MEV rewards automatically
- Can be used in DeFi or traded anytime
- Don't require validator-specific Jito client participation

## Frequently Asked Questions

**"I have JitoSOL - do I need to harvest?"**
No! JitoSOL automatically includes MEV rewards. This page is only for native stake account holders.

**"I don't see any unclaimed MEV"**
Your validator may not be running the Jito client.

**"Should I convert MEV to JitoSOL?"**
Converting gives you liquid staking benefits and automatic future MEV rewards, vs keeping as SOL which earns no additional rewards.

**"Why are the amounts so small?"**
MEV rewards are distributed frequently in small amounts.

## Need Help?

**Questions?** Visit our [Discord community](https://discord.gg/jitocommunity) for support.
