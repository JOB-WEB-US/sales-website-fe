// Giỏ hàng toàn cục (Duy trì không mất khi đổi trang)
let cart = [];

// Hàm Fetch trang HTML động vào main#app
async function loadPage(pageName) {
  const app = document.getElementById('app');
  
  try {
    const response = await fetch(`./pages/${pageName}.html`);
    if (!response.ok) throw new Error('Không thể tải trang');
    
    const html = await response.text();
    app.innerHTML = html;

    // Cập nhật trạng thái menu active
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-page') === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Chạy logic riêng cho từng trang
    initPageLogic(pageName);

  } catch (error) {
    app.innerHTML = `<div class="container page-content"><h2>404 - Không tìm thấy trang!</h2></div>`;
  }
}

// Logic cho từng trang sau khi HTML được chèn
function initPageLogic(pageName) {
  if (pageName === 'home') {
    renderProductList(productsData.slice(0, 4), 'featuredProductsGrid');
  } else if (pageName === 'shop') {
    renderProductList(productsData, 'shopProductsGrid');
    setupShopFilters();
  }
}

// Render danh sách sản phẩm
function renderProductList(products, targetContainerId) {
  const container = document.getElementById(targetContainerId);
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="product-card">
      ${p.isSale ? `<span class="badge-sale">SALE</span>` : ''}
      <img src="${p.image}" alt="${p.title}" class="product-img" />
      <div class="product-info">
        <h4 class="product-title">${p.title}</h4>
        <div class="product-price">
          <span class="current-price">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="old-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="addToCart(${p.id})">
          Add to cart
        </button>
      </div>
    </div>
  `).join('');
}

// Bộ lọc cho trang Shop All
function setupShopFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');

  function applyFilters() {
    let filtered = [...productsData];
    const cat = categoryFilter ? categoryFilter.value : 'all';
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    if (cat !== 'all') {
      filtered = filtered.filter(p => p.category === cat);
    }
    if (query) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
    }

    renderProductList(filtered, 'shopProductsGrid');
  }

  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);
}

// Quản lý giỏ hàng
function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  openCartDrawer();
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cartCount');
  const cartContainer = document.getElementById('cartItemsContainer');
  const totalPriceEl = document.getElementById('cartTotalPrice');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartCountEl.textContent = totalItems;
  totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="text-align: center; color: #777;">Giỏ hàng của bạn đang trống.</p>`;
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" />
      <div class="cart-item-details">
        <h5>${item.title}</h5>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
      </div>
    </div>
  `).join('');
}

// Drawer Cart Controls
function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// Navigation & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Lấy hash trang từ URL (Ví dụ: #shop -> page = shop)
  const initialHash = window.location.hash.replace('#', '') || 'home';
  loadPage(initialHash);

  // Lắng nghe click chuyển trang
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('.nav-link');
    if (navLink) {
      e.preventDefault();
      const page = navLink.getAttribute('data-page');
      window.location.hash = page;
      loadPage(page);
    }
  });

  // Sự kiện đóng/mở cart
  document.getElementById('cartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);
});
