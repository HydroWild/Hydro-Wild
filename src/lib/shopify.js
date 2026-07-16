// ─────────────────────────────────────────────────────────────
// HydroWild Headless Shopify — Storefront API client
//
// TO ACTIVATE:
//  1. Shopify Admin → Settings → Apps → Develop apps → Create app
//  2. Under "API credentials" → Configure Storefront API scopes:
//       ✓ unauthenticated_read_product_listings
//       ✓ unauthenticated_read_product_inventory
//       ✓ unauthenticated_write_checkouts
//       ✓ unauthenticated_write_customers
//  3. Install the app → copy the "Storefront API access token"
//  4. Paste it in CONFIG.storefrontToken below
//  5. Set USE_MOCK = false
// ─────────────────────────────────────────────────────────────

export const USE_MOCK = true; // ← flip to false once token is added

const CONFIG = {
  domain:          'hydrowild.com',
  storefrontToken: '',            // ← paste your Storefront API access token here
  apiVersion:      '2024-10',
};

const ENDPOINT = `https://${CONFIG.domain}/api/${CONFIG.apiVersion}/graphql.json`;

// ── Variant ID cache — pre-warmed on cart.add so checkout is instant ──
const _variantCache = new Map(); // handle → Shopify variant GID

// ── GraphQL client ───────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':                       'application/json',
      'X-Shopify-Storefront-Access-Token':  CONFIG.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });
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
  if (USE_MOCK || _variantCache.has(handle)) return;
  try {
    const variant = await fetchVariantByHandle(handle);
    _variantCache.set(handle, variant.id);
  } catch {
    // Non-fatal — checkout will fetch it on demand if cache misses
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

// ── Checkout entry point ─────────────────────────────────────
/**
 * cartItems: the full local cart items array from cart.js
 * Each item has: { id, handle, name, img, price, qty }
 *
 * Flow (real mode):
 *  1. Fetch Shopify variant IDs for all unique handles in parallel
 *  2. Create a Shopify cart with those line items
 *  3. Redirect to Shopify's hosted checkout URL
 *
 * Flow (mock mode):
 *  Deep-link to the product page(s) on hydrowild.com so the
 *  demo still feels functional without an API token.
 */
export async function checkout(cartItems = []) {
  if (!cartItems.length) return;

  if (USE_MOCK) {
    const handles = [...new Set(cartItems.map((i) => i.handle).filter(Boolean))];
    const url = handles.length === 1
      ? `https://${CONFIG.domain}/products/${handles[0]}`
      : `https://${CONFIG.domain}/collections/all`;
    window.open(url, '_blank');
    return;
  }

  // ── Real headless flow ──────────────────────────────────────

  // 1. Resolve variant IDs — use cache where available, fetch the rest in parallel
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

  // 2. Build cart line items
  const lines = cartItems.map((item) => ({
    merchandiseId: variantMap[item.handle],
    quantity:      item.qty,
  }));

  // 3. Create Shopify cart + redirect to checkout
  const shopifyCart = await createShopifyCart(lines);
  window.location.href = shopifyCart.checkoutUrl;
}
