// =============================================
// FreshMart POS — Main Screen Logic (API-backed)
// Global variables and core functions.
// Module files: cart.js, customer.js, promotions.js, points.js, payment.js
// =============================================

let cart = [];            // { MaSP, TenSP, DonViTinh, GiaBan, GiaSauGiam, HinhAnh, quantity, discount, promoName }
let currentEmployee = null;
let currentCustomer = null;
let selectedMaPT = null;
let selectedCategory = 'ALL';

// Cached data from API
let categoriesCache = [];
let productsCache = [];
let paymentMethodsCache = [];
let activePromosCache = [];

// ── INIT ──
window.onload = async function () {
  const empData = localStorage.getItem('loggedInEmployee');
  if (!empData) {
    window.location.href = 'login.html';
    return;
  }
  currentEmployee = JSON.parse(empData);
  document.getElementById('employee-name').innerText =
    currentEmployee.HoTen + ' (' + currentEmployee.ChucVu + ')';

  if (currentEmployee.ChucVu === 'Quản lý') {
    var navPromo = document.getElementById('nav-promotions');
    if (navPromo) navPromo.style.display = '';
  }

  try {
    [categoriesCache, productsCache, paymentMethodsCache, activePromosCache] = await Promise.all([
      apiGetCategories(),
      apiGetProducts(),
      apiGetPaymentMethods(),
      apiGetActivePromotions(),
    ]);

    // Load discounts for all products
    await loadDiscounts();

    renderCategoryTabs();
    renderProducts(productsCache);
    renderCart();
  } catch (err) {
    console.error('Failed to load data:', err);
    showToast('Không thể kết nối server. Kiểm tra backend đang chạy.', 'error');
  }
};

async function loadDiscounts() {
  const promises = productsCache.map(async sp => {
    try {
      const disc = await apiGetProductDiscount(sp.MaSP);
      sp._discount = disc;
    } catch {
      sp._discount = null;
    }
  });
  await Promise.all(promises);
}

// ── LOGOUT ──
function logout() {
  if (cart.length > 0 && !confirm('Bạn có sản phẩm trong hóa đơn. Đăng xuất?')) return;
  localStorage.removeItem('loggedInEmployee');
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}

// ── CATEGORY TABS ──
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  let html = '<button class="cat-tab active" onclick="filterByCategory(\'ALL\', this)">Tất cả</button>';
  categoriesCache.forEach(nh => {
    html += `<button class="cat-tab" onclick="filterByCategory('${nh.MaNhom}', this)">${nh.TenNhom}</button>`;
  });
  container.innerHTML = html;
}

function filterByCategory(maNhom, btn) {
  selectedCategory = maNhom;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

// ── COMBINED FILTER ──
function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase();
  let filtered = productsCache;

  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter(sp => sp.MaNhom === selectedCategory);
  }
  if (query) {
    filtered = filtered.filter(sp =>
      sp.TenSP.toLowerCase().includes(query) || sp.MaSP.toLowerCase().includes(query)
    );
  }
  renderProducts(filtered);
}

// ── CALCULATE TOTAL ──
function calculateTotal() {
  let subtotal = cart.reduce((s, i) => s + i.GiaBan * i.quantity, 0);
  let totalDiscount = cart.reduce((s, i) => s + i.discount * i.quantity, 0);
  let pointsUsed = getPointsUsed();
  let pointsDiscount = pointsUsed * 0.1;
  let afterDiscount = subtotal - totalDiscount - pointsDiscount;
  if (afterDiscount < 0) afterDiscount = 0;
  let tax = afterDiscount * 0.1;
  let total = afterDiscount + tax;

  document.getElementById('subtotal').innerText = fmtVND(subtotal);
  document.getElementById('tax').innerText = fmtVND(tax);
  document.getElementById('total').innerText = fmtVND(total);

  const discountRow = document.getElementById('discount-row');
  if (totalDiscount > 0) {
    discountRow.style.display = '';
    document.getElementById('discount').innerText = '-' + fmtVND(totalDiscount);
  } else {
    discountRow.style.display = 'none';
  }

  const pointsRow = document.getElementById('points-discount-row');
  if (pointsDiscount > 0) {
    pointsRow.style.display = '';
    document.getElementById('points-discount').innerText = '-' + fmtVND(pointsDiscount);
  } else {
    pointsRow.style.display = 'none';
  }

  renderPromoPanel();
}

// ── CLEAR INVOICE ──
function clearInvoice() {
  if (cart.length === 0) return;
  document.getElementById('modal-clear').style.display = 'flex';
}

function confirmClear() {
  cart = [];
  currentCustomer = null;
  document.getElementById('customer-display').innerText = 'Chưa chọn';
  document.getElementById('customer-display').className = 'customer-tag';
  if (document.getElementById('inp-sdt')) document.getElementById('inp-sdt').value = '';
  if (document.getElementById('customer-info')) document.getElementById('customer-info').innerHTML = '';
  document.getElementById('inp-points').value = 0;
  updatePointsSection();
  renderCart();
  closeAllModals();
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}
