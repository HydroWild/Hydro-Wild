/**
 * reading-progress.js — HydroWild
 *
 * Creates a thin bar at the top of the page that fills as the reader scrolls.
 * Works with plain scroll events; if Lenis is present it stays in sync because
 * Lenis drives native scroll position anyway.
 */

export function initReadingProgress() {
  // Don't add twice
  if (document.querySelector(".reading-progress")) return;

  const bar = document.createElement("div");
  bar.className = "reading-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update(); // set initial state
}
