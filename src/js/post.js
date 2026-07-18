// HydroWild — Individual blog post page
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initNav, initCartUI } from './ui.js';
import { POSTS } from '../data/posts.js';

gsap.registerPlugin(ScrollTrigger);

initNav();
initCartUI();

// ── Find the post from URL ?slug= ──────────────────────
const params = new URLSearchParams(window.location.search);
const slug   = params.get('slug');
const post   = POSTS.find((p) => p.slug === slug);
const root   = document.getElementById('postRoot');

if (!post || !root) {
  // 404 state
  root.innerHTML = `
    <div class="post-404">
      <h1>POST NOT FOUND</h1>
      <p>That post doesn't exist or may have been moved.</p>
      <a href="/blog.html" class="btn btn--primary">← Back to the Blog</a>
    </div>`;
} else {
  // ── Update page meta for SEO ────────────────────────
  document.title = `${post.title} — The Wild Blog | HydroWild`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', post.excerpt);

  // ── Render the post ─────────────────────────────────
  root.innerHTML = `
    <!-- Full-bleed hero with featured image -->
    <section class="post-hero">
      <div class="post-hero__bg">
        <img src="${post.image}" alt="${post.imageAlt}" />
      </div>
      <div class="post-hero__overlay" aria-hidden="true"></div>
      <div class="post-hero__content">
        <div class="post-hero__meta">
          <span class="post-hero__category">${post.category}</span>
          <span class="post-hero__date">${post.date}</span>
        </div>
        <h1 class="post-hero__title">${post.title}</h1>
        <p class="post-hero__author">By <strong>${post.author}</strong></p>
      </div>
    </section>

    <!-- Post body -->
    <article class="post-body">
      <a href="/blog.html" class="post-back">← Back to the Blog</a>
      <div class="post-content">
        ${post.body}
      </div>

      <!-- In-article CTA -->
      <div class="post-cta">
        <p class="post-cta__title">READY TO<br /><em>GET WILD?</em></p>
        <p class="post-cta__sub">Zero sugar. Zero dyes. Nine vitamins. One legendary drink.</p>
        <a href="/shop.html" class="btn btn--primary">Shop All Flavors</a>
      </div>
    </article>
  `;

  // ── Entrance animations ──────────────────────────────
  gsap.from('.post-hero__meta', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out', delay: 0.1 });
  gsap.from('.post-hero__title', { opacity: 0, y: 24, duration: 0.75, ease: 'power3.out', delay: 0.2 });
  gsap.from('.post-hero__author', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out', delay: 0.35 });

  gsap.from('.post-back', {
    opacity: 0, x: -16, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.post-body', start: 'top 85%', once: true },
  });

  // Stagger paragraphs and headings into view
  document.querySelectorAll('.post-content p, .post-content h2, .post-content h3, .post-content ul').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  gsap.from('.post-cta', {
    opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.post-cta', start: 'top 85%', once: true },
  });
}

// ── Footer ────────────────────────────────────────────
gsap.from('.footer__brand, .footer__cols > div', {
  opacity: 0, y: 28, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
});
