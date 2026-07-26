// Shared FAQ content for product pages — a plain data module (no DOM/GSAP
// deps) so it can be imported both client-side (src/js/lib/pdp.js, for the
// visible accordion) and from the Node build script
// (scripts/generate-product-pages.mjs, for FAQPage JSON-LD) without the two
// ever drifting out of sync.

/**
 * @param {{ id: string, name: string, bundle?: boolean }} product
 * @returns {[question: string, answer: string][]}
 */
export function getProductFAQs(product) {
  const colorSource = product.id === 'blue-raspberry'
    ? 'spirulina extract (color)'
    : 'fruit & vegetable juice powder (color)';
  const flavorLine = product.bundle
    ? "each flavor's natural fruit flavor"
    : `natural ${product.name.toLowerCase()} flavor`;

  return [
    ['Does it contain any common allergens?', "HydroWild is free from the most common allergens — no gluten, no dairy, no nuts, no soy. It's also vegan-friendly. As always, if your child has specific sensitivities, we recommend reviewing the full ingredient list."],
    ['What ages can drink HydroWild?', "HydroWild is formulated for children ages 4 and up, through teens. It's designed to meet the nutritional needs of active, growing kids — not toddlers, not adults. If your child is under 4 or has specific health conditions, check with your pediatrician first."],
    ["If there's no sugar, then how does it taste so sweet?", "Great question — and one we get a lot! HydroWild is sweetened with stevia (Reb A), a plant-based sweetener that gives it that naturally sweet taste without any sugar or artificial sweeteners. It's the same clean-label sweetener used in premium adult wellness products, just formulated to taste great for kids."],
    ['Is it better than sports drinks?', "Most sports drinks are loaded with sugar, artificial dyes, and ingredients designed for adult athletes. HydroWild was specifically formulated for kids' smaller bodies and developing systems — zero sugar, no artificial anything, and vitamins that actually support growth and immunity, not just electrolyte replacement."],
    ['How often should my child drink HydroWild?', "It's designed for daily use. The vitamins are dosed at levels appropriate for kids, not megadoses. Think of it like a daily hydration habit with built-in nutritional support."],
    ['Where are your products manufactured?', "HydroWild is proudly made in the USA. Our products are also third-party tested, so you can trust what's on the label is exactly what's inside."],
    ['Where does the color come from?', "No artificial dyes here. The colors in our flavors come from fruit and vegetable juice powder. It's the same ingredient used in many clean-label kids' products and completely safe for everyday use."],
    ["What's actually in it? (The real ingredient list)", `Each stick contains: citric acid, ${flavorLine}, ${colorSource}, and stevia extract (Reb A). Plus 7 vitamins (A, C, D, K, B6, B9/folate, B12) and 2 electrolytes — magnesium and potassium. That's it. Nothing you can't pronounce.`],
  ];
}
