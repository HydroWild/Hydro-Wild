// HydroWild homepage — immersive scroll experience.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { FLAVORS, BUNDLES } from '../data/products.js';
import { cart } from '../lib/cart.js';
import { initNav, initCartUI } from './ui.js';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll ──
const lenis = new Lenis({ lerp: 0.1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

initNav();
const cartUI = initCartUI();

// ── Hero entrance ──
gsap.from('[data-hero-word]', {
  yPercent: 110,
  duration: 1,
  stagger: 0.12,
  ease: 'power4.out',
  delay: 0.2,
});
gsap.from('[data-hero-fade]', { opacity: 0, y: 24, duration: 0.9, stagger: 0.15, delay: 0.7 });
gsap.from('.hero__pack', {
  opacity: 0,
  scale: 0.6,
  y: 80,
  duration: 1.1,
  stagger: 0.1,
  ease: 'back.out(1.6)',
  delay: 0.5,
});

// Floating packs — infinite drift + scroll parallax
document.querySelectorAll('.hero__pack').forEach((pack, i) => {
  gsap.to(pack, {
    y: `+=${18 + i * 6}`,
    rotation: `+=${i % 2 ? 5 : -5}`,
    duration: 2.6 + i * 0.4,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
  gsap.to(pack, {
    yPercent: -60 - i * 25,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
});

// ── Bubbles ──
const bubbleWrap = document.getElementById('bubbles');
if (bubbleWrap) {
  for (let i = 0; i < 26; i++) {
    const b = document.createElement('span');
    b.className = 'bubble';
    const size = 6 + Math.random() * 26;
    b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;--drift:${(Math.random() - 0.5) * 120}px;animation-duration:${7 + Math.random() * 10}s;animation-delay:${Math.random() * 10}s;`;
    bubbleWrap.appendChild(b);
  }
}

// ── Marquee ──
gsap.to('#marqueeTrack', { xPercent: -50, duration: 22, repeat: -1, ease: 'none' });

// ── Flavor worlds — build from data ──
const worlds = document.getElementById('flavors');
worlds.innerHTML = FLAVORS.map(
  (f, i) => `
  <section class="world" id="world-${f.id}" style="background:${f.bg}">
    <div class="world__ghost">${f.name}</div>
    <div class="world__inner" style="${i % 2 ? 'direction:rtl' : ''}">
      <div class="world__visual" style="direction:ltr">
        <img class="world__creature" src="${f.creatureImg}" alt="${f.creature}" loading="lazy" />
        <img class="world__pack" src="${f.packImg}" alt="HydroWild ${f.name}" loading="lazy" />
      </div>
      <div class="world__copy" style="direction:ltr">
        <span class="world__creature-tag" style="color:${f.color}">Guarded by ${f.creature}</span>
        <h2 class="world__name" style="color:${f.color}">${f.name}</h2>
        <p class="world__tagline">${f.tagline}</p>
        <p class="world__lore">${f.lore}</p>
        <div class="world__actions">
          <button class="btn btn--primary" data-add="${f.id}">Add to cart</button>
          <a class="btn btn--ghost" href="/product.html?flavor=${f.id}">Explore</a>
          <span class="world__price">$${f.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </section>`
).join('');

// World scroll choreography
FLAVORS.forEach((f) => {
  const el = document.getElementById(`world-${f.id}`);
  const creature = el.querySelector('.world__creature');
  const pack = el.querySelector('.world__pack');
  const ghost = el.querySelector('.world__ghost');
  const copyBits = el.querySelectorAll('.world__copy > *');

  gsap.fromTo(
    creature,
    { xPercent: -25, yPercent: -45, scale: 0.85, opacity: 0 },
    {
      xPercent: 0, yPercent: -50, scale: 1, opacity: 0.95,
      scrollTrigger: { trigger: el, start: 'top 75%', end: 'center center', scrub: 1 },
    }
  );
  gsap.fromTo(
    pack,
    { yPercent: 30, rotation: -18, opacity: 0 },
    {
      yPercent: -50, rotation: -6, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 70%', end: 'center center', scrub: 1 },
    }
  );
  gsap.to(ghost, {
    xPercent: -18,
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });
  gsap.from(copyBits, {
    opacity: 0, y: 36, stagger: 0.09, duration: 0.7,
    scrollTrigger: { trigger: el, start: 'top 55%' },
  });
});

// Add-to-cart buttons (event delegation)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  const flavor = FLAVORS.find((f) => f.id === btn.dataset.add);
  if (!flavor) return;
  cart.add(flavor);
  cartUI?.toast(`${flavor.name} added — ${flavor.creature} approves.`);
});

// Variety pack CTA
document.getElementById('ctaVariety')?.addEventListener('click', () => {
  cart.add({ ...BUNDLES[0], packImg: BUNDLES[0].img });
  cartUI?.toast('Wild Variety Pack added!');
  cartUI?.open();
});

// ── Generic reveals ──
document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 82%' },
  });
});

// ── Stat counters ──
document.querySelectorAll('[data-count]').forEach((el) => {
  const target = Number(el.dataset.count);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        el,
        { innerText: 0 },
        { innerText: target, duration: 1.4, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    },
  });
});

// ── Film section: play when visible, scale-in title ──
const film = document.querySelector('.film__video');
if (film) {
  ScrollTrigger.create({
    trigger: '.film',
    start: 'top 80%',
    end: 'bottom top',
    onEnter: () => film.play().catch(() => {}),
    onLeave: () => film.pause(),
    onEnterBack: () => film.play().catch(() => {}),
    onLeaveBack: () => film.pause(),
  });
  gsap.fromTo(
    '.film__title',
    { scale: 1.3, opacity: 0 },
    { scale: 1, opacity: 1, scrollTrigger: { trigger: '.film', start: 'top 70%', end: 'center center', scrub: 1 } }
  );
}

// ── CTA creatures parallax ──
document.querySelectorAll('[data-cta-creature]').forEach((img, i) => {
  gsap.to(img, {
    yPercent: i % 2 ? -30 : 30,
    rotation: i % 2 ? 8 : -8,
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
  });
});
