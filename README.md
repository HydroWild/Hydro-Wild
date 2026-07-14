# HydroWild — Headless Frontend Concept

Immersive headless storefront for hydrowild.com. Custom frontend, Shopify stays as the backend (products, cart, checkout) via Storefront API.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Structure

```
index.html          Homepage — creature flavor worlds scroll experience
product.html        Product page — themed per flavor via ?flavor=blue-raspberry
src/
  data/products.js  Real HydroWild catalog (seed/mock data)
  lib/shopify.js    Storefront API client — mock-switched (USE_MOCK)
  lib/cart.js       Cart store (localStorage) — syncs to Shopify cart when live
  js/ui.js          Nav, cart drawer, toast
  js/main.js        Homepage scroll choreography (GSAP + Lenis)
  js/product.js     Product page logic
public/assets/      All scraped brand assets (clean names)
assets/             Raw scrape originals (reference only)
BRAND.md            Brand reference — colors, fonts, products, story
```

## Going live with Shopify

1. HydroWild admin → Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes (unauthenticated_read_product_listings, unauthenticated_write_checkouts).
2. Paste the storefront access token into `src/lib/shopify.js` CONFIG.
3. Set `USE_MOCK = false`.
4. Map each flavor's variant ID into `products.js` (or fetch by handle at runtime — `fetchProductByHandle` is already built).

Checkout then flows through Shopify's real checkout — payments, shipping, taxes all untouched.

## Flavor → creature map

| Flavor | Creature | Color |
|---|---|---|
| Blue Raspberry | The Kraken | #29abe2 |
| Watermelon | Nessie | #4adb14 |
| Strawberry Lemonade | The Yeti | #ff5d8f |
| Fruit Punch | The Wampus Cat | #ff8327 |
