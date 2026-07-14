// Local cart store — persists in localStorage, emits change events.
// When Storefront API goes live this syncs to a real Shopify cart.

const KEY = 'hydrowild_cart';
const listeners = new Set();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

let items = load();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((fn) => fn(items));
}

export const cart = {
  get items() {
    return items;
  },
  get count() {
    return items.reduce((n, i) => n + i.qty, 0);
  },
  get total() {
    return items.reduce((n, i) => n + i.qty * i.price, 0);
  },
  add(product, qty = 1) {
    const existing = items.find((i) => i.id === product.id);
    if (existing) existing.qty += qty;
    else
      items.push({
        id: product.id,
        handle: product.handle,
        name: product.name,
        img: product.packImg || product.img,
        price: product.price,
        qty,
      });
    persist();
  },
  setQty(id, qty) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, qty);
    if (item.qty === 0) items = items.filter((i) => i.id !== id);
    persist();
  },
  remove(id) {
    items = items.filter((i) => i.id !== id);
    persist();
  },
  clear() {
    items = [];
    persist();
  },
  subscribe(fn) {
    listeners.add(fn);
    fn(items);
    return () => listeners.delete(fn);
  },
};
