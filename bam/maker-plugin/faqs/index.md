---
title: FAQs
subtitle: Common questions about the Maker Plugin.
section_type: page
order: 26
---

# Frequently Asked Questions

**Can I pay more to go before a maker transaction?**

No. Phase 1 (maker transactions) always drains before Phase 2 (bundles + regular transactions). Higher fees or tips improve your priority within Phase 2 but cannot move work ahead of Phase 1.

**Does every BAM node run the maker plugin?**

At launch, the maker priority plugin will be available on BAM leaders connected to BAM nodes in the following regions: [insert regions here]

**Are maker transactions visible onchain?**

Yes. Maker transactions appear onchain as ordinary Solana transactions.

**Can market makers send transactions to both the Maker Priority Plugin TPU and the normal TPU?**

Yes. BAM will automatically drop transactions from the regular TPU if it was scheduled in Phase 1.

**Can I send bundles to the Maker Priority Plugin?**

No.
