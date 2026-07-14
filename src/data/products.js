// HydroWild product catalog — real data pulled from hydrowild.com.
// When the Storefront API goes live, this becomes fallback/seed data only.

export const FLAVORS = [
  {
    id: 'blue-raspberry',
    handle: 'kids-daily-hydration-drink-mix-blue-raspberry',
    name: 'Blue Raspberry',
    creature: 'The Kraken',
    creatureImg: '/assets/img/creature-kraken.png',
    packImg: '/assets/img/pack-blue-raspberry.png',
    tagline: 'Deep-sea legend. Deep blue flavor.',
    lore: 'Straight from the trenches — the Kraken guards the boldest blue raspberry in the wild.',
    color: '#29abe2',
    colorDark: '#0b5f8a',
    bg: '#062a44',
    price: 14.99,
  },
  {
    id: 'watermelon',
    handle: 'kids-daily-hydration-drink-mix-watermelon',
    name: 'Watermelon',
    creature: 'Nessie',
    creatureImg: '/assets/img/creature-nessie.png',
    packImg: '/assets/img/pack-watermelon.png',
    tagline: 'Lake-monster fresh. Summer all year.',
    lore: 'Nessie only surfaces for one thing — juicy watermelon with zero sugar in sight.',
    color: '#4adb14',
    colorDark: '#1f7d05',
    bg: '#0b3311',
    price: 14.99,
  },
  {
    id: 'strawberry-lemonade',
    handle: 'kids-daily-hydration-drink-mix-strawberry-lemonade',
    name: 'Strawberry Lemonade',
    creature: 'The Yeti',
    creatureImg: '/assets/img/creature-yeti.png',
    packImg: '/assets/img/pack-strawberry-lemonade.png',
    tagline: 'Mountain-cold. Pink-lightning sweet.',
    lore: 'The Yeti hauls strawberry lemonade to the summit. Ice cold, every single time.',
    color: '#ff5d8f',
    colorDark: '#b81d55',
    bg: '#3d0a22',
    price: 14.99,
  },
  {
    id: 'fruit-punch',
    handle: 'kids-daily-hydration-drink-mix-fruit-punch',
    name: 'Fruit Punch',
    creature: 'The Wampus Cat',
    creatureImg: '/assets/img/creature-wampus.png',
    packImg: '/assets/img/pack-fruit-punch.png',
    tagline: 'Backwoods beast. Full-punch flavor.',
    lore: 'The Wampus Cat prowls at dusk for one reason — a fruit punch that actually punches.',
    color: '#ff8327',
    colorDark: '#c14e00',
    bg: '#3a1602',
    price: 14.99,
  },
];

export const BUNDLES = [
  {
    id: 'variety-pack',
    handle: 'wild-variety-pack-all-4-flavors',
    name: 'Wild Variety Pack',
    desc: 'All 4 flavors. All 4 creatures. One box.',
    img: '/assets/img/starter-kit.png',
    price: 14.99,
  },
];

export const getFlavor = (id) => FLAVORS.find((f) => f.id === id);
