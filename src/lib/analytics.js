// GA4 init. The async gtag.js loader tag stays in each page's <head> for
// early loading; importing this module wires up dataLayer + config once
// gtag.js has (or will have) loaded.
const GA_MEASUREMENT_ID = 'G-R08X2S1DS8';

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);
