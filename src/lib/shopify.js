// ─────────────────────────────────────────────────────────────
// HydroWild Headless Shopify — Storefront API client (Cart API)
//
// The Storefront access token is a server-side secret (SHOPIFY_STOREFRONT_TOKEN,
// set in Vercel) — this module never sees it. Every GraphQL call goes through
// /api/shopify (see api/shopify.js), which injects the token and forwards the
// request to Shopify. That endpoint also exposes a cheap GET config check so
// the client can tell live checkout apart from demo mode without the token.
//
// No token configured server-side → checkout deep-links to the live
// hydrowild.com product pages instead, so the site still runs and demos
// fully without credentials.
// ─────────────────────────────────────────────────────────────

const PROXY_ENDPOINT = '/api/shopify';

// Store's .myshopify.com domain — not a secret, safe to label here. Used to
// rewrite Shopify's returned checkoutUrl (see checkout() below) and must
// match SHOPIFY_STORE_DOMAIN on the server if that's ever overridden.
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'hydrowild.myshopify.com';

class NotConfiguredError extends Error {}

// ── Live/demo detection ──────────────────────────────────────
// Cached after first call — cheap to call from anywhere (ui.js, checkout()).
let _liveCheck = null;
export function isLive() {
  if (!_liveCheck) {
    _liveCheck = fetch(PROXY_ENDPOINT)
      .then((res) => (res.ok ? res.json() : { configured: false }))
      .then((data) => Boolean(data.configured))
      .catch(() => false);
  }
  return _liveCheck;
}

// ── Variant ID cache — pre-warmed on cart.add so checkout is instant ──
const _variantCache = new Map(); // handle → Shopify variant GID

// ── GraphQL client (via server-side proxy) ───────────────────
async function gql(query, variables = {}) {
  const res = await fetch(PROXY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 503) throw new NotConfiguredError('Storefront API not configured');
  if (!res.ok) throw new Error(`Shopify API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Product queries ──────────────────────────────────────────

/**
 * Get a product's first variant ID by handle.
 * HydroWild's single-SKU products each have one variant.
 */
export async function fetchVariantByHandle(handle) {
  const data = await gql(
    `query VariantByHandle($handle: String!) {
      product(handle: $handle) {
        title
        variants(first: 1) {
          nodes { id availableForSale price { amount currencyCode } }
        }
      }
    }`,
    { handle }
  );
  const variant = data?.product?.variants?.nodes?.[0];
  if (!variant) throw new Error(`No variant found for product: ${handle}`);
  return variant;
}

/**
 * Prefetch + cache a variant ID for a given product handle.
 * Call this immediately when an item is added to cart so checkout
 * doesn't need to wait for the API round-trip.
 */
export async function prefetchVariant(handle) {
  if (_variantCache.has(handle)) return;
  try {
    const variant = await fetchVariantByHandle(handle);
    _variantCache.set(handle, variant.id);
  } catch {
    // Non-fatal (including demo mode / NotConfiguredError) — checkout
    // will fetch it on demand if the cache misses, or fall back to demo.
  }
}

/** Full product with all variants — used for PDP upsells etc. */
export async function fetchProductByHandle(handle) {
  const data = await gql(
    `query Product($handle: String!) {
      product(handle: $handle) {
        id title description handle
        featuredImage { url altText }
        variants(first: 10) {
          nodes { id title availableForSale price { amount currencyCode } }
        }
      }
    }`,
    { handle }
  );
  return data.product;
}

// ── Cart mutations ───────────────────────────────────────────

async function createShopifyCart(lines) {
  const data = await gql(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl totalQuantity }
        userErrors { field message }
      }
    }`,
    { lines }
  );
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join(', '));
  return cart;
}

// ── Price hydration ──────────────────────────────────────────

/**
 * Batch-fetch real prices + variant IDs for a list of product handles.
 * Returns a Map: handle → { price: number, variantId: string, available: boolean }
 * Also warms the variant cache so checkout is instant.
 *
 * Call this on page load so displayed prices always match Shopify — even
 * after the client updates pricing in their admin.
 */
export async function hydrateProducts(handles) {
  if (!handles.length) return new Map();

  // Single batched GraphQL query — one round-trip for all products
  const fields = `variants(first: 1) { nodes { id availableForSale price { amount } compareAtPrice { amount } } }`;
  const aliases = handles.map((h, i) => `p${i}: product(handle: "${h}") { ${fields} }`).join('\n');

  let data;
  try {
    data = await gql(`query HydrateProducts { ${aliases} }`);
  } catch {
    return new Map(); // Non-fatal (including demo mode) — fall back to static prices
  }

  const result = new Map();
  handles.forEach((handle, i) => {
    const variant = data[`p${i}`]?.variants?.nodes?.[0];
    if (!variant) return;
    const price = parseFloat(variant.price.amount);
    const comparePrice = variant.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : null;
    result.set(handle, { price, comparePrice, variantId: variant.id, available: variant.availableForSale });
    _variantCache.set(handle, variant.id); // warm cache for instant checkout
  });
  return result;
}

// ── Checkout entry point ─────────────────────────────────────
/**
 * cartItems: local cart items from cart.js — { id, handle, name, img, price, qty }
 *
 * Real flow:
 *  1. Resolve Shopify variant IDs in parallel (uses prefetch cache where warm)
 *  2. Create a Shopify cart with the Cart API's cartCreate mutation
 *  3. Redirect to Shopify's hosted checkoutUrl
 *
 * Local cart is intentionally NOT cleared before redirect — if the user
 * hits back from the Shopify checkout page their cart is still intact.
 *
 * Demo flow (no SHOPIFY_STOREFRONT_TOKEN configured):
 *  Deep-link to the product page on hydrowild.com so the demo feels
 *  functional without needing an API token.
 */
export async function checkout(cartItems = []) {
  if (!cartItems.length) return;

  if (!(await isLive())) {
    const handles = [...new Set(cartItems.map((i) => i.handle).filter(Boolean))];
    const url = handles.length === 1
      ? `https://hydrowild.com/products/${handles[0]}`
      : `https://hydrowild.com/collections/all`;
    window.open(url, '_blank');
    return;
  }

  // ── Real headless flow ──────────────────────────────────────

  // 1. Resolve variant IDs — cache hit = no extra fetch
  const uniqueHandles = [...new Set(cartItems.map((i) => i.handle))];
  const variantMap = Object.fromEntries(
    await Promise.all(
      uniqueHandles.map(async (handle) => {
        if (_variantCache.has(handle)) return [handle, _variantCache.get(handle)];
        const variant = await fetchVariantByHandle(handle);
        _variantCache.set(handle, variant.id);
        return [handle, variant.id];
      })
    )
  );

  // 2. Build cart lines
  const lines = cartItems.map((item) => ({
    merchandiseId: variantMap[item.handle],
    quantity:      item.qty,
  }));

  // 3. Create Shopify cart + redirect (local cart stays alive)
  const shopifyCart = await createShopifyCart(lines);

  // Shopify returns checkoutUrl on the store's PRIMARY domain (hydrowild.com).
  // That domain now points to this headless storefront on Vercel, so the
  // /cart/c/... checkout path 404s. Rewrite the host to the Shopify-served
  // domain (same host the Storefront API uses) so checkout resolves to
  // Shopify's hosted checkout instead of the Vercel app.
  let redirectUrl = shopifyCart.checkoutUrl;
  try {
    const u = new URL(shopifyCart.checkoutUrl);
    u.host = STORE_DOMAIN;
    redirectUrl = u.toString();
  } catch {
    // If parsing ever fails, fall back to the raw checkoutUrl.
  }
  window.location.href = redirectUrl;
}
