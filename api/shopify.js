// api/shopify.js — HydroWild Storefront API proxy
// Runs as a Vercel serverless function so the Shopify Storefront API access
// token stays server-side (never shipped in the client bundle), mirroring
// the api/subscribe.js pattern used for the Omnisend key.
//
// The Storefront API is Shopify's public-facing API (product reads + cart
// mutations only — no order/customer data), so proxying it here is purely
// about keeping the token out of the client bundle, not about restricting
// what queries can run.
//
// Env vars required (Vercel → Project → Settings → Environment Variables):
//   SHOPIFY_STOREFRONT_TOKEN = Storefront API access token from
//     Shopify Admin → Settings → Apps → Develop apps → [your app] → API credentials
//     Requires scopes: unauthenticated_read_product_listings,
//                      unauthenticated_read_product_inventory,
//                      unauthenticated_write_checkouts
//   SHOPIFY_STORE_DOMAIN (optional) = the store's .myshopify.com domain.
//     Defaults to the production store below.

const API_VERSION = '2025-04';
const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'hydrowild.myshopify.com';

export default async function handler(req, res) {
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

  // Lightweight config check — lets the client know whether live checkout
  // is available without exposing the token itself.
  if (req.method === 'GET') {
    return res.status(200).json({ configured: Boolean(token) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!token) {
    console.error('[shopify] SHOPIFY_STOREFRONT_TOKEN is not set');
    return res.status(503).json({ error: 'Storefront API not configured' });
  }

  // Vercel may hand us a parsed object or a raw string depending on content-type
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { query, variables } = body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing GraphQL query' });
  }

  try {
    const shopifyRes = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = await shopifyRes.json();
    return res.status(shopifyRes.status).json(json);
  } catch (err) {
    console.error('[shopify] request failed', err);
    return res.status(502).json({ error: 'Upstream error' });
  }
}
