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
   faqs       → Optional. Array of { q, a } pairs. When present, the
                  generator (scripts/generate-blog-posts.mjs) renders a
                  matching FAQPage JSON-LD block plus a visible accordion
                  section at the end of the post — q/a text is the single
                  source of truth for both, so they can never drift.
   ═══════════════════════════════════════════════════════ */

export const POSTS = [
  {
    slug: 'how-much-water-should-kids-drink',
    title: 'How Much Water Should Kids Drink a Day? (By Age + Activity Chart)',
    date: 'July 29, 2026',
    author: 'HydroWild',
    category: 'Nutrition & Science',
    image: '/assets/img/blog-kids-water-intake-chart.jpg',
    imageAlt: 'Chart showing how much water kids should drink per day by age group',
    excerpt: 'How much water should kids drink each day? A simple age-by-age chart, how much more they need for sports, and the signs of dehydration every parent should know.',
    body: `
      <p><strong>Quick answer:</strong> Most kids need between 4 and 8 cups of water a day, depending on their age. Toddlers (ages 1–3) need about 4 cups. Kids 4–8 need about 5 cups. Kids 9 and older need 7–8 cups. On active days — sports, heat, long afternoons outside — they need more, and sometimes water alone isn't enough to replace what they lose through sweat.</p>
      <p>That's the short version. Below is the full age-by-age chart, how to adjust for sports and hot weather, the dehydration signs worth knowing, and the one situation where plain water stops doing the job.</p>
      <h2>Daily Water Intake for Kids, by Age</h2>
      <p>Here's the baseline most pediatric guidelines agree on. These numbers are for a normal day — not a game day, not a 95-degree August afternoon.</p>
      <div class="post-table-wrap">
        <table>
          <thead>
            <tr><th>Age Group</th><th>Daily Water (cups)</th><th>Daily Water (approx. oz)</th></tr>
          </thead>
          <tbody>
            <tr><td>1–3 years</td><td>4 cups</td><td>~32 oz</td></tr>
            <tr><td>4–8 years</td><td>5 cups</td><td>~40 oz</td></tr>
            <tr><td>9–13 years</td><td>7–8 cups</td><td>~56–64 oz</td></tr>
            <tr><td>14+ years</td><td>8–11 cups</td><td>~64–88 oz</td></tr>
          </tbody>
        </table>
      </div>
      <p>A cup means 8 ounces. And "fluids" can include milk and water-rich foods — but plain water should be the anchor. Sugary drinks and juice don't count toward healthy hydration; they mostly add sugar your kid doesn't need.</p>
      <p>One rule of thumb for older kids and teens: aim for about half an ounce of water per pound of body weight per day. A 100-pound kid lands around 50 ounces as a floor — before activity.</p>
      <h2>How Much More Water Do Kids Need for Sports?</h2>
      <p>This is where the baseline breaks down. Active kids lose fluid fast, and thirst is a lagging indicator — by the time a kid feels thirsty, they're already behind. The fix is to build drinking into the activity instead of waiting for thirst.</p>
      <p>A simple, coach-tested framework:</p>
      <ul>
        <li><strong>Before activity:</strong> 12–16 oz about 30 minutes before they start.</li>
        <li><strong>During activity:</strong> 4–8 oz every 15–20 minutes. Younger kids: "about 10 gulps." Teens: closer to 20.</li>
        <li><strong>After activity:</strong> Keep sipping. Roughly 16–24 oz for every pound of body weight lost through sweat.</li>
      </ul>
      <p>The heat multiplies all of this. On hot, humid days, kids can lose fluid faster than they can comfortably drink it — which is exactly when a hydration plan matters most.</p>
      <h2>When Is Water Not Enough?</h2>
      <p>For most everyday activity, water is the right choice, full stop. But there's a clear line where it stops being sufficient on its own.</p>
      <p>When a child sweats for more than about <strong>60 minutes</strong> of continuous activity — or plays hard in the heat — they're not just losing water. They're losing electrolytes: sodium, potassium, and chloride, the minerals that control fluid balance, muscle function, and how well the body actually absorbs and holds onto water. Replace the water but not the electrolytes, and kids can still cramp, fade, and feel drained.</p>
      <p>That's the point where an electrolyte drink earns its place. The catch: most sports drinks marketed to kids are loaded with 14–20 grams of sugar and artificial dyes — the exact stuff you're trying to avoid. So the goal isn't "no electrolytes," it's electrolytes without the sugar-and-dye tax.</p>
      <p>That's the entire reason <strong>HydroWild</strong> exists: zero sugar, zero dyes, and the electrolytes plus vitamins kids actually need when water isn't enough — built for game days, heat, and long afternoons outside. It's the "when water isn't enough" answer that doesn't undo the healthy habit you're building.</p>
      <h2>Signs Your Child Is Dehydrated</h2>
      <p>Catch it early and it's a non-event. Watch for:</p>
      <ul>
        <li>Dark yellow urine (pale straw is the goal)</li>
        <li>Fewer bathroom trips than usual</li>
        <li>Dry mouth or lips</li>
        <li>Fatigue, crankiness, or trouble focusing</li>
        <li>Headache</li>
        <li>Dizziness (a more serious sign)</li>
      </ul>
      <p>If your child shows severe symptoms — confusion, no urination, extreme lethargy — that's a call-your-pediatrician situation, not a water-bottle situation.</p>
    `,
    faqs: [
      {
        q: 'How much water should a 5-year-old drink a day?',
        a: 'A 5-year-old needs about 5 cups (roughly 40 ounces) of water per day on a normal day, and more when active or in hot weather.',
      },
      {
        q: 'How much water should a 10-year-old drink a day?',
        a: 'A 10-year-old needs about 7–8 cups (roughly 56–64 ounces) of water per day, increasing with sports, heat, and activity level.',
      },
      {
        q: 'Should kids drink electrolytes or just water?',
        a: "For everyday activity, water is enough for most kids. Electrolytes become helpful after about 60 minutes of sweating or during activity in the heat, when kids lose sodium and potassium that water alone can't replace. Choose a low- or no-sugar option without artificial dyes.",
      },
      {
        q: 'Can kids drink too much water?',
        a: "Yes, though it's rare. Drinking extreme amounts in a short time can dilute blood sodium (a condition called hyponatremia). The goal is steady, consistent intake through the day — not chugging large volumes at once.",
      },
      {
        q: 'Does milk or juice count toward daily water intake?',
        a: "Milk contributes to hydration and adds useful nutrients. Juice and sugary drinks technically add fluid but mostly add sugar, so they shouldn't be the main source. Plain water should be the anchor.",
      },
      {
        q: 'What are the first signs of dehydration in kids?',
        a: 'The earliest signs are dark yellow urine, fewer bathroom trips, dry mouth, and unusual crankiness or fatigue. Pale straw-colored urine is the sign of good hydration.',
      },
    ]
  },
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
