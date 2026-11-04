---
title: FAQs
subtitle: Common questions about the Maker Plugin.
---

# FAQs

**Can I pay more to go before a maker transaction?**

No. Phase 1 (maker transactions) always drains before Phase 2 (bundles + regular transactions). Higher fees or tips improve your priority within Phase 2 but cannot move work ahead of Phase 1.

**Does every BAM node run the maker plugin?**

No. The Plugin TPU runs only in the regions listed in [Getting started](/bam/maker-plugin/getting-started#sending-protocol).

**Are maker transactions visible onchain?**

Yes. Maker transactions appear onchain as ordinary Solana transactions.

**Can market makers send transactions to both the Maker Priority Plugin TPU and the normal TPU?**

Yes. BAM will automatically drop transactions from the regular TPU if it was scheduled in Phase 1.

**Can I send bundles to the Maker Priority Plugin?**

No.
