---
title: 'Jito Interceptor Program'
order: 20
section_type: 'page'
subtitle: 'Understanding the Interceptor protection system for stake account deposits.'
---

## What is the Jito Interceptor?

Interceptor temporarily holds JitoSOL from stake account deposits for 10 hours, then automatically delivers it to you with no fees. **You don't need to do anything.**

### Why Interceptor Exists

Interceptor protects against "toxic flow" - when other liquid staking protocols use JitoSOL's liquidity to facilitate their own swaps, draining liquidity that should benefit JitoSOL users. Without Interceptor, competing LSTs can mint JitoSOL and immediately swap it for SOL, siphoning millions from JitoSOL pools.

**Key Benefits:**
- **Protects JitoSOL liquidity:** Prevents other protocols from draining pools
- **Automatic processing:** Your stakes are handled automatically  
- **Full rewards:** You earn staking and MEV rewards during cooldown
- **Better stability:** Helps maintain JitoSOL's peg and liquidity depth

## How It Works

### 10-Hour Cooldown Process
**For stake account deposits:**
1. **Immediate conversion:** Your stake account instantly becomes JitoSOL
2. **Secure holding:** JitoSOL held by Interceptor program for 10 hours
3. **Continuous rewards:** You earn full staking and MEV rewards throughout
4. **Automatic delivery:** Jito delivers your JitoSOL with no fees after cooldown

### Automatic Processing
**You don't need to do anything!** Jito's system automatically:
- Monitors all intercepted deposits
- Claims your JitoSOL after 10 hours
- Transfers JitoSOL directly to your wallet
- Charges no fees for automatic processing

### When You'll See Interceptor
**Interceptor applies to:**
- Depositing existing SOL stake accounts to JitoSOL

**Interceptor does NOT apply to:**
- Native SOL staking (direct SOL → JitoSOL)
- SPL token conversions (USDC, WBTC, etc.)
- Jupiter-based swaps to JitoSOL

## Managing Your Intercepted Stakes

Visit [jito.network/interceptor](https://www.jito.network/interceptor/) to see pending deposits with countdown timers:

![Interceptor Features](/shared/images/jitosol/interceptor-page-list-of-intercepted-stakes.png)

**Interface shows:** JitoSOL amount, time remaining, early claim fee, and claim button

## Early Claiming (Optional)

**Most users should wait** for free automatic delivery. Only claim early if you urgently need the tokens and can't wait the remaining time.

### How Early Claiming Works

If you need your JitoSOL before the 10-hour cooldown ends:

![Early Claim Modal](/shared/images/jitosol/interceptor-page-confirm-claim-with-fee.png)

1. **Review the fee:** Fee starts at ~10% and decreases linearly to 0% over 10 hours
2. **Acknowledge cost:** Check the box confirming you understand the fee
3. **Claim with fee:** Pay the fee to receive your JitoSOL immediately

**Fee Structure:**
- **Hour 0:** ~10% fee (maximum)
- **Hour 5:** ~5% fee (halfway)
- **Hour 10:** 0% fee (automatic delivery)

### When to Consider Early Claiming

**Good reasons:**
- Urgent DeFi opportunity requiring immediate liquidity
- Time-sensitive arbitrage or trading needs

**Not good reasons:**
- Impatience (better to wait for free delivery)
- Small amounts (fees often exceed gas costs)

## Frequently Asked Questions

**"Why is my stake being intercepted?"**
You deposited a stake account rather than native SOL. This protects the JitoSOL ecosystem from toxic flow.

**"Do I need to do anything?"**  
No! Your JitoSOL will be automatically delivered after 10 hours with no fees.

**"Am I earning rewards during the cooldown?"**
Yes, you earn full staking and MEV rewards throughout the entire cooldown period.

**"Can I cancel or modify my deposit?"**
No, deposits cannot be cancelled. You can either wait for automatic delivery or claim early with a fee.

**"What if I forget about my deposit?"**
No problem! Jito automatically delivers your JitoSOL after 10 hours. You don't need to remember or take any action.

**"Why doesn't this apply to regular SOL staking?"**
Native SOL deposits don't create the same toxic flow issues that Interceptor prevents.

## Key Takeaways

✅ **Set and forget:** Interceptor handles everything automatically  
✅ **Full rewards:** Earn staking and MEV rewards during the entire cooldown  
✅ **Free delivery:** No fees when you wait the full 10 hours  
✅ **Ecosystem protection:** Helps maintain JitoSOL's liquidity and stability  
✅ **Optional early access:** Available if you urgently need tokens (with declining fee)  

**Remember:** Interceptor protects all JitoSOL holders from toxic flow. Most users should wait for automatic delivery to avoid fees and support ecosystem health.

## Additional Resources

- **[Interceptor GitHub Repository](https://github.com/jito-foundation/stake-deposit-interceptor)** - Open source code and technical documentation
- **[Jito Discord](https://discord.com/invite/jitocommunity)** - Community support and updates
- **Security Audits:** [Certora Report](https://github.com/jito-foundation/stake-deposit-interceptor/blob/master/Certora_interceptor_security_report.pdf) and [OffsideLabs Report](https://github.com/jito-foundation/stake-deposit-interceptor/blob/master/OffsideLabs_interceptor_report.pdf)
