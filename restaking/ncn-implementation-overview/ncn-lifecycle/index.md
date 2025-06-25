---
title: NCN Lifecycle
order: 10
subtitle: The three recurring phases of a Node Consensus Network
section_type: page
---

### NCN Lifecycle

The Node Consensus Network operates in a well-defined lifecycle that consists of three main phases:

1. **Initial Setup (One-time)**: This phase involves establishing the foundational infrastructure of the NCN. It includes:

   - Configuring the NCN parameters
   - Initializing the vault registry
   - Registering supported token types and assigning weights

     The initial setup is performed only once when the NCN is first deployed, with occasional administrative updates as needed (such as adjusting token weights or adding new supported tokens).

2. **Snapshotting (Recurring)**: At the beginning of each consensus cycle (epoch), the system captures the current state of all participants:

   - Creating epoch state and weight tables
   - Taking snapshots of operator stake weights
   - Recording vault-operator delegations
   - Calculating total voting power distribution

     This phase ensures that voting is based on a consistent, point-in-time view of the network, preventing manipulation during the voting process.

3. **Voting (Recurring)**: After snapshotting is complete, operators can cast their votes:
   - Operators submit their choices (e.g., weather status)
   - Votes are weighted according to the operator's stake