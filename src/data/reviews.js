// Shared customer testimonials — used for the "Why parents love HydroWild"
// grid (rendered client-side by src/js/lib/pdp.js) and for aggregateRating/
// review JSON-LD baked server-side by scripts/generate-product-pages.mjs.
// Keep these two consumers reading from here so the visible quotes and the
// structured data never diverge.
export const REVIEWS = [
  {
    q: 'My little loves the taste and begs to have one every day. When friends come over they want them too.',
    n: 'Chase M.',
  },
  {
    q: 'My daughter LOVES these! Such an easy, delicious way to keep your kiddos hydrated — and perfect for our Disney bag!',
    n: 'Leslie G.',
  },
  {
    q: "A must-have for busy sports fams! My kids love this — it's their go-to for sports. Love having these packets on the go!",
    n: '@ThePerfectHouseWife',
  },
];
