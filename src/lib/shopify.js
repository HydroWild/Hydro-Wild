// ─────────────────────────────────────────────────────────────
// Shopify Storefront API client — REAL implementation, mock-switched.
//
// TO GO LIVE: get a Storefront API access token from the HydroWild
// Shopify admin (Settings → Apps → Develop apps → Storefront API),
// drop it in CONFIG below, set USE_MOCK = false. Done.
// ─────────────────────────────────────────────────────────────

export const USE_MOCK = true;

const CONFIG = {
  domain: 'hydrowild.com',            // or the *.myshopify.com domain
  storefrontToken: '',                // ← paste token here
  apiVersion: '2024-10',
};

const ENDPOINT = `https://${CONFIG.domain}/api/${CONFIG.apiVersion}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': CONFIG.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Real Storefront API calls ────────────────────────────────

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

export async function createCart(lines) {
  const data = await gql(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl totalQuantity }
        userErrors { message }
      }
    }`,
    { lines }
  );
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

export async function addCartLines(cartId, lines) {
  const data = await gql(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity }
        userErrors { message }
      }
    }`,
    { cartId, lines }
  );
  const { cart, userErrors } = data.cartLinesAdd;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return cart;
}

// ── Checkout entry point used by the UI ──────────────────────
// Mock mode: hands the cart off to HydroWild's existing Shopify
// cart via permalink so checkout still "works" in the demo.

export async function checkout(items) {
  if (USE_MOCK) {
    // Shopify cart permalinks need variant IDs; until we have API
    // access we deep-link to the product pages' live cart instead.
    window.open(`https://${CONFIG.domain}/cart`, '_blank');
    return;
  }
  const lines = items.map((i) => ({ merchandiseId: i.variantId, quantity: i.qty }));
  const cart = await createCart(lines);
  window.location.href = cart.checkoutUrl;
}
