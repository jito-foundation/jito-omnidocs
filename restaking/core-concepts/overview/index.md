---
title: "Overview"
subtitle: "A basic overview of the Jito Restaking architecture."
section_type: "page"
order: 0
---

## Jito Restaking Architecture Overview

The Jito (Re)Staking protocol facilitates the relationship between three components:

- [NCN](/restaking/basics/ncn)
- [Operator](/restaking/basics/operator)
- [Vault](/restaking/basics/vault)

<figure>
    <img src="/shared/images/restaking/active_stake.png" alt="Active"/>
    <figcaption>
        Figure 1: Active Relationship State - Visual representation of the three-way relationship between NCN, Operator, and Vault components when all have opted in, resulting in activated stake.
    </figcaption>
</figure>

All three components must opt-in to a three-way relationship in order to warm-up and activate a staked relationship.

If any of the three components is not "opt-in", there is no stake i.e. the relationship between each component is inactive. 
Additionally, any component can opt-out of active staked relationships, in which case the protocol will cool down the relationship in the next epoch and deactivate stake. 
Conversely, relationships can be warmed up.

<figure>
    <img src="/shared/images/restaking/inactive.png" alt="Inactive"/>
    <figcaption>
        Figure 2: Inactive Relationship State - Visual representation of what happens when one or more components haven't opted in or have opted out, resulting in a deactivated stake.
    </figcaption>
</figure>
