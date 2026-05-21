/* ==========================================================================
   CasinoSwipe Mock Database — Professional Luxury Edition
   ========================================================================== */

const CASINO_DATABASE = [
  {
    id: "slot-spin",
    name: "SpinRoyal",
    tagline: "Slots and luxury, served instantly.",
    bgType: "royal-neon",
    bgColor: "linear-gradient(135deg, #07080c 0%, #111422 60%, #1a1f33 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.1"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/><circle cx="80%" cy="20%" r="50" fill="#d4af37" filter="blur(30px)"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#d4af37" font-size="12" letter-spacing="1.5">SPIN ROYAL</text></svg>`,
    license: "MGA",
    livePlayers: 1420,
    rating: 4.8,
    welcomeBonus: "100% up to €500 + 200 FS",
    minDeposit: 10,
    withdrawalSpeed: "Instant",
    withdrawalSpeedCategory: "instant",
    restrictedCountries: ["USA", "France", "Spain"],
    availableCountries: ["Germany", "Canada", "New Zealand", "UK"],
    gameTypes: ["slots", "live", "sports", "crash"],
    vibeTags: ["#VIPProgram", "#HighRTP", "#MobileFirst"],
    bio: "SpinRoyal offers a premium high-roller experience tailored for slot aficionados. Experience rapid-fire withdrawals, exclusive jackpot drops, and a legendary 7-tier VIP program with personal concierges.",
    
    // Detailed Bonus subcards
    bonusBreakdown: {
      welcome: {
        title: "Double Your First Buy-in",
        amount: "100% up to €500",
        wagering: "35x",
        expiry: "30 Days",
        details: "Min deposit €20. Wagering applies to bonus amount only. Max bet €5 per spin."
      },
      freeSpins: {
        title: "200 Book of Dead Spins",
        count: "200 Free Spins",
        slot: "Book of Dead",
        value: "€0.10/spin",
        wagering: "40x",
        expiry: "7 Days"
      },
      noDeposit: {
        available: false,
        amount: "N/A"
      },
      weekly: {
        title: "Friday VIP Reload",
        description: "50% reload match up to €250 every Friday afternoon."
      },
      vip: {
        title: "Royal League",
        description: "7 Tiers, weekly 15% cashback, personalized gifts, and dedicated 24/7 account managers."
      }
    },
    
    // Payments
    payments: ["visa", "mastercard", "paypal", "skrill", "neteller", "paysafecard"],
    fastestPayment: "Skrill (Instant)",
    
    // Compliance & Limits
    wageringRating: "low",
    withdrawalLimitWeekly: 15000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/spinroyal?cpa=1"
  },
  {
    id: "crypto-clash",
    name: "BitVelocity",
    tagline: "No KYC. Pure Crypto. Wild Crash Games.",
    bgType: "cyber-punk",
    bgColor: "linear-gradient(135deg, #050609 0%, #0d0f17 60%, #151a2e 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.08"><defs><linearGradient id="cyber" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e05663"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><circle cx="20%" cy="30%" r="5" fill="#10b981"/><circle cx="80%" cy="80%" r="8" fill="#d4af37"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#e05663" font-size="12" letter-spacing="1">BIT VELOCITY</text></svg>`,
    license: "Curaçao",
    livePlayers: 3850,
    rating: 4.6,
    welcomeBonus: "150% up to 1 BTC + 50 FS",
    minDeposit: 2,
    withdrawalSpeed: "Under 1h",
    withdrawalSpeedCategory: "under-1h",
    restrictedCountries: ["UK", "USA"],
    availableCountries: ["Germany", "Canada", "New Zealand"],
    gameTypes: ["slots", "crash", "crypto", "poker"],
    vibeTags: ["#NoKYC", "#CryptoFriendly", "#MobileFirst"],
    bio: "Welcome to the future of betting. BitVelocity is an anonymous, ultra-fast casino supporting Bitcoin, Ethereum, and USDT with zero limits and instant blockchain payout authorizations.",
    
    bonusBreakdown: {
      welcome: {
        title: "Crypto Welcome Blast",
        amount: "150% up to 1 BTC",
        wagering: "45x",
        expiry: "14 Days",
        details: "Wagering applies to deposit + bonus. Support BTC, ETH, USDT, LTC, DOGE."
      },
      freeSpins: {
        title: "50 Zero-Wagering Spins",
        count: "50 Free Spins",
        slot: "Gates of Olympus",
        value: "0.0001 BTC/spin",
        wagering: "0x",
        expiry: "3 Days"
      },
      noDeposit: {
        available: true,
        amount: "0.0002 BTC (Sign-up)"
      },
      weekly: {
        title: "Crypto Cashdrop",
        description: "Random crypto airdrops to active players in the live chat lounge."
      },
      vip: {
        title: "Elite Miners Clan",
        description: "Earn passive staking yields, custom node flags, and VIP multipliers."
      }
    },
    
    payments: ["bitcoin", "eth", "usdt"],
    fastestPayment: "USDT (Instant)",
    
    wageringRating: "high",
    withdrawalLimitWeekly: 100000,
    kycRequirement: "no-kyc",
    rgTools: {
      depositLimits: false,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/bitvelocity?cpa=2"
  },
  {
    id: "neon-vegas",
    name: "VegasSync",
    tagline: "Vegas neon at your fingertips. Safe and certified.",
    bgType: "neon-vibe",
    bgColor: "linear-gradient(135deg, #050608 0%, #120e1c 50%, #201732 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.08"><circle cx="50%" cy="50%" r="90" fill="none" stroke="#e05663" stroke-width="1" stroke-dasharray="5 5"/><circle cx="50%" cy="50%" r="50" fill="none" stroke="#d4af37" stroke-width="1"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#10b981" font-size="12" letter-spacing="1">VEGAS SYNC</text></svg>`,
    license: "UKGC",
    livePlayers: 850,
    rating: 4.9,
    welcomeBonus: "100% up to £100 + 50 wager-free FS",
    minDeposit: 10,
    withdrawalSpeed: "Under 24h",
    withdrawalSpeedCategory: "under-24h",
    restrictedCountries: ["USA", "Germany", "Curaçao"],
    availableCountries: ["UK"],
    gameTypes: ["slots", "live", "sports", "poker"],
    vibeTags: ["#VIPProgram", "#HighRTP", "#MobileFirst"],
    bio: "Fully certified by the United Kingdom Gambling Commission. VegasSync specializes in high-RTP slots, live professional dealers direct from London studios, and strict responsible gambling safety.",
    
    bonusBreakdown: {
      welcome: {
        title: "British Match Bonus",
        amount: "100% up to £100",
        wagering: "30x",
        expiry: "30 Days",
        details: "UK players only. Min deposit £10. PayPal deposits excluded from bonus."
      },
      freeSpins: {
        title: "Wager-Free Big Bass Spins",
        count: "50 Free Spins",
        slot: "Big Bass Bonanza",
        value: "£0.10/spin",
        wagering: "0x",
        expiry: "7 Days"
      },
      noDeposit: {
        available: false,
        amount: "N/A"
      },
      weekly: {
        title: "Sunday Roast Cashback",
        description: "Get 10% real money cashback on any slots losses incurred over the weekend."
      },
      vip: {
        title: "The Lounge",
        description: "Strictly invite-only. Private dining invites, box tickets to sports matches."
      }
    },
    
    payments: ["visa", "mastercard", "paypal", "skrill", "neteller"],
    fastestPayment: "PayPal (under 2h)",
    
    wageringRating: "low",
    withdrawalLimitWeekly: 8000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/vegassync?cpa=3"
  },
  {
    id: "spin-date",
    name: "SpinMatch",
    tagline: "Swipe, match, and win. Fall in love with bonuses.",
    bgType: "playful-pink",
    bgColor: "linear-gradient(135deg, #09060b 0%, #1c0e1e 50%, #2b0e27 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.08"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#e05663" transform="scale(0.8) translate(15, 15)"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#e05663" font-size="12" letter-spacing="1">SPIN MATCH</text></svg>`,
    license: "Curaçao",
    livePlayers: 2100,
    rating: 4.7,
    welcomeBonus: "200% up to €1000 + 100 FS",
    minDeposit: 5,
    withdrawalSpeed: "Instant",
    withdrawalSpeedCategory: "instant",
    restrictedCountries: ["USA", "UK"],
    availableCountries: ["Canada", "New Zealand", "Germany"],
    gameTypes: ["slots", "live", "crash", "crypto"],
    vibeTags: ["#CryptoFriendly", "#MobileFirst", "#VIPProgram"],
    bio: "SpinMatch is a playful gaming community with massive match rates! Featuring unique social battles, slots matches, low minimum limits, and daily cash wheels that pay instant cash matches.",
    
    bonusBreakdown: {
      welcome: {
        title: "Affectionate Welcome Bundle",
        amount: "200% up to €1000",
        wagering: "38x",
        expiry: "21 Days",
        details: "Max bonus €1000. 200% multiplier on your first deposit. Wagering on bonus amount."
      },
      freeSpins: {
        title: "100 Sweet Bonanza Spins",
        count: "100 Free Spins",
        slot: "Sweet Bonanza",
        value: "€0.20/spin",
        wagering: "35x",
        expiry: "5 Days"
      },
      noDeposit: {
        available: true,
        amount: "€10 Free Chips (On Verification)"
      },
      weekly: {
        title: "Mid-week Date Reload",
        description: "Claim 100 Free Spins on selected Slots every Wednesday."
      },
      vip: {
        title: "Matchmaker Club",
        description: "Exclusive tournaments, birthday luxury rewards, and higher swiping multipliers."
      }
    },
    
    payments: ["visa", "mastercard", "skrill", "neteller", "bitcoin", "eth", "paysafecard"],
    fastestPayment: "Bitcoin (Instant)",
    
    wageringRating: "medium",
    withdrawalLimitWeekly: 20000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/spinmatch?cpa=4"
  },
  {
    id: "sports-strike",
    name: "BetStrike",
    tagline: "Sports, live betting, and slot matches in a snap.",
    bgType: "sport-turf",
    bgColor: "linear-gradient(135deg, #030807 0%, #0d1a16 60%, #152c25 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.06"><circle cx="0" cy="100%" r="100" fill="none" stroke="#10b981" stroke-width="4"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#10b981" font-size="12" letter-spacing="1">BET STRIKE</text></svg>`,
    license: "Kahnawake",
    livePlayers: 1800,
    rating: 4.5,
    welcomeBonus: "100% up to €250 Free Bet",
    minDeposit: 10,
    withdrawalSpeed: "Under 24h",
    withdrawalSpeedCategory: "under-24h",
    restrictedCountries: ["USA", "Germany"],
    availableCountries: ["Canada", "New Zealand", "UK"],
    gameTypes: ["sports", "slots", "live"],
    vibeTags: ["#MobileFirst", "#VIPProgram"],
    bio: "BetStrike connects slots matches with high-odds sports action. A robust bookmaker featuring dynamic virtual sports, cashout capabilities, and regular free bet bonuses.",
    
    bonusBreakdown: {
      welcome: {
        title: "Match Play Free Bet",
        amount: "100% up to €250 Free Bet",
        wagering: "5x (Sports)",
        expiry: "7 Days",
        details: "Place bet at minimum odds of 1.80. Free bet stake is not returned in winnings."
      },
      freeSpins: {
        title: "20 Sportsbook Spins",
        count: "20 Free Spins",
        slot: "Starbust",
        value: "€0.10/spin",
        wagering: "30x",
        expiry: "3 Days"
      },
      noDeposit: {
        available: false,
        amount: "N/A"
      },
      weekly: {
        title: "Weekly Acca Boost",
        description: "Up to 50% extra winnings on accumulators of 4+ sports folds."
      },
      vip: {
        title: "Pinnacle Club",
        description: "Free VIP skybox tickets, private odds adjustments, fast payout lines."
      }
    },
    
    payments: ["visa", "mastercard", "paypal", "skrill", "neteller"],
    fastestPayment: "Neteller (1-2 hours)",
    
    wageringRating: "low",
    withdrawalLimitWeekly: 10000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: false
    },
    affiliateLink: "https://example.com/affiliate/betstrike?cpa=5"
  },
  {
    id: "poker-face",
    name: "CardShark",
    tagline: "VIP Texas Hold'em and high-stakes dealer tables.",
    bgType: "poker-felt",
    bgColor: "linear-gradient(135deg, #080505 0%, #1c0e0e 55%, #2a1414 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.08"><rect x="10" y="10" width="15" height="22" fill="none" stroke="#fff" stroke-width="0.5" transform="rotate(15, 20, 20)"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#e05663" font-size="12" letter-spacing="1">CARD SHARK</text></svg>`,
    license: "MGA",
    livePlayers: 3200,
    rating: 4.8,
    welcomeBonus: "100% up to €1500 + €50 Free Tickets",
    minDeposit: 20,
    withdrawalSpeed: "Instant",
    withdrawalSpeedCategory: "instant",
    restrictedCountries: ["USA", "Australia"],
    availableCountries: ["Germany", "UK", "Canada", "New Zealand"],
    gameTypes: ["poker", "live", "slots"],
    vibeTags: ["#VIPProgram", "#HighRTP"],
    bio: "For the card sharks who demand table presence. A premier, modern live casino and poker network featuring high-speed servers, low rake tournaments, and premium VIP tables.",
    
    bonusBreakdown: {
      welcome: {
        title: "Deepstack Buy-in match",
        amount: "100% up to €1500",
        wagering: "30x",
        expiry: "60 Days",
        details: "Bonus releases in €10 increments for every 100 SharkPoints earned at cash tables."
      },
      freeSpins: {
        title: "N/A (Card Specialist)",
        count: "0 Free Spins",
        slot: "N/A",
        value: "N/A",
        wagering: "N/A",
        expiry: "N/A"
      },
      noDeposit: {
        available: true,
        amount: "€20 Poker Cash (Registration only)"
      },
      weekly: {
        title: "Sunday Rakeback",
        description: "Up to 40% rake return paid straight into your real cash wallet every Monday morning."
      },
      vip: {
        title: "Shark Alliance",
        description: "VIP poker overlays, custom avatars, priority tables, zero-fee withdrawals."
      }
    },
    
    payments: ["visa", "mastercard", "paypal", "skrill", "neteller", "bitcoin"],
    fastestPayment: "Bitcoin (Instant)",
    
    wageringRating: "low",
    withdrawalLimitWeekly: 25000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/cardshark?cpa=6"
  },
  {
    id: "wild-wild-slots",
    name: "WildFortune",
    tagline: "Outlaw slots and mega reloads. No limits.",
    bgType: "gold-rush",
    bgColor: "linear-gradient(135deg, #070605 0%, #191410 60%, #281e16 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.08"><circle cx="20%" cy="30%" r="40" fill="#d4af37" filter="blur(20px)"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#d4af37" font-size="12" letter-spacing="1">WILD FORTUNE</text></svg>`,
    license: "Curaçao",
    livePlayers: 1950,
    rating: 4.4,
    welcomeBonus: "100% up to €2000 + 300 FS",
    minDeposit: 15,
    withdrawalSpeed: "Under 1h",
    withdrawalSpeedCategory: "under-1h",
    restrictedCountries: ["UK", "USA", "Netherlands"],
    availableCountries: ["Canada", "New Zealand", "Germany"],
    gameTypes: ["slots", "live", "crash"],
    vibeTags: ["#NoKYC", "#CryptoFriendly", "#VIPProgram"],
    bio: "WildFortune is a rogue, action-oriented slots lounge with extremely loose restrictions and legendary high wagering rewards for bold players who ride out wild spin streaks.",
    
    bonusBreakdown: {
      welcome: {
        title: "Gold Digger Match",
        amount: "100% up to €2000",
        wagering: "48x",
        expiry: "14 Days",
        details: "Higher wagering rating. Wagering applies to deposit + bonus amount. Max bet limit €5."
      },
      freeSpins: {
        title: "300 Mustang Gold Spins",
        count: "300 Free Spins",
        slot: "Mustang Gold",
        value: "€0.25/spin",
        wagering: "45x",
        expiry: "10 Days"
      },
      noDeposit: {
        available: false,
        amount: "N/A"
      },
      weekly: {
        title: "Wednesday Gunslinger Spins",
        description: "Get 100 Free spins when you reload €50 or more on Wednesday."
      },
      vip: {
        title: "Outlaw Rangers",
        description: "Personal gold bars cashback, custom VIP hardware prizes, priority support lines."
      }
    },
    
    payments: ["visa", "mastercard", "bitcoin", "usdt", "eth"],
    fastestPayment: "USDT (Instant)",
    
    wageringRating: "high",
    withdrawalLimitWeekly: 30000,
    kycRequirement: "no-kyc",
    rgTools: {
      depositLimits: false,
      selfExclusion: true,
      coolOff: false
    },
    affiliateLink: "https://example.com/affiliate/wildfortune?cpa=7"
  },
  {
    id: "royal-palace",
    name: "GrandCasino",
    tagline: "Classic elegance and secure premium betting.",
    bgType: "classic-royal",
    bgColor: "linear-gradient(135deg, #040508 0%, #0d121c 60%, #151d2f 100%)",
    bgPattern: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" opacity="0.05"><circle cx="50%" cy="50%" r="140" fill="none" stroke="#fff" stroke-width="0.5"/></svg>`,
    logo: `<svg viewBox="0 0 100 30" width="100" height="30"><text x="10" y="21" font-family="'Space Grotesk', sans-serif" font-weight="700" fill="#d4af37" font-size="12" letter-spacing="1">GRAND CASINO</text></svg>`,
    license: "UKGC",
    livePlayers: 620,
    rating: 4.9,
    welcomeBonus: "100% up to £200 + 100 FS",
    minDeposit: 10,
    withdrawalSpeed: "Under 24h",
    withdrawalSpeedCategory: "under-24h",
    restrictedCountries: ["USA", "Germany", "Curaçao"],
    availableCountries: ["UK"],
    gameTypes: ["slots", "live", "poker"],
    vibeTags: ["#VIPProgram", "#HighRTP"],
    bio: "Experience royal luxury safely. GrandCasino caters to discerning UK players, featuring hundreds of premium high-definition live game suites and fully audited, transparent returns.",
    
    bonusBreakdown: {
      welcome: {
        title: "Royal Charter Welcome",
        amount: "100% up to £200",
        wagering: "25x",
        expiry: "30 Days",
        details: "Low wagering! Wagering on bonus amount only. Restricted games apply. Skrill/Neteller excluded."
      },
      freeSpins: {
        title: "100 Starburst Spins",
        count: "100 Free Spins",
        slot: "Starburst",
        value: "£0.10/spin",
        wagering: "30x",
        expiry: "7 Days"
      },
      noDeposit: {
        available: false,
        amount: "N/A"
      },
      weekly: {
        title: "Weekend Midsummer Bonus",
        description: "Claim £50 matched slot reload bonus every single Friday evening."
      },
      vip: {
        title: "Sovereign Tier",
        description: "Strictly limited to 100 concurrent players. VIP luxury events, concierge."
      }
    },
    
    payments: ["visa", "mastercard", "paypal"],
    fastestPayment: "PayPal (Instant - 1 hour)",
    
    wageringRating: "low",
    withdrawalLimitWeekly: 10000,
    kycRequirement: "standard",
    rgTools: {
      depositLimits: true,
      selfExclusion: true,
      coolOff: true
    },
    affiliateLink: "https://example.com/affiliate/grandcasino?cpa=8"
  }
];

// Helper to filter database based on search settings & preferences
function getMatchingCasinos(filters, sortBy = 'rating', boostActive = false) {
  let list = [...CASINO_DATABASE];
  
  // 1. Filter by country availability
  if (filters.country) {
    list = list.map(c => {
      const isAvailable = c.availableCountries.includes(filters.country);
      return { ...c, geoAvailable: isAvailable };
    });
  } else {
    list = list.map(c => ({ ...c, geoAvailable: true }));
  }
  
  // 2. Filter out geo-blocked
  list = list.filter(c => c.geoAvailable);

  // 3. Min Bonus Size
  if (filters.minBonusSize > 0) {
    list = list.filter(c => {
      const numMatch = c.welcomeBonus.match(/(\d+)/);
      const val = numMatch ? parseInt(numMatch[0]) : 0;
      return val >= filters.minBonusSize;
    });
  }

  // 4. Max Min Deposit Limit
  if (filters.maxMinDeposit > 0) {
    list = list.filter(c => c.minDeposit <= filters.maxMinDeposit);
  }

  // 5. Game Preference
  if (filters.games && filters.games.length > 0) {
    list = list.filter(c => {
      return filters.games.some(g => c.gameTypes.includes(g));
    });
  }

  // 6. Payment Methods
  if (filters.payments && filters.payments.length > 0) {
    list = list.filter(c => {
      return filters.payments.every(p => c.payments.includes(p));
    });
  }

  // 7. License Type
  if (filters.license && filters.license !== 'any') {
    list = list.filter(c => c.license.toLowerCase() === filters.license.toLowerCase());
  }

  // 8. KYC Toggle
  if (filters.noKycOnly) {
    list = list.filter(c => c.kycRequirement === 'no-kyc');
  }

  // 9. Responsible Gambling tools
  if (filters.rgToolsOnly) {
    list = list.filter(c => c.rgTools.depositLimits && c.rgTools.selfExclusion);
  }

  // 10. Withdrawal Speed
  if (filters.withdrawalSpeed && filters.withdrawalSpeed !== 'any') {
    list = list.filter(c => {
      if (filters.withdrawalSpeed === 'instant') return c.withdrawalSpeedCategory === 'instant';
      if (filters.withdrawalSpeed === 'under-1h') return ['instant', 'under-1h'].includes(c.withdrawalSpeedCategory);
      if (filters.withdrawalSpeed === 'same-day') return ['instant', 'under-1h', 'under-24h'].includes(c.withdrawalSpeedCategory);
      return true;
    });
  }

  // Boost feature handling
  if (boostActive) {
    list.sort((a, b) => {
      const aMatch = a.welcomeBonus.match(/(\d+)/);
      const aVal = aMatch ? parseInt(aMatch[0]) : 0;
      const bMatch = b.welcomeBonus.match(/(\d+)/);
      const bVal = bMatch ? parseInt(bMatch[0]) : 0;
      return bVal - aVal;
    });
  } else {
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'bonus') {
      list.sort((a, b) => {
        const aMatch = a.welcomeBonus.match(/(\d+)/);
        const aVal = aMatch ? parseInt(aMatch[0]) : 0;
        const bMatch = b.welcomeBonus.match(/(\d+)/);
        const bVal = bMatch ? parseInt(bMatch[0]) : 0;
        return bVal - aVal;
      });
    } else if (sortBy === 'minDeposit') {
      list.sort((a, b) => a.minDeposit - b.minDeposit);
    }
  }

  return list;
}
