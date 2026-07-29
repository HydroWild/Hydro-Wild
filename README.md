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
  lib/shopify.js    Storefront API client — talks to /api/shopify, demo-switched (isLive)
  lib/cart.js       Cart store (localStorage) — syncs to Shopify cart when live
  js/ui.js          Nav, cart drawer, toast
  js/main.js        Homepage scroll choreography (GSAP + Lenis)
  js/product.js     Product page logic
public/assets/      All scraped brand assets (clean names)
assets/             Raw scrape originals (reference only)
BRAND.md            Brand reference — colors, fonts, products, story
```

## Going live with Shopify

1. HydroWild admin → Settings → Apps and sales channels → Develop apps → create app → Storefront API scopes (unauthenticated_read_product_listings, unauthenticated_read_product_inventory, unauthenticated_write_checkouts).
2. In Vercel → Project → Settings → Environment Variables, set `SHOPIFY_STOREFRONT_TOKEN` to the storefront access token. It stays server-side — `api/shopify.js` proxies GraphQL calls so the token never ships to the browser.
3. Variant IDs are resolved at runtime by product handle (`fetchVariantByHandle` / `hydrateProducts` in `src/lib/shopify.js`) — no static ID list to maintain as long as each flavor's `handle` in `products.js` matches its Shopify handle.
4. That's it — the cart drawer's "Checkout" button auto-detects the token via a `GET /api/shopify` config check and switches from the demo deep-link to real Cart API checkout (`cartCreate` → redirect to `checkoutUrl`).

Checkout then flows through Shopify's real hosted checkout — payments, shipping, discounts, and taxes all untouched.

## Flavor → creature map

| Flavor | Creature | Color |
|---|---|---|
| Blue Raspberry | The Kraken | #29abe2 |
| Watermelon | Nessie | #4adb14 |
| Strawberry Lemonade | The Yeti | #ff5d8f |
| Fruit Punch | The Wampus Cat | #ff8327 |
