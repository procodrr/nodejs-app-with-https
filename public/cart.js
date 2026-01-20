const API_BASE = '/api';

const CART_STORAGE_KEY = 'techstore_cart_v1';

const cartCountEl = document.getElementById('cartCount');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartContentEl = document.getElementById('cartContent');
const cartItemsEl = document.getElementById('cartItems');
const cartStatusEl = document.getElementById('cartStatus');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const summaryItemsEl = document.getElementById('summaryItems');
const summarySubtotalEl = document.getElementById('summarySubtotal');
const summaryTotalEl = document.getElementById('summaryTotal');

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartItemCount(cart) {
  return cart.items.reduce((sum, item) => sum + (item.qty || 0), 0);
}

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function updateCartBadge() {
  if (!cartCountEl) return;
  const cart = loadCart();
  const count = getCartItemCount(cart);
  cartCountEl.textContent = String(count);
  cartCountEl.classList.toggle('hidden', count === 0);
}

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json();
  if (!data.success) throw new Error('Failed to load products');
  return data.data || [];
}

function setQty(productId, qty) {
  const cart = loadCart();
  const idx = cart.items.findIndex(i => i.id === productId);
  if (idx === -1) return;

  const nextQty = Math.max(0, qty);
  if (nextQty === 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].qty = nextQty;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart({ items: [] });
}

function renderCart({ cart, productsById }) {
  const count = getCartItemCount(cart);
  updateCartBadge();

  if (count === 0) {
    cartEmptyEl.classList.remove('hidden');
    cartContentEl.classList.add('hidden');
    return;
  }

  cartEmptyEl.classList.add('hidden');
  cartContentEl.classList.remove('hidden');

  cartStatusEl.textContent = `${count} item${count === 1 ? '' : 's'} in cart`;

  let subtotal = 0;
  cartItemsEl.innerHTML = cart.items.map(({ id, qty }) => {
    const p = productsById.get(id);
    if (!p) return '';
    const lineTotal = (p.price || 0) * qty;
    subtotal += lineTotal;

    return `
      <div class="px-6 py-4 flex gap-4 items-center">
        <div class="w-16 h-16 rounded-lg bg-dark-surface overflow-hidden flex-shrink-0">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200x200/1e293b/60a5fa?text=No+Image'">
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-white font-semibold truncate">${p.name}</div>
              <div class="text-xs text-gray-400 mt-0.5">${p.category}</div>
              <div class="text-sm text-blue-accent font-bold mt-2">${formatINR(p.price)}</div>
            </div>
            <button class="text-gray-400 hover:text-red-400 text-sm" data-action="remove" data-id="${id}">Remove</button>
          </div>

          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="inline-flex items-center rounded-lg border border-blue-primary/15 bg-dark-surface overflow-hidden">
              <button class="px-3 py-1.5 hover:bg-blue-primary/15" data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
              <div class="px-3 py-1.5 text-sm font-semibold">${qty}</div>
              <button class="px-3 py-1.5 hover:bg-blue-primary/15" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
            </div>
            <div class="text-sm text-gray-300 font-semibold">${formatINR(lineTotal)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  summaryItemsEl.textContent = String(count);
  summarySubtotalEl.textContent = formatINR(subtotal);
  summaryTotalEl.textContent = formatINR(subtotal);
}

async function init() {
  try {
    updateCartBadge();
    const products = await fetchProducts();
    const productsById = new Map(products.map(p => [p.id, p]));

    const cart = loadCart();
    renderCart({ cart, productsById });

    cartItemsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = Number(btn.getAttribute('data-id'));
      const current = loadCart();
      const item = current.items.find(i => i.id === id);
      const qty = item ? item.qty : 0;

      if (action === 'inc') setQty(id, qty + 1);
      if (action === 'dec') setQty(id, qty - 1);
      if (action === 'remove') setQty(id, 0);

      renderCart({ cart: loadCart(), productsById });
    });

    clearCartBtn.addEventListener('click', () => {
      clearCart();
      renderCart({ cart: loadCart(), productsById });
    });

    checkoutBtn.addEventListener('click', () => {
      // Demo: just clear and show empty state
      clearCart();
      renderCart({ cart: loadCart(), productsById });
    });
  } catch (err) {
    console.error(err);
    cartEmptyEl.classList.remove('hidden');
    cartContentEl.classList.add('hidden');
    cartEmptyEl.innerHTML = `
      <div class="text-center">
        <p class="text-gray-300 text-lg mb-2">Could not load cart.</p>
        <p class="text-gray-500 text-sm mb-4">Please refresh the page.</p>
        <a href="/" class="inline-block px-5 py-2.5 rounded-lg bg-blue-primary hover:bg-blue-secondary transition-colors font-semibold">Back to store</a>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
