# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

HydroWild's headless marketing storefront (hydrowild.com) — a kids/teens hydration drink brand. Custom vanilla JS/HTML/CSS frontend deployed on Vercel; Shopify stays the backend of record for products, cart, and checkout via the Storefront API. There is no framework (no React/Vue) — pages are static HTML entry points wired up by small per-page JS modules and built with Vite.

## Commands

```bash
npm install
npm run dev       # vite dev server, http://localhost:5173
npm run build     # production build (outputs per vite.config.js multi-page config)
npm run preview   # preview the production build
```

There is no test suite or linter configured in this repo.

## Architecture

**Multi-page Vite app.** Every top-level `.html` file (`index.html`, `product.html`, `shop.html`, `story.html`, `contact.html`, `ingredients.html`, `blog.html`, `post.html`, `best-kids-hydration-drink.html`) is a separate Rollup entry point registered in `vite.config.js`. Each page loads its own script from `src/js/<page>.js` (e.g. `product.html` → `src/js/product.js`). There's no client-side router — navigation is real page loads between static HTML files.

**Shopify integration goes through a server-side proxy.** `src/lib/shopify.js` never holds a Storefront API token — every GraphQL call is a `fetch('/api/shopify', ...)`, and `api/shopify.js` (a Vercel serverless function) injects `process.env.SHOPIFY_STOREFRONT_TOKEN` and forwards to Shopify. That endpoint also answers `GET` with `{ configured: boolean }`; `isLive()` in `shopify.js` caches that check so the client can tell real checkout apart from demo mode without ever seeing the token. With no token set in Vercel, checkout deep-links to the live hydrowild.com product pages instead of calling the API — this lets the site run and demo fully without credentials. Going live only requires setting `SHOPIFY_STOREFRONT_TOKEN` (and optionally `SHOPIFY_STORE_DOMAIN`) in Vercel's env vars (see `.env.example`) — flavor handles in `src/data/products.js` already map 1:1 to Shopify product handles, and variant IDs are resolved dynamically by handle (`fetchVariantByHandle` / `hydrateProducts`), not hardcoded. Variant IDs are prefetched and cached (`_variantCache`) whenever an item is added to cart, so checkout redirect is instant.

Note on checkout redirect: Shopify's `checkoutUrl` comes back on the store's primary domain, but that domain now points at this Vercel app (so `/cart/c/...` would 404 there). `checkout()` in `shopify.js` rewrites the host to `STORE_DOMAIN` (the `.myshopify.com` domain, labeled in that file — not a secret, unlike the token) before redirecting — see the comment block in that function before changing checkout behavior.

**Cart** (`src/lib/cart.js`) is a local `localStorage`-backed store with a pub/sub `subscribe()` API — no Shopify calls until checkout. `src/js/ui.js` renders the cart drawer/toast and drives the checkout flow, and is shared across every page.

**Product/flavor data** (`src/data/products.js`) is the seed/mock catalog (flavor names, creature mascots, colors, taglines, Shopify handles) used both for rendering and as fallback when the live API isn't hydrated. `hydrateProducts()` in `shopify.js` batch-fetches real prices/availability by handle on page load to keep displayed prices in sync with Shopify admin, falling back silently to static prices on failure.

**Flavor → creature system**: each flavor has a mascot ("critter") and a brand color, defined per-flavor in `products.js` and used throughout (product theming via `?flavor=` query param on `product.html`, Instagram wall cards, etc). See BRAND.md for the full flavor/color/character table — keep new flavor entries consistent with it.

**Serverless API** (`api/`): `api/subscribe.js` proxies email-capture popup submissions to Omnisend, keeping `OMNISEND_API_KEY` server-side. `api/shopify.js` proxies Storefront API GraphQL calls (product/variant reads, `cartCreate`), keeping `SHOPIFY_STOREFRONT_TOKEN` server-side. These are the only backend code outside Shopify's own hosted checkout.

**Styling**: single global stylesheet `src/styles/main.css`, using CSS custom properties for the brand palette (see BRAND.md for hex values / naming). Fonts are Purista (headlines) and Azo Sans (body); `@font-face` rules live in `main.css`, files in `public/fonts/`.

## Brand reference

`BRAND.md` is the source of truth for colors, typography, logo usage rules, flavor/creature mapping, and voice — read it before making visual or copy changes. Full brand PDFs are in `brand/docs/`; logos in `brand/logos/`; lifestyle photography in `brand/marketing/`; product mockups in `brand/product-images/`.

`public/agents.md` documents what's safe for external AI agents/crawlers to say about HydroWild (facts, claims, what not to invent) — useful context if working on AEO/GEO pages like `best-kids-hydration-drink.html` or the `llms.txt`/`llms-full.txt` files.

## Asset locations

- `public/assets/` — cleaned, in-use site assets (referenced by pages)
- `assets/` — raw scrape originals, reference only, not directly served
- `brand/` — official brand source files (logos, fonts, docs, marketing photography, product images)
