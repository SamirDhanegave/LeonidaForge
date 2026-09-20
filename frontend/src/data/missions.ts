import { Mission } from '../types';

export const MISSIONS_DATA: Mission[] = [
  {
    id: 'mis_01',
    slug: 'first-move-downtown-depository',
    title: 'First Move: Downtown Depository',
    category: 'Heists',
    description: 'Scout the security rotations and backdoor freight elevators of the downtown credit exchange in Vice City financial district.',
    protagonist: 'Both',
    location: 'Downtown Vice City Financial Plaza',
    estimatedDuration: '25-35 mins',
    estimatedReward: '$350,000 - $600,000',
    objectives: [
      'Photograph security camera blind spots around the basement loading dock',
      'Acquire an unmarked maintenance van without raising alarms',
      'Hack the exterior power relay box in under 90 seconds',
      'Lose 3-star pursuit heat by escaping through the subway drain culvert'
    ],
    prerequisites: 'Complete introductory prologue missions',
    sampleData: true,
    seoTitle: 'First Move: Downtown Depository - GTA 6 Heist Mission Guide',
    seoDescription: 'Complete walkthrough for Downtown Depository heist in GTA 6. Objectives, loadout recommendations, escape routes and reward breakdown.',
  },
  {
    id: 'mis_02',
    slug: 'keys-night-run',
    title: 'Keys Night Run: Smuggler Cove',
    category: 'Smuggling',
    description: 'Transport high-value contraband cargo across shallow sandbars in the Florida Keys archipelago under low-visibility rain cover.',
    protagonist: 'Jason',
    location: 'Southern Keys Archipelago',
    estimatedDuration: '15-20 mins',
    estimatedReward: '$140,000',
    objectives: [
      'Meet the offshore courier beacon 2 nautical miles south of Key Chiles',
      'Navigate shallow mangrove sandbars while avoiding marine patrol spotters',
      'Deliver the water-tight cargo crate to the abandoned fish cannery pier'
    ],
    prerequisites: 'Offshore boat license or watercraft purchase',
    sampleData: true,
    seoTitle: 'Keys Night Run: Smuggler Cove - GTA 6 Smuggling Mission Guide',
    seoDescription: 'Watercraft smuggling mission walkthrough in the Keys for GTA 6. Navigation tips, patrol evasion and max payout strategies.',
  },
  {
    id: 'mis_03',
    slug: 'mud-blood-and-airboats',
    title: 'Mud, Blood & Airboats',
    category: 'Story',
    description: 'Infiltrate a fortified alligator farm compound deep in the Grassrivers wetlands to recover stolen telemetry drives.',
    protagonist: 'Lucia',
    location: 'Grassrivers / Wetland Outskirts',
    estimatedDuration: '20 mins',
    estimatedReward: '$85,000 + Tech Blueprint',
    objectives: [
      'Steer fan-powered airboat through the sawgrass waterways',
      'Eliminate compound lookouts using suppressed sidearms',
      'Retrieve the encrypted telemetry flash drive from the desk safe',
      'Escape across the mudflats before cartel reinforcements arrive'
    ],
    sampleData: true,
    seoTitle: 'Mud, Blood & Airboats - GTA 6 Story Mission Guide',
    seoDescription: 'Detailed mission objectives, stealth tips and weapon loadout for Mud, Blood & Airboats story mission in GTA 6.',
  },
  {
    id: 'mis_04',
    slug: 'vice-beach-repo-clash',
    title: 'Vice Beach Repo Clash',
    category: 'Contracts',
    description: 'Locate and recover an impounded exotic sports car from a heavily guarded private valet courtyard on Ocean Drive.',
    protagonist: 'Lucia',
    location: 'Ocean Drive, Vice Beach',
    estimatedDuration: '12-15 mins',
    estimatedReward: '$45,000',
    objectives: [
      'Infiltrate the rear service alley of the luxury hotel',
      'Hotwire the target Grotti Cheetah without setting off horn alarms',
      'Ram through the exit gates and shake off pursuit along the causeway'
    ],
    sampleData: true,
    seoTitle: 'Vice Beach Repo Clash - GTA 6 Contract Walkthrough',
    seoDescription: 'Learn how to complete the Vice Beach Repo Clash contract in GTA 6 with zero vehicle damage bonuses.',
  },
  {
    id: 'mis_05',
    slug: 'leonard-county-fugitive',
    title: 'Bounty: Leonard County Fugitive',
    category: 'Bounties',
    description: 'Track down a bail jumper hiding in a trailer commune near Lake Leonida. Non-lethal capture yields double payout.',
    protagonist: 'Jason',
    location: 'Leonard County Rural Strip',
    estimatedDuration: '10-15 mins',
    estimatedReward: '$60,000 ($30,000 lethal)',
    objectives: [
      'Interrogate local roadside diner mechanic for suspect whereabouts',
      'Corner the suspect before he can start his modified pickup truck',
      'Subdue target with taser or melee takedown',
      'Deliver alive to the county sheriff lockup'
    ],
    sampleData: true,
    seoTitle: 'Bounty: Leonard County Fugitive - GTA 6 Bail Enforcement',
    seoDescription: 'Capture the Leonard County fugitive alive in GTA 6 to maximize your bounty earnings and unlock special rep.',
  },
  {
    id: 'mis_06',
    slug: 'gator-snapper-mystery',
    title: 'The Gator Snapper Mystery',
    category: 'Strangers & Freaks',
    description: 'Encounter eccentric viral wildlife influencers attempting hazardous stunts in the swamp backcountry.',
    protagonist: 'Both',
    location: 'Hamlet Roadside Attraction',
    estimatedDuration: '15 mins',
    estimatedReward: 'Unique Outfit + Social Clout Score',
    objectives: [
      'Film 3 stunt interactions with aggressive wildlife safely',
      'Rescue cameraman from mud pit before panic timer expires',
      'Escape angry crowd of swamp locals in an ATV'
    ],
    sampleData: true,
    seoTitle: 'The Gator Snapper Mystery - GTA 6 Strangers & Freaks Guide',
    seoDescription: 'Walkthrough and unique rewards for the Gator Snapper Mystery stranger encounter in GTA 6.',
  }
];

export const MISSION_CATEGORIES: Mission['category'][] = [
  'Story',
  'Strangers & Freaks',
  'Heists',
  'Contracts',
  'Smuggling',
  'Bounties',
];
