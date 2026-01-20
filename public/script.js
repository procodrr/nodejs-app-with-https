// API Base URL
const API_BASE = '/api';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const usersContainer = document.getElementById('usersContainer');
const loading = document.getElementById('loading');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const categoryFilter = document.getElementById('categoryFilter');
const cartCountEl = document.getElementById('cartCount');

let allProducts = [];
let currentFilter = 'all';

// -------- Cart (localStorage) --------
const CART_STORAGE_KEY = 'techstore_cart_v1';

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

function updateCartBadge() {
    if (!cartCountEl) return;
    const cart = loadCart();
    const count = getCartItemCount(cart);
    cartCountEl.textContent = String(count);
    cartCountEl.classList.toggle('hidden', count === 0);
}

// Fetch all products
async function fetchProducts() {
    try {
        loading.classList.remove('hidden');
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        
        if (data.success) {
            allProducts = data.data;
            displayProducts(allProducts);
        } else {
            showError('Failed to load products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Error loading products. Please try again.');
    } finally {
        loading.classList.add('hidden');
    }
}

// Display products
function displayProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="col-span-full text-center text-gray-400 text-xl">No products found</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="bg-dark-card rounded-lg overflow-hidden shadow-lg hover:shadow-blue-primary/20 transition-shadow border border-blue-primary/10">
            <div class="relative h-64 bg-dark-surface overflow-hidden">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onerror="this.src='https://via.placeholder.com/500x500/1e293b/60a5fa?text=No+Image'"
                >
                <div class="absolute top-2 right-2 bg-blue-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ₹${product.price.toLocaleString('en-IN')}
                </div>
            </div>
            <div class="p-6">
                <span class="text-blue-accent text-sm font-semibold">${product.category}</span>
                <h3 class="text-xl font-bold text-white mt-2 mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${product.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-gray-500 text-sm">Stock: ${product.stock}</span>
                    <button 
                        class="bg-blue-primary hover:bg-blue-secondary text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products by category
function filterProducts(category) {
    currentFilter = category;

    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Fetch all users
async function fetchUsers() {
    try {
        loadUsersBtn.disabled = true;
        loadUsersBtn.textContent = 'Loading...';
        
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.data);
        } else {
            showError('Failed to load users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        showError('Error loading users. Please try again.');
    } finally {
        loadUsersBtn.disabled = false;
        loadUsersBtn.textContent = 'Load Users';
    }
}

// Display users
function displayUsers(users) {
    if (users.length === 0) {
        usersContainer.innerHTML = '<p class="col-span-full text-center text-gray-400 text-xl">No users found</p>';
        return;
    }

    usersContainer.innerHTML = users.map(user => `
        <div class="bg-dark-card rounded-lg p-6 shadow-lg border border-blue-primary/10 hover:border-blue-primary/30 transition-colors">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-blue-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white">${user.name}</h3>
                    <p class="text-blue-accent text-sm">${user.role}</p>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-gray-400">
                    <span class="text-gray-500">Email:</span> 
                    <span class="text-blue-accent">${user.email}</span>
                </p>
                <p class="text-gray-400">
                    <span class="text-gray-500">Joined:</span> 
                    ${new Date(user.joinedDate).toLocaleDateString()}
                </p>
            </div>
        </div>
    `).join('');
}

// Add to cart function (placeholder)
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        const cart = loadCart();
        const existing = cart.items.find(i => i.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.items.push({ id: productId, qty: 1 });
        }
        saveCart(cart);
        updateCartBadge();
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Event Listeners
if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        filterProducts(e.target.value);
    });
}

loadUsersBtn.addEventListener('click', fetchUsers);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    fetchProducts();
});
