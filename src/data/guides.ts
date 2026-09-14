import { Guide } from '../types';

export const GUIDES_DATA: Guide[] = [
  {
    id: 'guide_01',
    slug: 'gta-6-fastest-car',
    title: 'Fastest Cars in GTA 6: Top Speed vs Acceleration Rankings',
    subtitle: 'A data-driven breakdown of Leonida’s fastest supercars, straight-line top speeds, and real track lap viability.',
    category: 'Vehicles',
    readTimeMinutes: 6,
    publishedDate: '2025-06-14',
    author: 'Leonida Forge Team',
    tags: ['Fastest Cars', 'Supercars', 'Speed Test', 'Top Speed'],
    sampleData: true,
    summary: 'When choosing a high-performance vehicle in GTA 6, pure top speed is only half the battle. In congested metropolitan streets like Downtown Vice City or winding keys causeways, acceleration and all-wheel drive stability consistently outperform raw velocity numbers.',
    sections: [
      {
        heading: '1. Top Speed vs Acceleration: Why Straight Lines Deceive',
        content: 'While top speed ratings determine how fast a vehicle travels down the open Interstate 97 corridor between Port Gellhorn and Vice Beach, corner exit speeds determine whether you win street sprints or lose police pursuit cones. Vehicles like the Pegassi Zorrusso benefit from AWD torque vectoring, allowing them to hit 60 mph in approximately 3.1 seconds even under slick tropical rain conditions.',
        callout: {
          type: 'stat',
          text: 'The Pegassi Zorrusso achieves an estimated 129.8 MPH top speed with a 3.1s 0-60 sprint, making it the premier track champion in our initial testing model.'
        }
      },
      {
        heading: '2. Top 3 Ranked Speed Demons in Leonida (Sample Model)',
        content: 'Based on current community vehicle telemetry models and physics simulation testing, here is how the top echelon shakes out:',
        bulletPoints: [
          'Pegassi Zorrusso (Super) — 129.8 mph top speed | AWD | $1,925,000. Exceptional cornering grip and immediate corner exit bite.',
          'Bravado Banshee GTS (Sports) — 124.0 mph top speed | RWD | $685,000. Best value-for-dollar drag racer with unmatched highway passing surge.',
          'Grotti Cheetah Classic (Sports) — 122.5 mph top speed | RWD | $865,000. Balanced mid-engine weight distribution with vintage 1980s Miami styling.'
        ]
      },
      {
        heading: '3. Upgrade Priorities for Max Velocity',
        content: 'If your goal is outrunning law enforcement interceptors on long bridge causeways, prioritize Engine Stage 3 and Turbo Tuning before suspension drops. Lowered suspensions on bumpy coastal asphalt can induce unwanted curb bounce that scrubs speed.',
        callout: {
          type: 'tip',
          text: 'Always install high-downforce spoilers if available. In current physics engines, aerodynamic downforce adds crucial high-speed stability without significantly penalizing top speed.'
        }
      }
    ],
    recommendedTools: [
      {
        title: 'Compare Top Speed Leaders',
        path: '/compare',
        description: 'See Zorrusso vs Banshee GTS vs Cheetah Classic in our 3-way telemetry matrix.',
        actionText: 'Compare Vehicles Now'
      },
      {
        title: 'Supercar Affordability Calculator',
        path: '/money',
        description: 'Calculate how many heist runs or play sessions you need to buy a $1.9M hypercar.',
        actionText: 'Open Money Planner'
      }
    ],
    relatedSearches: [
      'GTA 6 fastest bike',
      'GTA 6 car locations',
      'GTA 6 best cars',
      'GTA 6 cars under $1M'
    ],
    seoTitle: 'GTA 6 Fastest Cars Ranked: Top Speed & Acceleration Guide',
    seoDescription: 'Discover the fastest cars in GTA 6. Detailed top speed benchmarks, acceleration tests, prices and comparison between supercars in Leonida.'
  },
  {
    id: 'guide_02',
    slug: 'gta-6-fastest-bike',
    title: 'Fastest Motorcycles in GTA 6: Acceleration & Wheelie Dynamics',
    subtitle: 'Why two wheels dominate urban traffic weaving, wheelie-glitch mechanics, and getaway efficiency.',
    category: 'Vehicles',
    readTimeMinutes: 5,
    publishedDate: '2025-06-20',
    author: 'Leonida Forge Team',
    tags: ['Motorcycles', 'Fastest Bike', 'Wheelie Speed', 'Getaway'],
    sampleData: true,
    summary: 'Motorcycles in the GTA series have always presented high risk and high reward. In Leonida’s narrow downtown alleys and traffic-choked causeways, bikes like the Western Reever Custom offer unmatched agility that supercars simply cannot match.',
    sections: [
      {
        heading: '1. The Wheelie Acceleration Bonus Explained',
        content: 'Historical physics in RAGE titles grant bikes a temporary physics boost when sustaining a wheelie on flat pavement. Early telemetry indicates the Western Reever Custom can push past 133 MPH when leaned back on open highway straights, eclipsing several high-end supercars at a fraction of their purchase cost.',
        callout: {
          type: 'tip',
          text: 'Lean back slightly on long bridges to engage wheelie speed multipliers. Ensure road camber is flat to prevent high-speed wobbles.'
        }
      },
      {
        heading: '2. Top Motorcycles by Role',
        content: 'Choosing the right bike depends on your intended getaway route:',
        bulletPoints: [
          'Western Reever Custom — Pure top speed & wheelie runs ($260,000)',
          'Nagasaki Streetfighter — Rapid 0-60 sprint and urban alley knife-fights ($185,000)',
          'Dinka Enduro Cross — Mud and trail traversal across the Grassrivers swamp border ($68,000)'
        ]
      }
    ],
    recommendedTools: [
      {
        title: 'View Western Reever Specs',
        path: '/vehicles/western-reever-custom',
        description: 'Check pricing, top speed rating, and location hints for the Reever.',
        actionText: 'View Vehicle Details'
      },
      {
        title: 'Compare Bike vs Supercar',
        path: '/compare',
        description: 'See why a $260k bike can rival a $1.9M supercar in pure acceleration.',
        actionText: 'Open Comparison'
      }
    ],
    relatedSearches: [
      'GTA 6 fastest car',
      'GTA 6 vehicle locations',
      'GTA 6 money guide'
    ],
    seoTitle: 'GTA 6 Fastest Bikes: Top Speed, Acceleration & Handling Guide',
    seoDescription: 'Find the fastest motorcycles in GTA 6. Breakdown of wheelie mechanics, top speed ratings, pricing and getaway agility.'
  },
  {
    id: 'guide_03',
    slug: 'gta-6-money-guide',
    title: 'GTA 6 Money Making Guide: Fast Cash Strategies & Business Affordability',
    subtitle: 'From street-level convenience store heists to coastal contraband smuggling routes.',
    category: 'Money',
    readTimeMinutes: 8,
    publishedDate: '2025-07-02',
    author: 'Leonida Forge Team',
    tags: ['Money Guide', 'Fast Cash', 'Heists', 'Passive Income'],
    sampleData: true,
    summary: 'Accumulating capital in Leonida requires balancing active high-risk heists with sustainable passive revenue streams. This guide outlines how to plan your early bankroll and avoid money traps that drain your balance.',
    sections: [
      {
        heading: '1. Early Game Cash Flow: Don’t Buy Cars Too Early',
        content: 'One of the most common mistakes new players make in open-world crime sims is spending early mission payouts on depreciating sports cars. Early on, street-stolen vehicles like the Albany Washington or Vapid Dominator can be hotwired and repainted at Little Haiti chop shops for minimal expense, leaving your capital free for weapon upgrades and asset investments.',
        callout: {
          type: 'warning',
          text: 'Keep at least $250,000 in liquid reserves for mission setup fees and armor replenishment before purchasing luxury properties.'
        }
      },
      {
        heading: '2. High-Yield Activities Ranked by Dollars-Per-Hour',
        content: 'Our session efficiency models suggest the following payout tiers:',
        bulletPoints: [
          'Coordinated Heists (e.g. Downtown Depository) — $350k - $600k per 30-minute run with an experienced duo.',
          'Coastal Smuggling Runs (Keys waterways) — $120k - $160k per 15-minute boat run with minimal police interference.',
          'Bounty Enforcement (Leonard County) — $50k - $75k per target with live capture bonuses.'
        ]
      },
      {
        heading: '3. Calculating Playtime Requirements for Big Purchases',
        content: 'Before setting your sights on a $2.5M penthouse or high-end offshore boat, use our interactive Money Goal Calculator to determine exactly how many gaming sessions are required based on your personal playtime.'
      }
    ],
    recommendedTools: [
      {
        title: 'Money Goal Calculator',
        path: '/money',
        description: 'Input your target price and average session earnings to get an instant playtime roadmap.',
        actionText: 'Launch Money Calculator'
      },
      {
        title: 'Browse High Payout Missions',
        path: '/missions',
        description: 'Filter missions by estimated payout and duration to optimize your farming routes.',
        actionText: 'View Mission Directory'
      }
    ],
    relatedSearches: [
      'GTA 6 money',
      'GTA 6 fastest car',
      'GTA 6 100% completion',
      'GTA 6 missions'
    ],
    seoTitle: 'GTA 6 Money Making Guide: How to Get Rich Fast in Leonida',
    seoDescription: 'Master GTA 6 money making. Strategies for heists, smuggling, chop shops, and using our instant session affordability calculator.'
  },
  {
    id: 'guide_04',
    slug: 'gta-6-car-locations',
    title: 'GTA 6 Vehicle Locations: Where to Find Exotic & Rare Spawns',
    subtitle: 'Proven spawn hubs, dealership locations, and discreet back-alley spots across Leonida.',
    category: 'Vehicles',
    readTimeMinutes: 7,
    publishedDate: '2025-07-10',
    author: 'Leonida Forge Team',
    tags: ['Car Locations', 'Vehicle Spawns', 'Exotic Cars', 'Vice Beach'],
    sampleData: true,
    summary: 'You do not always need millions of dollars in the bank to get behind the wheel of a high-end exotic. High-wealth districts in Leonida regularly spawn supercars and rare muscle variants in designated valet circles, marinas, and scenic overlooks.',
    sections: [
      {
        heading: '1. Ocean Drive & Vice Beach Valet Corridors',
        content: 'Between the hours of 20:00 and 04:00 in-game time, the beachfront luxury hotels along Ocean Drive have the highest density of exotic sports cars in the entire game. Expect to encounter Grotti Cheetah Classics and Bravado Banshees parked along the curb or idling at traffic lights.',
        callout: {
          type: 'tip',
          text: 'Take stolen exotics directly to the Little Haiti chop shop to scrub the tracker and reduce initial police heat before stashing in your garage.'
        }
      },
      {
        heading: '2. Port Gellhorn & Industrial Strips',
        content: 'If you are hunting for heavy utility haulers, muscle cars, or tow trucks, Port Gellhorn’s logistics terminal is the primary spawn territory. Vapid Dominator drag setups often congregate around the shipping warehouses at night.',
        bulletPoints: [
          'Vapid Dominator FX — Roadside diner parking lots along the county border.',
          'Declasse Draugur 4x4 — Dirt trail staging areas outside the Grassrivers swamp perimeter.',
          'Shitzu Squalo 38 — Public docks and marina slipways in the southern archipelago.'
        ]
      }
    ],
    recommendedTools: [
      {
        title: 'Search All Vehicle Spawns',
        path: '/vehicles',
        description: 'Filter our 12+ vehicle database by category, price, and exact spawn hints.',
        actionText: 'Open Vehicle Database'
      },
      {
        title: 'Explore District Locations',
        path: '/locations',
        description: 'Locate safehouses, chop shops, and points of interest across Leonida.',
        actionText: 'Explore Locations'
      }
    ],
    relatedSearches: [
      'GTA 6 car locations',
      'GTA 6 fastest car',
      'GTA 6 map',
      'GTA 6 vehicle tracker'
    ],
    seoTitle: 'GTA 6 Car Locations: Exotic & Rare Vehicle Spawn Map Guide',
    seoDescription: 'Where to find the best cars in GTA 6 without buying them. Spawn locations on Ocean Drive, Port Gellhorn and secret garages across Leonida.'
  },
  {
    id: 'guide_05',
    slug: 'gta-6-100-percent-completion',
    title: 'GTA 6 100% Completion Checklist & Guide: What You Need',
    subtitle: 'The comprehensive roadmap to achieving full game completion across story, side activities, and collectibles.',
    category: 'Completion',
    readTimeMinutes: 9,
    publishedDate: '2025-07-18',
    author: 'Leonida Forge Team',
    tags: ['100% Completion', 'Checklist', 'Collectibles', 'Trophy Guide'],
    sampleData: true,
    summary: 'Reaching 100% completion in a modern Rockstar title requires methodical tracking across story milestones, strangers & freaks, recreational hobbies, miscellaneous collectibles, and map exploration.',
    sections: [
      {
        heading: '1. The 100% Requirement Breakdown (Estimated Structure)',
        content: 'Based on standard franchise completion mechanics, full completion is typically divided into five major weighted pillars:',
        bulletPoints: [
          'Main Story Missions (50%) — Completing all narrative missions with Lucia and Jason.',
          'Strangers & Freaks (10%) — Specific multi-part encounters across Leonida’s eccentric county side-stories.',
          'Hobbies & Pastimes (10%) — Airboat races, street drag competitions, scuba diving, and shooting ranges.',
          'Random Events & Encounters (14%) — Roadside ambushes, muggings stopped, and hitchhiker escorts.',
          'Miscellaneous & Collectibles (16%) — Sunken caches, secret package pickups, stunt jumps, and knife flights.'
        ],
        callout: {
          type: 'stat',
          text: 'You do not need to collect every single minor item to trigger the 100% trophy; usually a threshold of 50 out of 75 major collectibles is required.'
        }
      },
      {
        heading: '2. Best Practices for Not Missing Missable Content',
        content: 'Save often in rotating slots. Always complete character-specific side missions as soon as they appear on your map, especially before initiating point-of-no-return heist finales.',
        callout: {
          type: 'tip',
          text: 'Use our client-side Progress Tracker to tick off items as you play. Your progress persists in your browser without requiring any account signups.'
        }
      }
    ],
    recommendedTools: [
      {
        title: 'Launch 100% Progress Tracker',
        path: '/tracker',
        description: 'Interactive checklist covering story, side missions, collectibles, and activities.',
        actionText: 'Open Progress Tracker'
      },
      {
        title: 'Browse Mission Directory',
        path: '/missions',
        description: 'Check off completed missions and sync them directly with your tracker.',
        actionText: 'View Missions'
      }
    ],
    relatedSearches: [
      'GTA 6 100% completion',
      'GTA 6 missions',
      'GTA 6 map',
      'GTA 6 car locations'
    ],
    seoTitle: 'GTA 6 100% Completion Checklist & Guide: What You Need',
    seoDescription: 'Complete 100% walkthrough checklist for GTA 6. Track story missions, strangers, hobbies, collectibles and trophies with our browser tracker.'
  },
  {
    id: 'guide_06',
    slug: 'gta-6-best-cars',
    title: 'Best Cars in GTA 6 Ranked by Class & Value',
    subtitle: 'The undisputed top picks for supercars, muscle street racers, off-road swamp buggies, and getaway sedans.',
    category: 'Vehicles',
    readTimeMinutes: 6,
    publishedDate: '2025-07-25',
    author: 'Leonida Forge Team',
    tags: ['Best Cars', 'Car Rankings', 'Value Cars', 'Vehicle Guide'],
    sampleData: true,
    summary: 'There is no single "best" car in GTA 6 for all situations. A low-riding hypercar will instantly bottom out and sink in the sawgrass mud of the Grassrivers, while a bulky off-road truck will struggle to outrun police cruisers on the freeway.',
    sections: [
      {
        heading: '1. Best Overall Supercar: Pegassi Zorrusso',
        content: 'Combining AWD traction with 129.8 MPH top velocity, the Zorrusso remains the benchmark for paved racing in Leonida. Its high downforce allows high-speed sweepers without breaking traction.',
        callout: {
          type: 'stat',
          text: 'Overall Score: 93/100. Best for: Racing, Speed, Highway Getaways.'
        }
      },
      {
        heading: '2. Best Value Sports Car: Bravado Banshee GTS',
        content: 'At less than half the price of high-end exotics ($685,000), the Banshee GTS delivers nearly identical straight-line burst speed. Master its rear-wheel drive throttle feathering to unlock exceptional lap times.'
      },
      {
        heading: '3. Best Terrain Traversal: Declasse Draugur 4x4',
        content: 'Nothing handles the water hazards, mud banks, and sudden elevation drops of the Leonida wilderness like the Draugur. Equipped with heavy beadlock wheels and a reinforced roll-cage, it seats four crew members comfortably.'
      }
    ],
    recommendedTools: [
      {
        title: 'Compare Vehicle Classes',
        path: '/compare',
        description: 'Pit the Draugur against the Banshee and Zorrusso to see exact metric trade-offs.',
        actionText: 'Compare Vehicles'
      },
      {
        title: 'Vehicle Database & Filters',
        path: '/vehicles',
        description: 'Filter all 10 vehicle categories by price and performance rating.',
        actionText: 'Browse All Vehicles'
      }
    ],
    relatedSearches: [
      'GTA 6 fastest car',
      'GTA 6 car locations',
      'GTA 6 money guide'
    ],
    seoTitle: 'Best Cars in GTA 6 Ranked by Class & Value Guide',
    seoDescription: 'Rankings of the best cars in GTA 6 by class: best supercar, best value sports car, best off-road swamp buggy and best crew getaway vehicle.'
  },
  {
    id: 'guide_07',
    slug: 'gta-6-map',
    title: 'GTA 6 Leonida Map Breakdown: Districts, POIs & Secret Locations',
    subtitle: 'An exhaustive tactical overview of Vice City, Port Gellhorn, the Florida Keys counterpart, and the wetlands.',
    category: 'Locations',
    readTimeMinutes: 7,
    publishedDate: '2025-08-01',
    author: 'Leonida Forge Team',
    tags: ['Leonida Map', 'Vice City', 'Districts', 'Secret Locations'],
    sampleData: true,
    summary: 'The State of Leonida is the largest and most ecologically varied game world ever built for the Grand Theft Auto franchise, featuring dense neon metropolitan zones, vast swamp wetlands, and island archipelagos.',
    sections: [
      {
        heading: '1. Metropolitan Hub: Vice Beach & Downtown',
        content: 'The eastern edge of the map is dominated by the sparkling waters of Vice Beach and the towering commercial skyscrapers of Downtown. These areas offer high verticality, rooftop helipads, and rapid transit highways, but are also subject to dense police presence.',
        callout: {
          type: 'tip',
          text: 'Use the causeway bridges to funnel pursuing patrol cruisers into narrow chokepoints when fleeing 4-star warrants.'
        }
      },
      {
        heading: '2. The Wilderness: Grassrivers & The Keys',
        content: 'Venturing west leads into the sawgrass mudflats of the Grassrivers, where regular civilian vehicles quickly become bogged down. Moving south over the overseas highway brings you to the Keys archipelago, where watercraft and aircraft become essential for rapid traversal.',
        bulletPoints: [
          'Port Gellhorn — Industrial heartland with container shipyards and rail hubs.',
          'Ambrosia — Rural county seat famous for dirt tracks and illicit distilleries.',
          'Key Chiles — Pristine coral reefs and sunken historical shipwreck caches.'
        ]
      }
    ],
    recommendedTools: [
      {
        title: 'Open Location Explorer',
        path: '/locations',
        description: 'Browse categorized locations across all Leonida districts with coordinate hints.',
        actionText: 'Browse Locations'
      },
      {
        title: 'Check Off Explored Locations',
        path: '/tracker',
        description: 'Track your map discovery percentage in our client-side tracker.',
        actionText: 'Open Tracker'
      }
    ],
    relatedSearches: [
      'GTA 6 map',
      'GTA 6 car locations',
      'GTA 6 100% completion',
      'GTA 6 missions'
    ],
    seoTitle: 'GTA 6 Leonida Map Guide: Districts, POIs & Secret Spots',
    seoDescription: 'Explore the full map of GTA 6 Leonida. Deep dive into Vice City, Port Gellhorn, Grassrivers wetlands, the Keys, and secret loot locations.'
  }
];

export const GUIDE_CATEGORIES: Guide['category'][] = [
  'Vehicles',
  'Money',
  'Missions',
  'Completion',
  'Locations',
  'Beginner',
];
