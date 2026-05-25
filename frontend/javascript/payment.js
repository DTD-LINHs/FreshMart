// =============================================
// FreshMart POS — Payment Module
// Depends on globals: cart, currentEmployee, currentCustomer, selectedMaPT,
//                     paymentMethodsCache, productsCache (from main.js)
// Depends on: fmtVND(), showToast() (from api.js)
//             apiCheckout(), apiGetProducts() (from api.js)
//             getPointsUsed() (from points.js), updatePointsSection() (from points.js)
//             closeAllModals(), loadDiscounts() (from main.js)
//             renderProducts(), renderCart() (from cart.js)
// =============================================

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
