/* ═══════════════════════════════════════════════════════
   HYDROWILD — Blog Posts
   ═══════════════════════════════════════════════════════
   TO ADD A NEW POST:
   1. Copy the object below and paste it at the TOP of the
      POSTS array (newest posts go first)
   2. Fill in every field
   3. Drop your image in /assets/img/ as blog-[name].jpg
   4. In your terminal:
        git add .
        git commit -m "new post: [title]"
        git push
      Vercel auto-deploys in ~30 seconds.

   FIELD GUIDE:
   slug       → URL-safe ID, hyphens only.  e.g. "my-new-post"
   title      → Full title shown on page
   date       → Display date  e.g. "July 10, 2026"
   author     → "Lindey Britton"  or  "CJ Britton"
   category   → Pick one:
                  "Nutrition & Science"
                  "Real Talk"
                  "Recipes"
                  "Behind the Brand"
   image      → Path starting with /assets/img/
                  e.g. "/assets/img/blog-hydration-tips.jpg"
   imageAlt   → Short image description (screen readers / SEO)
   excerpt    → 1–2 sentence teaser shown on the blog listing
   body       → Full HTML content.
                  Use <p> for paragraphs
                  Use <h2> for main section headings
                  Use <h3> for sub-headings
                  Use <ul><li> for bullet lists
                  Use <strong> for bold text
   ═══════════════════════════════════════════════════════ */

export const POSTS = [
  {
    slug: 'why-kids-need-electrolytes',
    title: 'Why Your Kids Need More Than Just Water',
    date: 'July 10, 2026',
    author: 'Lindey Britton',
    category: 'Nutrition & Science',
    image: '/assets/img/blog-strawberry-lemon-packet.jpg',
    imageAlt: 'HydroWild Strawberry Lemonade packet surrounded by fresh strawberries and lemons',
    excerpt: 'Water is essential — but when kids are active and sweating, plain water often isn\'t enough. Here\'s what the science says about electrolytes and why they matter for your kids.',
    body: `
      <p>Every parent knows hydration matters. You hand your kid a water bottle before practice, remind them to drink up, and feel like you're doing the right thing. And you are — mostly.</p>
      <p>But here's what most parents don't know: when kids are sweating heavily during sports or active play, plain water can actually <strong>dilute the electrolytes in their blood faster than their body can replenish them</strong>. Pediatricians call this exercise-induced hyponatremia, and it's more common than you'd think.</p>
      <h2>What Are Electrolytes, Exactly?</h2>
      <p>Electrolytes are minerals that carry an electric charge when dissolved in water. The key players are potassium and magnesium. They regulate fluid balance, nerve signaling, and muscle contractions — meaning your kid's muscles literally cannot fire properly without them.</p>
      <p>When your child sweats, they're not just losing water. They're losing electrolytes. And when those aren't replaced, you get cramping, fatigue, brain fog, and sluggish performance on the field.</p>
      <h2>The Problem With Most Kids Drinks</h2>
      <p>Walk down the sports drink aisle and you'll find plenty of options that claim to "replenish electrolytes." What the label doesn't scream is that most of those drinks also pack <strong>20–30 grams of sugar per serving</strong> — more than a candy bar — along with artificial dyes linked to behavioral changes in some children.</p>
      <p>That's the trade-off parents have been forced to make: hydration or health. We built HydroWild because that trade-off is nonsense.</p>
      <h2>What HydroWild Actually Delivers</h2>
      <p>Every HydroWild packet includes potassium and magnesium — the two key electrolytes most depleted during physical activity. We also stacked in 9 essential vitamins including Vitamin C, Vitamin D, and B-complex vitamins that support energy metabolism and immune function.</p>
      <ul>
        <li>✦ Zero sugar. Zero artificial dyes.</li>
        <li>✦ Potassium &amp; magnesium for real electrolyte replenishment</li>
        <li>✦ 9 essential vitamins kids need daily</li>
        <li>✦ Sweetened with stevia — zero glycemic impact</li>
      </ul>
      <p>Nothing your kid doesn't need. Everything they do.</p>
      <h2>The Bottom Line</h2>
      <p>If your child is active — sports, outdoor play, PE class — plain water after 30–45 minutes of exertion isn't enough. They need electrolytes, and they need them without a sugar bomb attached.</p>
      <p>That's not a sales pitch. That's pediatric sports nutrition 101. We just happen to have built the drink that checks every box.</p>
    `
  },
  {
    slug: 'healthy-lunchbox-hacks-easy-swaps-kids-will-love',
    title: 'Healthy Lunchbox Hacks: Easy Swaps Kids Will Love',
    date: 'October 27, 2025',
    author: 'Lindey Britton',
    category: 'Recipes',
    // TODO: placeholder — needs a real file in /assets/img/ and real alt text
    image: '/assets/img/blog-lunchbox-hacks.jpg',
    imageAlt: '',
    // TODO: drafted, not sourced from the original post — verify wording
    excerpt: 'Simple, kid-approved lunchbox swaps that cut sugar and processed snacks — plus how HydroWild replaces sugary drinks with real hydration and vitamins.',
    body: `
      <p>Packing a nutritious lunchbox your kids will actually eat can feel like a daily puzzle. Between picky eaters and busy schedules, it's easy to fall into the routine of pre-packaged snacks and sugary drinks. But with a few simple swaps, you can create a lunchbox that's both healthy and fun—without the extra stress.</p>
      <p>Here's how to make lunchtime nutritious, delicious, and hassle-free with easy swaps your kids will love!</p>
      <h2>1. Ditch Sugary Drinks for a Vitamin Boost</h2>
      <p>Many popular kids' drinks are loaded with hidden sugars, artificial flavors, and unnecessary additives. Instead of sugary juice boxes or sports drinks, swap them out for <strong>HydroWild Complete Hydration Drink Mix</strong>. Packed with 9 essential vitamins and minerals, including magnesium and potassium, it delivers hydration and nutrition without any sugar or artificial junk. Just mix a packet with water, and your child gets a flavorful boost that supports their energy and immune health.</p>
      <h2>2. Trade Processed Snacks for Whole-Food Alternatives</h2>
      <p>It's tempting to grab convenient snack packs filled with refined carbs and artificial ingredients, but healthier swaps are just as easy:</p>
      <ul>
        <li><strong>Swap Chips for Popcorn</strong> – Air-popped popcorn is a crunchy, fiber-rich alternative without the excess oils and sodium of traditional chips.</li>
        <li><strong>Trade Fruit Gummies for Fresh Fruit</strong> – Pre-packaged fruit snacks often contain more sugar than fruit! Try apple slices, grapes, or a mandarin orange for natural sweetness.</li>
        <li><strong>Opt for Nut Butter Instead of Processed Dips</strong> – Swap sugary, processed dips for almond or peanut butter with apple slices or celery.</li>
      </ul>
      <h2>3. Upgrade the Sandwich Game</h2>
      <p>Sandwiches are a lunchbox staple, but a few changes can make them more nutritious:</p>
      <ul>
        <li><strong>Switch White Bread for Whole Grain or Sprouted Bread</strong> – These options offer more fiber and sustained energy.</li>
        <li><strong>Choose Lean Proteins</strong> – Swap processed lunch meats (which often contain preservatives) for real turkey, grilled chicken, or hummus.</li>
        <li><strong>Add a Veggie Twist</strong> – Sneak in extra nutrients by layering spinach, cucumbers, or shredded carrots into sandwiches and wraps.</li>
      </ul>
      <h2>4. Replace Sugary Yogurts with Healthier Options</h2>
      <p>Flavored yogurts marketed to kids are often packed with added sugars. Instead:</p>
      <ul>
        <li><strong>Swap Sugary Yogurt for Greek Yogurt</strong> – Greek yogurt has more protein and less sugar, keeping kids fuller longer.</li>
        <li><strong>Add Natural Sweetness</strong> – Instead of pre-sweetened varieties, mix in fresh berries, a drizzle of honey, or a sprinkle of granola for texture and flavor.</li>
      </ul>
      <h2>5. Reinvent Lunchbox Treats</h2>
      <p>Kids love a fun treat in their lunchbox, and you can make it healthier without sacrificing the fun:</p>
      <ul>
        <li><strong>Swap Candy Bars for Energy Bites</strong> – Make homemade no-bake energy bites with oats, nut butter, and dark chocolate chips.</li>
        <li><strong>Trade Sugary Desserts for Dark Chocolate</strong> – A small piece of dark chocolate offers antioxidants and satisfies a sweet tooth without excess sugar.</li>
        <li><strong>Opt for Banana or Zucchini Muffins Instead of Packaged Cakes</strong> – Homemade muffins can be packed with nutrients while still feeling like a treat.</li>
      </ul>
      <h2>6. Make It Fun with a DIY Approach</h2>
      <p>Kids are more likely to eat their lunch when they have a hand in creating it. Try:</p>
      <ul>
        <li><strong>Build-Your-Own Lunchboxes</strong> – Bento-style lunches let kids mix and match foods, like crackers, cheese, turkey slices, and fruit.</li>
        <li><strong>Themed Lunches</strong> – Pack a "rainbow lunch" filled with colorful fruits and veggies, or a "breakfast for lunch" with mini pancakes and yogurt.</li>
        <li><strong>Surprise Notes</strong> – A simple "Have a great day!" or a funny joke can make lunchtime special and encourage kids to finish their meal.</li>
      </ul>
      <h2>Final Thoughts: Less Stress, More Health</h2>
      <p>Making small, simple swaps in your child's lunchbox can add up to big health benefits. With <strong>HydroWild</strong> for hydration, whole foods for nourishment, and a little creativity, you can pack a lunch that's nutritious, fun, and easy.</p>
      <p>Try these swaps and see how your child's lunchbox transforms into a powerhouse of energy and wellness—without any lunchtime battles!</p>
    `
  }
];
