// =============================================
// FreshMart POS — Main Screen Logic
// Everything happens on this one screen.
// =============================================

let cart = [];            // { MaSP, TenSP, DonViTinh, GiaBan, GiaSauGiam, image, quantity, discount }
let currentEmployee = null;
let currentCustomer = null;  // null = walk-in
let selectedMaPT = null;
let selectedCategory = 'ALL';

// ── INIT ──
window.onload = function () {
  // Check login
  const empData = localStorage.getItem('loggedInEmployee');
  if (!empData) {
    window.location.href = 'login.html';
    return;
  }
  currentEmployee = JSON.parse(empData);
  document.getElementById('employee-name').innerText =
    currentEmployee.HoTen + ' (' + currentEmployee.ChucVu + ')';

  renderCategoryTabs();
  renderProducts(MOCK_SANPHAM);
  renderCart();
};

// ── LOGOUT ──
function logout() {
  if (cart.length > 0 && !confirm('You have items in the invoice. Logout anyway?')) return;
  localStorage.removeItem('loggedInEmployee');
  window.location.href = 'login.html';
}

// ── CATEGORY TABS (from NHOMHANG) ──
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  let html = '<button class="cat-tab active" onclick="filterByCategory(\'ALL\', this)">All</button>';
  MOCK_NHOMHANG.forEach(nh => {
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

// ── COMBINED FILTER (search + category) ──
function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase();
  let filtered = MOCK_SANPHAM;

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
    const category = getCategoryById(sp.MaNhom);
    const outOfStock = sp.SoLuongTon <= 0;
    const promo = getProductDiscount(sp.MaSP);
    const finalPrice = promo ? sp.GiaBan - promo.MucGiam : sp.GiaBan;

    return `
      <div class="card ${outOfStock ? 'out-of-stock' : ''}" onclick="${outOfStock ? '' : "addToCart('" + sp.MaSP + "')"}">
        ${promo ? '<div class="promo-badge">-$' + promo.MucGiam.toFixed(2) + '</div>' : ''}
        <img src="${sp.image}" alt="${sp.TenSP}" />
        <div class="card-body">
          <div class="title">
            ${sp.TenSP}
            <span>
              ${promo ? '<s style="color:#999;font-size:11px;">$' + sp.GiaBan.toFixed(2) + '</s> ' : ''}
              $${finalPrice.toFixed(2)}/${sp.DonViTinh}
            </span>
          </div>
          <p>${category ? category.TenNhom : ''} · Stock: ${sp.SoLuongTon}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ── ADD TO CART (with promotion auto-applied) ──
function addToCart(maSP) {
  const product = getProductById(maSP);
  if (!product || product.SoLuongTon <= 0) return;

  let item = cart.find(p => p.MaSP === maSP);
  if (item) {
    if (item.quantity >= product.SoLuongTon) {
      alert('Not enough stock! Remaining: ' + product.SoLuongTon);
      return;
    }
    item.quantity++;
  } else {
    const promo = getProductDiscount(maSP);
    const discount = promo ? promo.MucGiam : 0;
    cart.push({
      MaSP: product.MaSP,
      TenSP: product.TenSP,
      DonViTinh: product.DonViTinh,
      GiaBan: product.GiaBan,
      GiaSauGiam: product.GiaBan - discount,
      image: product.image,
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
    container.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-basket-shopping"></i><p>No items yet</p></div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" class="cart-img"/>
        <div class="cart-info">
          <p class="name">${item.TenSP}</p>
          <p class="price">
            ${item.discount > 0 ? '<s style="color:#ccc;font-size:11px;">$' + item.GiaBan.toFixed(2) + '</s> ' : ''}
            $${item.GiaSauGiam.toFixed(2)}
          </p>
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${item.MaSP}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.MaSP}', 1)">+</button>
        </div>
        <div class="cart-line-total">$${(item.GiaSauGiam * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');
  }
  calculateTotal();
}

function changeQty(maSP, delta) {
  let item = cart.find(p => p.MaSP === maSP);
  if (!item) return;

  if (delta > 0) {
    const product = getProductById(maSP);
    if (item.quantity >= product.SoLuongTon) {
      alert('Not enough stock! Remaining: ' + product.SoLuongTon);
      return;
    }
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.MaSP !== maSP);
  }
  renderCart();
}

// ── CALCULATE TOTAL (with promotions) ──
function calculateTotal() {
  let subtotal = cart.reduce((s, i) => s + i.GiaBan * i.quantity, 0);
  let totalDiscount = cart.reduce((s, i) => s + i.discount * i.quantity, 0);
  let afterDiscount = subtotal - totalDiscount;
  let tax = afterDiscount * 0.1;
  let total = afterDiscount + tax;

  document.getElementById('subtotal').innerText = '$' + subtotal.toFixed(2);
  document.getElementById('tax').innerText = '$' + tax.toFixed(2);
  document.getElementById('total').innerText = '$' + total.toFixed(2);

  const discountRow = document.getElementById('discount-row');
  if (totalDiscount > 0) {
    discountRow.style.display = '';
    document.getElementById('discount').innerText = '-$' + totalDiscount.toFixed(2);
  } else {
    discountRow.style.display = 'none';
  }
}

// ── CUSTOMER LOOKUP (optional) ──
function toggleCustomer() {
  const fields = document.getElementById('customer-fields');
  fields.style.display = fields.style.display === 'none' ? 'flex' : 'none';
}

function lookupCustomer(sdt) {
  const customer = getCustomerByPhone(sdt);
  const infoBox = document.getElementById('customer-info');
  const display = document.getElementById('customer-display');

  if (customer) {
    currentCustomer = customer;
    display.innerText = customer.HoTen;
    display.className = 'customer-tag found';
    infoBox.innerHTML = `
      <span><b>${customer.HoTen}</b> (${customer.MaKH})</span>
      <span>${customer.HangThanhVien} · ${customer.DiemTichLuy} pts</span>
    `;
  } else {
    currentCustomer = null;
    display.innerText = sdt ? 'Not found' : 'Walk-in';
    display.className = 'customer-tag';
    infoBox.innerHTML = '';
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
  document.getElementById('customer-display').innerText = 'Walk-in';
  document.getElementById('customer-display').className = 'customer-tag';
  document.getElementById('inp-sdt') && (document.getElementById('inp-sdt').value = '');
  document.getElementById('customer-info') && (document.getElementById('customer-info').innerHTML = '');
  renderCart();
  closeAllModals();
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

// ── PAYMENT FLOW (all modals, no page change) ──
function openPaymentModal() {
  if (cart.length === 0) return alert('Invoice is empty!');

  // Render payment methods from PHUONGTHUCTT
  const container = document.getElementById('payment-methods');
  selectedMaPT = null;
  container.innerHTML = MOCK_PHUONGTHUCTT.map(pt => `
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
  const maHD = generateId('HD', MOCK_HOADON, 'MaHD');
  const payment = getPaymentById(selectedMaPT);
  const customerName = currentCustomer ? currentCustomer.HoTen + ' (' + currentCustomer.MaKH + ')' : 'Walk-in Customer';

  document.getElementById('rec-mahd').innerText = maHD;
  document.getElementById('rec-date').innerText = new Date().toLocaleString();
  document.getElementById('rec-employee').innerText = currentEmployee.HoTen + ' (' + currentEmployee.MaNV + ')';
  document.getElementById('rec-customer').innerText = customerName;
  document.getElementById('rec-method').innerText = payment.TenPT;

  // Items
  document.getElementById('rec-items-list').innerHTML = cart.map((item, i) => `
    <div class="rec-item-row">
      <span>${i + 1}. ${item.TenSP} x${item.quantity}</span>
      <span>$${(item.GiaSauGiam * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  // Totals
  let subtotal = cart.reduce((s, i) => s + i.GiaBan * i.quantity, 0);
  let totalDiscount = cart.reduce((s, i) => s + i.discount * i.quantity, 0);
  let afterDiscount = subtotal - totalDiscount;
  let tax = afterDiscount * 0.1;
  let total = afterDiscount + tax;

  document.getElementById('rec-sub').innerText = '$' + subtotal.toFixed(2);
  document.getElementById('rec-tax').innerText = '$' + tax.toFixed(2);
  document.getElementById('rec-total').innerText = '$' + total.toFixed(2);

  const discountRow = document.getElementById('rec-discount-row');
  if (totalDiscount > 0) {
    discountRow.style.display = '';
    document.getElementById('rec-discount').innerText = '-$' + totalDiscount.toFixed(2);
  } else {
    discountRow.style.display = 'none';
  }

  // Points
  let pointsEarned = Math.floor(afterDiscount / 10);
  document.getElementById('rec-points').innerText =
    currentCustomer && pointsEarned > 0 ? 'Loyalty: +' + pointsEarned + ' pts → ' + currentCustomer.HoTen : '';

  document.getElementById('modal-receipt').style.display = 'flex';
}

// ── FINISH ORDER — build DB records, deduct stock, reset for next customer ──
function finishOrder() {
  let subtotal = cart.reduce((s, i) => s + i.GiaBan * i.quantity, 0);
  let totalDiscount = cart.reduce((s, i) => s + i.discount * i.quantity, 0);
  let afterDiscount = subtotal - totalDiscount;
  let tax = afterDiscount * 0.1;
  let total = afterDiscount + tax;

  const maHD = document.getElementById('rec-mahd').innerText;

  // HOADON record
  const hoaDon = {
    MaHD: maHD,
    NgayLap: new Date().toISOString().split('T')[0],
    TongTien: total,
    MaNV: currentEmployee.MaNV,
    MaKH: currentCustomer ? currentCustomer.MaKH : 'WALKIN',
    MaPT: selectedMaPT
  };

  // CHITIETHOADON records
  const chiTiet = cart.map(item => ({
    MaHD: maHD,
    MaSP: item.MaSP,
    SoLuong: item.quantity,
    DonGia: item.GiaSauGiam
  }));

  // LICHSUDIEM record (only for registered customers)
  let pointsEarned = Math.floor(afterDiscount / 10);
  const lichSuDiem = currentCustomer && pointsEarned > 0 ? {
    MaGD: MOCK_LICHSUDIEM.length + 1,
    MaKH: currentCustomer.MaKH,
    NgayGD: hoaDon.NgayLap,
    SoDiemThayDoi: pointsEarned
  } : null;

  // Push to mock arrays (simulates backend save)
  MOCK_HOADON.push(hoaDon);
  chiTiet.forEach(ct => MOCK_CHITIETHOADON.push(ct));
  if (lichSuDiem) {
    MOCK_LICHSUDIEM.push(lichSuDiem);
    currentCustomer.DiemTichLuy += pointsEarned;
  }

  // Deduct stock
  deductStock(cart);

  // Log DB records
  console.log('=== HOADON ===', hoaDon);
  console.log('=== CHITIETHOADON ===', chiTiet);
  if (lichSuDiem) console.log('=== LICHSUDIEM ===', lichSuDiem);

  // Reset for next customer (NO page redirect)
  closeAllModals();
  cart = [];
  currentCustomer = null;
  selectedMaPT = null;
  document.getElementById('customer-display').innerText = 'Walk-in';
  document.getElementById('customer-display').className = 'customer-tag';
  if (document.getElementById('inp-sdt')) document.getElementById('inp-sdt').value = '';
  if (document.getElementById('customer-info')) document.getElementById('customer-info').innerHTML = '';
  document.getElementById('customer-fields').style.display = 'none';

  renderProducts(MOCK_SANPHAM);
  renderCart();
}
