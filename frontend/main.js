// =============================================
// FreshMart POS — Main Screen Logic (API-backed)
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

// ── RENDER PRODUCTS ──
function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(sp => {
    const category = categoriesCache.find(c => c.MaNhom === sp.MaNhom);
    const outOfStock = sp.SoLuongTon <= 0;
    const promo = sp._discount;
    const finalPrice = promo ? sp.GiaBan - promo.MucGiam : sp.GiaBan;
    const imgSrc = sp.HinhAnh || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(sp.TenSP);

    return `
      <div class="card ${outOfStock ? 'out-of-stock' : ''}" onclick="${outOfStock ? '' : "addToCart('" + sp.MaSP + "')"}">
        ${promo ? '<div class="promo-badge">-' + fmtVND(promo.MucGiam) + '</div>' : ''}
        <img src="${imgSrc}" alt="${sp.TenSP}" />
        <div class="card-body">
          <div class="title">
            ${sp.TenSP}
            <span>
              ${promo ? '<s style="color:#999;font-size:11px;">' + fmtVND(sp.GiaBan) + '</s> ' : ''}
              ${fmtVND(finalPrice)}/${sp.DonViTinh}
            </span>
          </div>
          <p>${category ? category.TenNhom : ''} · Kho: ${sp.SoLuongTon}</p>
          ${promo ? '<p class="card-promo-name"><i class="fa-solid fa-tag"></i> ' + promo.TenKM + '</p>' : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ── ADD TO CART ──
function addToCart(maSP) {
  const product = productsCache.find(p => p.MaSP === maSP);
  if (!product || product.SoLuongTon <= 0) return;

  let item = cart.find(p => p.MaSP === maSP);
  if (item) {
    if (item.quantity >= product.SoLuongTon) {
      showToast('Không đủ hàng! Còn lại: ' + product.SoLuongTon, 'warning');
      return;
    }
    item.quantity++;
  } else {
    const promo = product._discount;
    const discount = promo ? promo.MucGiam : 0;
    cart.push({
      MaSP: product.MaSP,
      TenSP: product.TenSP,
      DonViTinh: product.DonViTinh,
      GiaBan: product.GiaBan,
      GiaSauGiam: product.GiaBan - discount,
      HinhAnh: product.HinhAnh || 'https://via.placeholder.com/80?text=' + encodeURIComponent(product.TenSP),
      quantity: 1,
      discount: discount,
      promoName: promo ? promo.TenKM : null
    });
  }
  renderCart();
}

// ── RENDER CART ──
function renderCart() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-basket-shopping"></i><p>Chưa có sản phẩm</p></div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.HinhAnh}" class="cart-img"/>
        <div class="cart-info">
          <p class="name">${item.TenSP}</p>
          <p class="price">
            ${item.discount > 0 ? '<s style="color:#ccc;font-size:11px;">' + fmtVND(item.GiaBan) + '</s> ' : ''}
            ${fmtVND(item.GiaSauGiam)}
          </p>
          ${item.promoName ? '<p class="cart-promo-tag"><i class="fa-solid fa-tag"></i> ' + item.promoName + ' (-' + fmtVND(item.discount) + ')</p>' : ''}
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${item.MaSP}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.MaSP}', 1)">+</button>
        </div>
        <div class="cart-line-total">${fmtVND(item.GiaSauGiam * item.quantity)}</div>
      </div>
    `).join('');
  }
  calculateTotal();
}

function changeQty(maSP, delta) {
  let item = cart.find(p => p.MaSP === maSP);
  if (!item) return;

  if (delta > 0) {
    const product = productsCache.find(p => p.MaSP === maSP);
    if (item.quantity >= product.SoLuongTon) {
      showToast('Không đủ hàng! Còn lại: ' + product.SoLuongTon, 'warning');
      return;
    }
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.MaSP !== maSP);
  }
  renderCart();
}

// ── POINTS ──
function getPointsUsed() {
  const inp = document.getElementById('inp-points');
  return inp ? Math.max(0, parseInt(inp.value) || 0) : 0;
}

function onPointsChange() {
  let pts = getPointsUsed();
  const max = currentCustomer ? (currentCustomer.DiemTichLuy || 0) : 0;
  if (pts > max) {
    pts = max;
    document.getElementById('inp-points').value = max;
  }
  document.getElementById('points-value').innerText = '= ' + fmtVND(pts * 0.1);
  calculateTotal();
}

function useAllPoints() {
  const max = currentCustomer ? (currentCustomer.DiemTichLuy || 0) : 0;
  document.getElementById('inp-points').value = max;
  onPointsChange();
}

function updatePointsSection() {
  const section = document.getElementById('points-section');
  if (currentCustomer && (currentCustomer.DiemTichLuy || 0) > 0) {
    section.style.display = '';
    document.getElementById('points-available').innerText = (currentCustomer.DiemTichLuy || 0) + ' điểm';
    document.getElementById('inp-points').max = currentCustomer.DiemTichLuy || 0;
  } else {
    section.style.display = 'none';
    document.getElementById('inp-points').value = 0;
  }
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

// ── PROMOTIONS PANEL ──
function togglePromoPanel() {
  const body = document.getElementById('promo-section-body');
  const icon = document.getElementById('promo-toggle-icon');
  if (body.style.display === 'none') {
    body.style.display = '';
    icon.style.transform = 'rotate(180deg)';
  } else {
    body.style.display = 'none';
    icon.style.transform = '';
  }
}

function renderPromoPanel() {
  const section = document.getElementById('promo-section');
  const body = document.getElementById('promo-section-body');
  if (!activePromosCache || activePromosCache.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  let html = '';
  activePromosCache.forEach(promo => {
    html += '<div class="promo-panel-item">';
    html += '<div class="promo-panel-header"><i class="fa-solid fa-gift"></i> <b>' + promo.TenKM + '</b>';
    html += '<span class="promo-panel-date">' + promo.NgayBatDau + ' → ' + promo.NgayKetThuc + '</span></div>';

    promo.products.forEach(p => {
      const inCart = cart.find(c => c.MaSP === p.MaSP);
      const applied = inCart && inCart.discount > 0;
      const statusClass = applied ? 'applied' : 'not-applied';
      const statusText = applied
        ? '<i class="fa-solid fa-check-circle"></i> Đã áp dụng (x' + inCart.quantity + ' = -' + fmtVND(p.MucGiam * inCart.quantity) + ')'
        : '<i class="fa-solid fa-cart-plus"></i> Thêm <b>' + p.TenSP + '</b> vào giỏ để được giảm ' + fmtVND(p.MucGiam);

      html += '<div class="promo-product-row ' + statusClass + '">';
      html += '<span class="promo-product-name">' + p.TenSP + ' <small>(' + p.MaSP + ')</small></span>';
      html += '<span class="promo-product-discount">-' + fmtVND(p.MucGiam) + '/sp</span>';
      html += '</div>';
      html += '<div class="promo-product-status ' + statusClass + '">' + statusText + '</div>';
    });
    html += '</div>';
  });
  body.innerHTML = html;
}

// ── CUSTOMER LOOKUP ──
function toggleCustomer() {
  const fields = document.getElementById('customer-fields');
  fields.style.display = fields.style.display === 'none' ? 'flex' : 'none';
}

let customerLookupTimer = null;
function lookupCustomer(sdt) {
  clearTimeout(customerLookupTimer);
  const infoBox = document.getElementById('customer-info');
  const display = document.getElementById('customer-display');

  if (!sdt || sdt.length < 3) {
    currentCustomer = null;
    display.innerText = 'Chưa chọn';
    display.className = 'customer-tag';
    infoBox.innerHTML = '';
    return;
  }

  customerLookupTimer = setTimeout(async () => {
    try {
      const customer = await apiGetCustomerByPhone(sdt);
      currentCustomer = customer;
      display.innerText = customer.HoTen;
      display.className = 'customer-tag found';
      infoBox.innerHTML = `
        <span><b>${customer.HoTen}</b> (${customer.MaKH})</span>
        <span>${customer.HangThanhVien || 'Thành viên'} · ${customer.DiemTichLuy} điểm</span>
      `;
      updatePointsSection();
    } catch {
      currentCustomer = null;
      display.innerText = 'Không tìm thấy';
      display.className = 'customer-tag';
      infoBox.innerHTML = '<span style="color:#EF4444;">Không tìm thấy. <a href="#" onclick="openAddCustomerModal()" style="color:#3B82F6;">Thêm mới?</a></span>';
      updatePointsSection();
    }
  }, 400);
}

// ── ADD CUSTOMER MODAL ──
function openAddCustomerModal() {
  const sdt = document.getElementById('inp-sdt').value;
  document.getElementById('new-cust-sdt').value = sdt;
  document.getElementById('new-cust-name').value = '';
  document.getElementById('modal-add-customer').style.display = 'flex';
}

async function saveNewCustomer(e) {
  e.preventDefault();
  const name = document.getElementById('new-cust-name').value.trim();
  const sdt = document.getElementById('new-cust-sdt').value.trim();
  if (!name || !sdt) return;

  try {
    // Generate a customer ID
    const existing = await apiGetProducts(); // just to get a count approximation
    const newId = 'KH' + String(Date.now()).slice(-4);

    const customer = await apiCreateCustomer({
      MaKH: newId,
      HoTen: name,
      SDT: sdt,
      DiemTichLuy: 0,
      HangThanhVien: 'Đồng'
    });

    currentCustomer = customer;
    document.getElementById('customer-display').innerText = customer.HoTen;
    document.getElementById('customer-display').className = 'customer-tag found';
    document.getElementById('customer-info').innerHTML = `
      <span><b>${customer.HoTen}</b> (${customer.MaKH})</span>
      <span>${customer.HangThanhVien || 'Thành viên'} · ${customer.DiemTichLuy} điểm</span>
    `;
    updatePointsSection();
    closeAllModals();
  } catch (err) {
    showToast('Không thể tạo khách hàng: ' + err.message, 'error');
  }
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

// ── PAYMENT FLOW ──
function openPaymentModal() {
  if (cart.length === 0) return showToast('Hóa đơn trống!', 'warning');
  if (!currentCustomer) return showToast('Vui lòng chọn khách hàng trước!', 'warning');

  const container = document.getElementById('payment-methods');
  selectedMaPT = null;
  container.innerHTML = paymentMethodsCache.map(pt => `
    <button class="method-opt" onclick="selectAndPay('${pt.MaPT}')">
      <span class="method-name">${pt.TenPT}</span>
      <small>${pt.MoTa}</small>
    </button>
  `).join('');

  document.getElementById('modal-payment').style.display = 'flex';
}

function selectAndPay(maPT) {
  selectedMaPT = maPT;
  closeAllModals();
  showReceipt();
}

// ── RECEIPT ──
function showReceipt() {
  const payment = paymentMethodsCache.find(p => p.MaPT === selectedMaPT);
  const customerName = currentCustomer.HoTen + ' (' + currentCustomer.MaKH + ')';

  document.getElementById('rec-mahd').innerText = '(chờ xử lý)';
  document.getElementById('rec-date').innerText = new Date().toLocaleString('vi-VN');
  document.getElementById('rec-employee').innerText = currentEmployee.HoTen + ' (' + currentEmployee.MaNV + ')';
  document.getElementById('rec-customer').innerText = customerName;
  document.getElementById('rec-method').innerText = payment.TenPT;

  document.getElementById('rec-items-list').innerHTML = cart.map((item, i) => `
    <div class="rec-item-row">
      <span>${i + 1}. ${item.TenSP} x${item.quantity}</span>
      <span>${fmtVND(item.GiaSauGiam * item.quantity)}</span>
    </div>
    ${item.promoName ? '<div class="rec-item-promo"><i class="fa-solid fa-tag"></i> ' + item.promoName + ' (-' + fmtVND(item.discount * item.quantity) + ')</div>' : ''}
  `).join('');

  let subtotal = cart.reduce((s, i) => s + i.GiaBan * i.quantity, 0);
  let totalDiscount = cart.reduce((s, i) => s + i.discount * i.quantity, 0);
  let pointsUsed = getPointsUsed();
  let pointsDiscountAmt = pointsUsed * 0.1;
  let afterDiscount = subtotal - totalDiscount - pointsDiscountAmt;
  if (afterDiscount < 0) afterDiscount = 0;
  let tax = afterDiscount * 0.1;
  let total = afterDiscount + tax;

  document.getElementById('rec-sub').innerText = fmtVND(subtotal);
  document.getElementById('rec-tax').innerText = fmtVND(tax);
  document.getElementById('rec-total').innerText = fmtVND(total);

  const discountRow = document.getElementById('rec-discount-row');
  if (totalDiscount > 0) {
    discountRow.style.display = '';
    document.getElementById('rec-discount').innerText = '-' + fmtVND(totalDiscount);
  } else {
    discountRow.style.display = 'none';
  }

  const pointsRow = document.getElementById('rec-points-row');
  if (pointsDiscountAmt > 0) {
    pointsRow.style.display = '';
    document.getElementById('rec-points-discount').innerText = '-' + fmtVND(pointsDiscountAmt) + ' (' + pointsUsed + ' điểm)';
  } else {
    pointsRow.style.display = 'none';
  }

  let pointsEarned = Math.floor(afterDiscount * 0.01);
  document.getElementById('rec-points').innerText =
    pointsEarned > 0 ? 'Tích điểm: +' + pointsEarned + ' điểm → ' + currentCustomer.HoTen : '';

  document.getElementById('modal-receipt').style.display = 'flex';
}

// ── FINISH ORDER — call backend checkout API ──
async function finishOrder() {
  const btn = document.querySelector('.btn-print-final');
  btn.disabled = true;
  btn.innerText = 'Đang xử lý...';

  try {
    const result = await apiCheckout({
      MaNV: currentEmployee.MaNV,
      MaKH: currentCustomer.MaKH,
      MaPT: selectedMaPT,
      items: cart.map(item => ({ MaSP: item.MaSP, SoLuong: item.quantity })),
      points_used: getPointsUsed(),
    });

    // Update receipt with real invoice ID
    document.getElementById('rec-mahd').innerText = result.MaHD;

    let msg = 'Hóa đơn ' + result.MaHD + ' đã lưu!';
    if (result.points_used > 0) msg += ' Đã dùng ' + result.points_used + ' điểm.';
    msg += ' Tích lũy: +' + result.points_earned + ' điểm.';
    if (result.new_tier) msg += ' Hạng: ' + result.new_tier;
    showToast(msg, 'success');

    // Refresh products (stock changed)
    productsCache = await apiGetProducts();
    await loadDiscounts();

    // Reset for next customer
    closeAllModals();
    cart = [];
    currentCustomer = null;
    selectedMaPT = null;
    document.getElementById('customer-display').innerText = 'Chưa chọn';
    document.getElementById('customer-display').className = 'customer-tag';
    if (document.getElementById('inp-sdt')) document.getElementById('inp-sdt').value = '';
    if (document.getElementById('customer-info')) document.getElementById('customer-info').innerHTML = '';
    document.getElementById('customer-fields').style.display = 'none';
    document.getElementById('inp-points').value = 0;
    updatePointsSection();

    renderProducts(productsCache);
    renderCart();
  } catch (err) {
    showToast('Thanh toán thất bại: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerText = 'Xong & Khách tiếp theo';
  }
}
