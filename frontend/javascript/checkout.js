let cart = [];
let selectedMaPT = null;
let currentEmployee = null;
let currentCustomer = null;

window.onload = async function () {
  // Load cart from localStorage
  const data = localStorage.getItem("cart");
  if (data) {
    cart = JSON.parse(data);
    renderCart();
  }

  // Load employee from session
  const empData = localStorage.getItem("loggedInEmployee");
  currentEmployee = empData ? JSON.parse(empData) : null;
  if (!currentEmployee) {
    window.location.href = "../login.html";
    return;
  }

  var navPromo = document.getElementById("nav-promotions");
  if (navPromo && currentEmployee.ChucVu === "Quản lý")
    navPromo.style.display = "";

  document.getElementById("emp-display").innerText =
    currentEmployee.MaNV +
    " - " +
    currentEmployee.HoTen +
    " (" +
    currentEmployee.ChucVu +
    ")";

  document.getElementById("invoice-id").innerText = "(tự động)";

  // Render payment methods from API
  await renderPaymentMethods();
};

async function renderPaymentMethods() {
  try {
    const methods = await apiGetPaymentMethods();
    const container = document.getElementById("payment-methods");
    container.innerHTML = methods
      .map(
        (pt) => `
            <button class="method-opt" data-mapt="${pt.MaPT}" onclick="selectPayment('${pt.MaPT}', this)">
                ${pt.TenPT}
                <small style="display:block; font-weight:400; font-size:11px; color:#999;">${pt.MoTa}</small>
            </button>
        `,
      )
      .join("");
  } catch (err) {
    console.error("Failed to load payment methods:", err);
  }
}

function selectPayment(maPT, btn) {
  selectedMaPT = maPT;
  document
    .querySelectorAll(".method-opt")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
}

// --- Customer lookup by phone ---
let lookupTimer = null;
function lookupCustomer(sdt) {
  clearTimeout(lookupTimer);
  if (!sdt || sdt.length < 3) {
    currentCustomer = null;
    document.getElementById("inp-makh").value = "";
    document.getElementById("inp-hoten").value = "";
    document.getElementById("inp-diem").value = "";
    document.getElementById("inp-hang").value = "";
    return;
  }
  lookupTimer = setTimeout(async () => {
    try {
      const customer = await apiGetCustomerByPhone(sdt);
      currentCustomer = customer;
      document.getElementById("inp-makh").value = customer.MaKH;
      document.getElementById("inp-hoten").value = customer.HoTen;
      document.getElementById("inp-diem").value = customer.DiemTichLuy;
      document.getElementById("inp-hang").value = customer.HangThanhVien || "";
    } catch {
      currentCustomer = null;
      document.getElementById("inp-makh").value = "";
      document.getElementById("inp-hoten").value = "Không tìm thấy";
      document.getElementById("inp-diem").value = "";
      document.getElementById("inp-hang").value = "";
    }
  }, 400);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = cart
    .map(
      (item) => `
        <div class="checkout-item">
            <img src="${productImageUrl(item.HinhAnh || item.image, item.TenSP, 80, 80, item.MaSP)}" onerror="${productImageFallback(item.MaSP, item.TenSP, 80, 80)}">
            <div class="checkout-item-name">${item.TenSP} <small style="color:#999;">(${item.MaSP})</small></div>
            <div class="checkout-item-price">${fmtVND(item.GiaBan)}/${item.DonViTinh}</div>
            <div class="checkout-item-qty">x ${item.quantity}</div>
            <div style="font-weight:700; margin-left:15px;">${fmtVND(item.GiaBan * item.quantity)}</div>
        </div>
    `,
    )
    .join("");
  calculateTotal();
}

function calculateTotal() {
  let subtotal = cart.reduce(
    (sum, item) => sum + item.GiaBan * item.quantity,
    0,
  );
  let tax = subtotal * 0.1;
  let total = subtotal + tax;
  document.getElementById("subtotal").innerText = fmtVND(subtotal);
  document.getElementById("tax").innerText = fmtVND(tax);
  document.getElementById("total").innerText = fmtVND(total);
}

function confirmPayment() {
  if (cart.length === 0) return showToast("Giỏ hàng trống!", "warning");
  if (!selectedMaPT)
    return showToast("Vui lòng chọn phương thức thanh toán!", "warning");
  if (!currentCustomer)
    return showToast("Vui lòng tìm khách hàng trước!", "warning");

  showReceipt();
}

async function showReceipt() {
  let payment;
  try {
    const methods = await apiGetPaymentMethods();
    payment = methods.find((p) => p.MaPT === selectedMaPT);
  } catch {
    payment = { TenPT: selectedMaPT };
  }

  document.getElementById("rec-mahd").innerText = "(chờ xử lý)";
  document.getElementById("rec-date").innerText = new Date().toLocaleString(
    "vi-VN",
  );
  document.getElementById("rec-employee").innerText =
    currentEmployee.HoTen + " (" + currentEmployee.MaNV + ")";
  document.getElementById("rec-customer").innerText = currentCustomer.HoTen;
  document.getElementById("rec-makh").innerText = currentCustomer.MaKH;
  document.getElementById("rec-method").innerText =
    payment.TenPT + " (" + payment.MaPT + ")";

  const list = document.getElementById("rec-items-list");
  list.innerHTML = cart
    .map(
      (item, i) => `
        <div class="rec-item-row">
            <span>${i + 1}. ${item.TenSP} (${item.MaSP}) x${item.quantity}</span>
            <span>${fmtVND(item.GiaBan * item.quantity)}</span>
        </div>
    `,
    )
    .join("");

  document.getElementById("rec-sub").innerText =
    document.getElementById("subtotal").innerText;
  document.getElementById("rec-tax").innerText =
    document.getElementById("tax").innerText;
  document.getElementById("rec-total").innerText =
    document.getElementById("total").innerText;

  let subtotal = cart.reduce(
    (sum, item) => sum + item.GiaBan * item.quantity,
    0,
  );
  let pointsEarned = Math.floor(subtotal / 10);
  document.getElementById("rec-points").innerText =
    pointsEarned > 0 ? "Điểm tích lũy: +" + pointsEarned + " điểm" : "";

  document.getElementById("modal-receipt").style.display = "flex";
}

async function finishOrder() {
  const btn = document.querySelector(".btn-print-final");
  btn.disabled = true;
  btn.innerText = "Đang xử lý...";

  try {
    const result = await apiCheckout({
      MaNV: currentEmployee.MaNV,
      MaKH: currentCustomer.MaKH,
      MaPT: selectedMaPT,
      items: cart.map((item) => ({ MaSP: item.MaSP, SoLuong: item.quantity })),
    });

    // Save creation time to localStorage (workaround for DB Date type)
    localStorage.setItem(`invoice_time_${result.MaHD}`, new Date().toISOString());

    document.getElementById("rec-mahd").innerText = result.MaHD;
    showToast(
      "Hoàn tất! Hóa đơn " +
        result.MaHD +
        ". Điểm tích lũy: " +
        result.points_earned,
      "success",
    );

    localStorage.removeItem("cart");
    window.location.href = "../index.html";
  } catch (err) {
    showToast("Thanh toán thất bại: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "In hóa đơn";
  }
}
