---
title: Liquid Staking Security
description: How Jito ensures the security of staked assets
section_type: page
order: 20
domain: jitosol
---

# JitoSOL Security Now

Security is a top priority for the Jito liquid staking protocol. This page outlines the security measures in place to protect staked assets.

![JitoSOL Overview](shared/images/1.png)

## Smart Contract Security

The JitoSOL protocol has undergone rigorous security audits by leading firms in the industry:

- **Halborn**: Completed a comprehensive audit in Q1 2023
- **OtterSec**: Conducted a specialized audit focused on the staking and rewards distribution mechanisms
- **Code4rena**: Hosted a competitive audit contest with participation from top security researchers

All audits are publicly available in the [Jito GitHub repository](https://github.com/jito-foundation/jito-staking/tree/main/audits).

## Validator Set Security

JitoSOL distributes stake across a carefully selected set of validators to ensure high uptime and minimize risk:

- Validators are selected based on performance history, security practices, and geographic distribution
- No single validator receives more than 2% of the total stake
- Regular monitoring ensures validators maintain high standards of operation

The current validator set can be viewed at [stake.jito.network/validators](https://stake.jito.network/validators).

## Emergency Procedures

Jito has established clear procedures for responding to potential security incidents:

1. **Monitoring**: 24/7 automated monitoring of the protocol
2. **Response Team**: Dedicated security team ready to respond to incidents
3. **Emergency Unstaking**: Capability to unstake funds rapidly in case of critical vulnerabilities

## Risk Mitigation

Several measures are in place to mitigate potential risks:

- Gradual rollout of new features with extensive testing
- Conservative approach to protocol upgrades
- Regular security practices review and improvement

### Slashing Protection

JitoSOL implements protection against validator slashing:

```rust
// Example of slashing protection in the Jito staking program
pub fn handle_validator_slashing(
    ctx: Context<HandleSlashing>,
    validator_vote_account: Pubkey,
) -> Result<()> {
    // Verify the slashing event
    let slashing_info = get_slashing_info(validator_vote_account)?;
    
    // Calculate the impact on the pool
    let impact = calculate_slashing_impact(slashing_info)?;
    
    // Redistribute stake to maintain security
    redistribute_stake(ctx, impact)?;
    
    // Update pool metrics
    update_pool_metrics(ctx)?;
    
    Ok(())
}
```

For more information about JitoSOL security or to report a vulnerability, contact the Jito security team at security@jito.network. 
