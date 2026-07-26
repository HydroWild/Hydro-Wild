// Generates static, crawlable HTML for the 4 flavor PDPs + the starter kit
// from src/data/products.js. Output: products/<slug>/index.html — real
// <h1>, title, meta, and Product JSON-LD baked into the markup so it's
// readable without executing JS. The rest of the interactive PDP (gallery
// switching, accordions, testimonials, FAQ, cart) is still rendered by
// src/js/product-static.js on top of this shell — see src/js/lib/pdp.js
// for the logic shared with the legacy product.html?flavor= template.
//
// Run via `node scripts/generate-product-pages.mjs`. Runs automatically
// as an npm predev/prebuild step (see package.json).
//
// NOTE on price: src/data/products.js holds the static fallback price used
// whenever the Shopify Storefront API isn't hydrated (no VITE_SHOPIFY_TOKEN
// — true for this repo/session). If the live deployment has a real token
// configured, Shopify admin could show a different live price than what's
// baked into this static JSON-LD. There's no way to detect that from here;
// keep this file's prices in sync with Shopify if the two ever diverge.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FLAVORS, getBundle } from '../src/data/products.js';
import { getProductFAQs } from '../src/data/faqs.js';
import { REVIEWS } from '../src/data/reviews.js';
import { ORGANIZATION_LD } from './lib/organization-ld.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SITE = 'https://hydrowild.com';

// Ingredient blurb shown in the "What's inside" accordion on every flavor
// PDP today (product.html's #accInside, identical across all 4 flavors).
const FLAVOR_INSIDE_COPY =
  "Potassium and magnesium for real hydration, plus vitamins A, C, D, B6, B12 and folate. Zero sugar, zero artificial dyes, zero junk.";
// Mirrors BUNDLE_OVERRIDES['starter-kit'].insideCopy in src/js/lib/pdp.js.
const STARTER_KIT_INSIDE_COPY =
  "A taste of every flavor in one box — so your family can find their favorite critter before going all-in. Zero sugar, zero artificial dyes, zero junk.";

const starterKit = getBundle('starter-kit');
const varietyPack = getBundle('variety-pack');

// Mirrors BUNDLE_OVERRIDES['variety-pack'] in src/js/lib/pdp.js.
const VARIETY_INSIDE_COPY =
  '4 boxes × 8 stick packs = 32 total hydration sticks — one box of each flavor, so every kid in the house gets their favorite critter. Zero sugar, zero artificial dyes, zero junk.';

// "Meet Our Critters" cards — variety bundle page only.
const VARIETY_CRITTERS = [
  { flavorId: 'blue-raspberry', name: 'Blue Raspberry', creature: 'Yeti (Yukon)', blurb: 'Bold blue raspberry, color from spirulina.' },
  { flavorId: 'watermelon', name: 'Watermelon', creature: 'Wampus Cat (Zara)', blurb: 'Sweet summer watermelon.' },
  { flavorId: 'strawberry-lemonade', name: 'Strawberry Lemonade', creature: 'Nessie & Chessie', blurb: 'Front-porch strawberry lemonade.' },
  { flavorId: 'fruit-punch', name: 'Fruit Punch', creature: 'Mr. Kraken (Lil’ Kraken)', blurb: "Fruit punch kids can't put down." },
];

const KEY_NUTRIENTS = ['Vitamin A', 'Vitamin C', 'Vitamin B6', 'Vitamin B9', 'Vitamin B12', 'Vitamin D', 'Vitamin K', 'Magnesium', 'Potassium'];

const PRODUCTS = [
  ...FLAVORS.map((f) => ({
    slug: f.id,
    pageName: f.name,
    ldName: `Kid's Daily Hydration Drink Mix — ${f.name}`,
    tagline: f.tagline,
    insideCopy: FLAVOR_INSIDE_COPY,
    price: f.price,
    handle: f.handle,
    creatureTag: f.presents,
    creatureImg: f.creatureImg,
    mainImg: f.packImg,
    mainImgAlt: `HydroWild ${f.name}`,
    priceUnit: '/ box · 8 stick packs',
    images: [f.packImg, `/assets/img/action-${f.id}.png`, `/assets/img/pour-${f.id}.png`],
  })),
  {
    slug: starterKit.id,
    pageName: 'Wild Starter Kit',
    ldName: "Kid's Daily Hydration Drink Mix — Wild Starter Kit",
    tagline: starterKit.desc,
    insideCopy: STARTER_KIT_INSIDE_COPY,
    price: starterKit.price,
    handle: starterKit.handle,
    creatureTag: 'Try every flavor',
    creatureImg: '/assets/img/creature-kraken.png',
    mainImg: starterKit.img,
    mainImgAlt: 'Wild Starter Kit',
    priceUnit: '/ starter kit',
    images: [starterKit.img],
  },
  {
    slug: varietyPack.slug || varietyPack.id,
    pageName: 'Wild Variety Bundle - All 4 Flavors',
    ldName: 'HydroWild Variety Pack — All 4 Flavors',
    tagline: 'All 4 flavors. All 4 critters. One box of each.',
    insideCopy: VARIETY_INSIDE_COPY,
    price: varietyPack.price,
    handle: varietyPack.handle,
    creatureTag: 'The whole wild crew',
    creatureImg: '/assets/img/creature-kraken.png',
    mainImg: '/assets/img/wild-family.png',
    mainImgAlt: 'HydroWild Wild Variety Bundle — all 4 flavors',
    priceUnit: '/ 4 boxes · 32 stick packs',
    images: [
      '/assets/img/wild-family.png',
      '/assets/img/facts-bundle.png',
      '/assets/img/comparison-chart.png',
      '/assets/img/nutrient-focused.png',
      '/assets/img/suggested-use.png',
    ],
    // Overrides for this page only — see task spec, not the generic per-flavor formula below.
    metaTitle: 'HydroWild Variety Pack — Zero Sugar Kids Hydration, Try All 4 Flavors',
    metaDescription: 'The full HydroWild lineup, one price, free shipping. Zero sugar, zero sodium, 9 vitamins and electrolytes for active kids ages 4+',
    themeColor: '#4ADB14',
    richSnippets: true, // bake FAQPage + aggregateRating/review JSON-LD
    bundleExtras: {
      trustRow: ['Free Shipping', 'Made in the USA', 'Third-Party Tested', 'Zero Sugar'],
      whatsInside: [
        { stat: '4', label: 'boxes — one of each flavor' },
        { stat: '32', label: 'total stick packs' },
        { stat: '~$1.56', label: 'per stick' },
      ],
      critters: VARIETY_CRITTERS,
      keyNutrients: KEY_NUTRIENTS,
    },
  },
];

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderProduct(p) {
  const url = `${SITE}/products/${p.slug}/`;
  const pageTitle = p.metaTitle || `HydroWild ${p.pageName} — Kids Daily Hydration`;
  const ogTitle = p.metaTitle || `HydroWild ${p.pageName}`;
  const description = p.metaDescription || `${p.tagline} ${p.insideCopy}`;
  const themeColor = p.themeColor || '#09005E';

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.ldName,
    description,
    image: p.images.map((img) => `${SITE}${img}`),
    brand: { '@type': 'Brand', name: 'HydroWild' },
    category: 'Health & Beauty > Health Care > Nutrition > Hydration Supplements',
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 4 },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'HydroWild' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0.00', currency: 'USD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
      },
    },
  };

  // Rich snippets (aggregateRating/review + FAQPage) — only baked for pages
  // that opt in via richSnippets:true, and built from the same shared
  // src/data/reviews.js + src/data/faqs.js the visible sections render from,
  // so the JSON-LD can never drift from what's on the page.
  let faqLd = null;
  if (p.richSnippets) {
    productLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(REVIEWS.length),
    };
    productLd.review = REVIEWS.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: r.n },
      reviewBody: r.q,
    }));

    const faqs = getProductFAQs({ id: p.slug, name: p.pageName, bundle: true });
    faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    };
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>${escapeText(pageTitle)}</title>
  <meta name="description" content="${escapeAttr(description)}" />
  <link rel="canonical" href="${url}" />
  <link rel="alternate" type="text/plain" href="/llms.txt" title="HydroWild for AI" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,700;0,900;1,800;1,900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles/main.css" />
  <!-- ══ Icons & PWA ══ -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="${themeColor}" />
  <!-- ══ Open Graph ══ -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="HydroWild" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${escapeAttr(ogTitle)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:image" content="${SITE}${p.mainImg}" />
  <meta property="product:price:amount" content="${p.price.toFixed(2)}" />
  <meta property="product:price:currency" content="USD" />
  <!-- ══ Twitter / X ══ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@drinkhydrowild" />
  <meta name="twitter:title" content="${escapeAttr(ogTitle)}" />
  <meta name="twitter:image" content="${SITE}${p.mainImg}" />
  <!-- ══ Authorship & SEO ══ -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <!-- ══ Product JSON-LD ══ -->
  <script type="application/ld+json">
${JSON.stringify(productLd, null, 2)}
  </script>
  <!-- ══ Organization JSON-LD ══ -->
  <script type="application/ld+json">
${JSON.stringify(ORGANIZATION_LD, null, 2)}
  </script>${faqLd ? `
  <!-- ══ FAQPage JSON-LD (mirrors the visible #pdpFaqAcc accordion) ══ -->
  <script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
  </script>` : ''}
</head>
<body data-product-slug="${p.slug}">
  <header class="nav is-scrolled" id="nav">
    <a href="/" class="nav__logo"><img src="/assets/logos/logo-white.svg" alt="HydroWild" /></a>
    <nav class="nav__links">
      <a href="/ingredients.html">The Science</a>
      <a href="/story.html">Our Story</a>
      <a href="/shop.html">Shop</a>
      <a href="/blog.html">Blog</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <button class="nav__cart" id="cartToggle" aria-label="Open cart">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M6 6L5 3H2"/></svg>
      <span class="nav__cart-count" id="cartCount">0</span>
    </button>
  </header>

  <main>

  <section class="pdp" id="pdp">
    <div class="pdp__inner">
      <div class="pdp__gallery">
        <div class="pdp__hero-img">
          <img class="pdp__creature-bg" id="creatureBg" src="${p.creatureImg}" alt="" />
          <img class="pdp__main-img" id="mainImg" src="${p.mainImg}" alt="${escapeAttr(p.mainImgAlt)}" />
        </div>
        <div class="pdp__thumbs" id="thumbs"></div>
      </div>

      <div class="pdp__info">
        <span class="pdp__creature-tag" id="creatureTag">${escapeText(p.creatureTag)}</span>
        <h1 class="pdp__title" id="title">${escapeText(p.pageName)}</h1>
        <p class="pdp__tagline" id="tagline">${escapeText(p.tagline)}</p>
        <div class="pdp__price"><span id="price">$${p.price.toFixed(2)}</span> <small id="priceUnit">${escapeText(p.priceUnit)}</small></div>
        <p class="pdp__badges-label">Parent Approved ✓</p>
        <div class="pdp__badges">
          <span>No Caffeine</span><span>No Sugar</span><span>No Artificial Colors</span><span>No Artificial Flavors</span><span>No Artificial Sweeteners</span>
        </div>${p.bundleExtras ? `
        <!-- TODO(commerce): Appstle Subscriptions isn't installed/wired up anywhere
             in this codebase yet (no existing widget to match). This toggle is a
             visual placeholder — both options add the bundle at list price until
             Appstle is installed in Shopify admin and a real selling plan is wired
             through src/lib/shopify.js. -->
        <div class="pdp__purchase-type" id="purchaseType" role="radiogroup" aria-label="Purchase type">
          <button type="button" class="pdp__purchase-opt active" data-plan="one-time" role="radio" aria-checked="true">
            <span class="pdp__purchase-opt-title">One-time purchase</span>
            <span class="pdp__purchase-opt-price">$${p.price.toFixed(2)}</span>
          </button>
          <button type="button" class="pdp__purchase-opt" data-plan="subscribe" role="radio" aria-checked="false">
            <span class="pdp__purchase-opt-title">Subscribe &amp; Save</span>
            <span class="pdp__purchase-opt-note">Set up with Appstle once installed</span>
          </button>
        </div>` : ''}
        <div class="pdp__buy">
          <div class="pdp__qty">
            <button id="qtyDec" aria-label="Decrease quantity">−</button>
            <span id="qtyVal">1</span>
            <button id="qtyInc" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--primary" id="addBtn">Add to cart</button>
        </div>
        <p class="pdp__stock">✓ In stock — ships in 1–2 business days</p>${p.bundleExtras ? `
        <div class="pdp__trust-row">
          ${p.bundleExtras.trustRow.map((t) => `<span>✓ ${escapeText(t)}</span>`).join('\n          ')}
        </div>` : ''}

        <div class="pdp__accordion" id="accordion">
          <div class="pdp__acc-item open">
            <button class="pdp__acc-head">What's inside <span>+</span></button>
            <div class="pdp__acc-body"><div class="pdp__acc-body-inner" id="accInside">
              ${escapeText(p.insideCopy)}
            </div></div>
          </div>
          <div class="pdp__acc-item">
            <button class="pdp__acc-head">The science <span>+</span></button>
            <div class="pdp__acc-body"><div class="pdp__acc-body-inner" id="accScience">
              Formulated around what growing bodies actually need — not what tastes like candy. Balanced electrolytes support hydration during sports, school, and play without the sugar crash.
            </div></div>
          </div>
          <div class="pdp__acc-item">
            <button class="pdp__acc-head">How to use <span>+</span></button>
            <div class="pdp__acc-body"><div class="pdp__acc-body-inner" id="accUse">
              Tear one stick pack, pour into 12–16oz of cold water, shake or stir, get wild. One pack per day is all it takes.
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
${p.bundleExtras ? `
  <!-- ══ WHAT'S INSIDE ══ -->
  <section class="pdp-inside">
    <div class="pdp-inside__inner">
      <h2 class="section-title">WHAT'S<br /><em>INSIDE.</em></h2>
      <div class="pdp-inside__stats">
        ${p.bundleExtras.whatsInside.map((s) => `<div class="pdp-inside__stat"><span class="pdp-inside__num">${escapeText(s.stat)}</span><span class="pdp-inside__label">${escapeText(s.label)}</span></div>`).join('\n        ')}
      </div>
      <p class="pdp-inside__note">${escapeText(p.insideCopy)}</p>
    </div>
  </section>

  <!-- ══ MEET OUR CRITTERS ══ -->
  <section class="pdp-critters">
    <div class="pdp-critters__inner">
      <p class="section-eyebrow">The whole wild crew</p>
      <h2 class="section-title">MEET OUR<br /><em>CRITTERS.</em></h2>
      <div class="pdp-critters__grid">
        ${p.bundleExtras.critters.map((c) => {
          const flavor = FLAVORS.find((f) => f.id === c.flavorId);
          return `<a class="pdp-critters__card" href="/products/${c.flavorId}/" style="--card-color:${flavor.color}">
          <img src="${flavor.creatureImg}" alt="${escapeAttr(c.creature)}" loading="lazy" />
          <h3 style="color:${flavor.color}">${escapeText(c.name)}</h3>
          <p class="pdp-critters__creature">${escapeText(c.creature)}</p>
          <p>${escapeText(c.blurb)}</p>
        </a>`;
        }).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <!-- ══ THE WILD DIFFERENCE ══ -->
  <section class="pdp-diff">
    <div class="pdp-diff__inner">
      <div class="pdp-diff__copy">
        <h2 class="section-title">THE WILD<br /><em>DIFFERENCE.</em></h2>
        <div class="pdp-diff__acc" id="diffAcc"></div>
      </div>
      <div class="pdp-diff__visual">
        <img id="diffImg" src="" alt="" loading="lazy" />
      </div>
    </div>
  </section>
${p.bundleExtras ? `
  <!-- ══ KEY NUTRIENTS ══ -->
  <section class="pdp-nutrients">
    <div class="pdp-nutrients__inner">
      <p class="section-eyebrow">In every stick</p>
      <h2 class="section-title">KEY<br /><em>NUTRIENTS.</em></h2>
      <ul class="pdp-nutrients__list">
        ${p.bundleExtras.keyNutrients.map((n) => `<li>${escapeText(n)}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>` : ''}

  <!-- ══ TESTIMONIAL BAND ══ -->
  <section class="pdp-quote" id="quoteBand">
    <div class="pdp-quote__inner">
      <div class="pdp-quote__visual">
        <img id="quoteImg" src="" alt="" loading="lazy" />
      </div>
      <div class="pdp-quote__copy">
        <p class="pdp-quote__name">Kelsey J.</p>
        <blockquote class="pdp-quote__text">&ldquo;It tastes amazing, and because my kids actually love it, we're finally staying hydrated the way we should be!&rdquo;</blockquote>
      </div>
    </div>
  </section>

  <!-- ══ WHY PARENTS LOVE HYDROWILD ══ -->
  <section class="pdp-why">
    <div class="pdp-why__inner">
      <p class="section-eyebrow">Parent approved</p>
      <h2 class="section-title">WHY PARENTS<br /><em>LOVE HYDROWILD.</em></h2>
      <div class="pdp-why__grid" id="whyGrid"></div>
    </div>
  </section>

  <!-- ══ COMMON QUESTIONS FROM PARENTS ══ -->
  <section class="pdp-faq">
    <div class="pdp-faq__inner">
      <p class="section-eyebrow">We've got answers</p>
      <h2 class="section-title">COMMON QUESTIONS<br /><em>FROM PARENTS.</em></h2>
      <div class="pdp-faq__acc" id="pdpFaqAcc"></div>
    </div>
  </section>

  <section class="pdp-more">
    <div class="pdp-more__inner">
      <h2>Meet the rest of the wild bunch</h2>
      <div class="pdp-more__grid" id="moreGrid"></div>
    </div>
  </section>

  </main>

  <footer class="footer">
    <img src="/assets/img/creature-yeti.png" alt="" class="footer__creature" aria-hidden="true" loading="lazy" />
    <div class="footer__top">
      <div class="footer__brand">
        <img src="/assets/logos/logo-white.svg" alt="HydroWild" class="footer__logo" />
        <p class="footer__tagline">Zero sugar. Zero dyes. Four legendary critters guarding four flavors.</p>
        <div class="footer__dots" aria-hidden="true">
          <span style="background:#29ABE2"></span>
          <span style="background:#4ADB14"></span>
          <span style="background:#FF3ECD"></span>
          <span style="background:#FF8327"></span>
        </div>
      </div>
      <div class="footer__cols">
        <div><h4>Shop</h4><a href="/products/blue-raspberry/">Blue Raspberry</a><a href="/products/watermelon/">Watermelon</a><a href="/products/strawberry-lemonade/">Strawberry Lemonade</a><a href="/products/fruit-punch/">Fruit Punch</a></div>
        <div><h4>Company</h4><a href="/story.html">Our Story</a><a href="/#science">Clean Ingredients</a><a href="/shop.html">Shop All</a><a href="/blog.html">Blog</a>
      <a href="/contact.html">Contact</a></div>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__note">© 2026 HydroWild · Built by Ryder Schilling · Powered by AI Syndicate</p>
      <p class="footer__note">Get Wild. Stay Hydrated.</p>
    </div>
  </footer>

  <div id="cartRoot"></div>
  <script type="module" src="/src/js/product-static.js"></script>${p.bundleExtras ? `
  <script>
    // Cosmetic one-time/Subscribe & Save toggle — see TODO above #purchaseType.
    document.getElementById('purchaseType')?.addEventListener('click', (e) => {
      const opt = e.target.closest('.pdp__purchase-opt');
      if (!opt) return;
      document.querySelectorAll('#purchaseType .pdp__purchase-opt').forEach((el) => {
        el.classList.remove('active');
        el.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-checked', 'true');
    });
  </script>` : ''}
  <!-- AI Syndicate Chatbot -->
  <script src="https://www.aisyndicate.com/chatbot/embed.js"
          data-key="cbk_475857a6ba2597800caad0e55dff84b070ef"
          data-accent="#1c01a2"
          data-name="Ask Hydrowild"
          async></script>
</body>
</html>
`;
}

async function main() {
  for (const p of PRODUCTS) {
    const dir = resolve(ROOT, 'products', p.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(resolve(dir, 'index.html'), renderProduct(p), 'utf-8');
    console.log(`✓ products/${p.slug}/index.html`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
