let cart = [];
let selectedMaPT = null;
let currentEmployee = null;
let currentCustomer = null;

window.onload = function () {
    // Load cart from localStorage
    const data = localStorage.getItem('cart');
    if (data) {
        cart = JSON.parse(data);
        renderCart();
    }

    // Load employee from session
    const empData = localStorage.getItem('currentEmployee');
    currentEmployee = empData ? JSON.parse(empData) : CURRENT_EMPLOYEE;
    document.getElementById('emp-display').innerText =
        currentEmployee.MaNV + ' - ' + currentEmployee.HoTen + ' (' + currentEmployee.ChucVu + ')';

    // Generate invoice ID
    const nextId = generateId('HD', MOCK_HOADON, 'MaHD');
    document.getElementById('invoice-id').innerText = nextId;

    // Render payment methods from PHUONGTHUCTT
    renderPaymentMethods();
};

// --- Render payment methods from DB table ---
function renderPaymentMethods() {
    const container = document.getElementById('payment-methods');
    container.innerHTML = MOCK_PHUONGTHUCTT.map(pt => `
        <button class="method-opt" data-mapt="${pt.MaPT}" onclick="selectPayment('${pt.MaPT}', this)">
            ${pt.TenPT}
            <small style="display:block; font-weight:400; font-size:11px; color:#999;">${pt.MoTa}</small>
        </button>
    `).join('');
}

function selectPayment(maPT, btn) {
    selectedMaPT = maPT;
    document.querySelectorAll('.method-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

// --- Customer lookup by phone (SDT) -> KHACHHANG ---
function lookupCustomer(sdt) {
    const customer = getCustomerByPhone(sdt);
    if (customer) {
        currentCustomer = customer;
        document.getElementById('inp-makh').value = customer.MaKH;
        document.getElementById('inp-hoten').value = customer.HoTen;
        document.getElementById('inp-diem').value = customer.DiemTichLuy;
        document.getElementById('inp-hang').value = customer.HangThanhVien;
    } else {
        currentCustomer = null;
        document.getElementById('inp-makh').value = '';
        document.getElementById('inp-hoten').value = '';
        document.getElementById('inp-diem').value = '';
        document.getElementById('inp-hang').value = '';
    }
}

// --- Render cart items ---
function renderCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}">
            <div class="checkout-item-name">${item.TenSP} <small style="color:#999;">(${item.MaSP})</small></div>
            <div class="checkout-item-price">$${item.GiaBan.toFixed(2)}/${item.DonViTinh}</div>
            <div class="checkout-item-qty">x ${item.quantity}</div>
            <div style="font-weight:700; margin-left:15px;">$${(item.GiaBan * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    calculateTotal();
}

function calculateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + item.GiaBan * item.quantity, 0);
    let tax = subtotal * 0.1;
    let total = subtotal + tax;
    document.getElementById('subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('tax').innerText = '$' + tax.toFixed(2);
    document.getElementById('total').innerText = '$' + total.toFixed(2);
}

// --- Confirm payment ---
function confirmPayment() {
    if (cart.length === 0) return alert('Cart is empty!');
    if (!selectedMaPT) return alert('Please select a payment method!');

    const hoTen = document.getElementById('inp-hoten').value;
    if (!hoTen) return alert('Please enter or lookup a customer!');

    // If customer not found in DB, create a walk-in record
    if (!currentCustomer) {
        const sdt = document.getElementById('inp-sdt').value;
        currentCustomer = {
            MaKH: generateId('KH', MOCK_KHACHHANG, 'MaKH'),
            HoTen: hoTen,
            SDT: sdt || 'N/A',
            DiemTichLuy: 0,
            HangThanhVien: 'Đồng'
        };
    }

    showReceipt();
}

// --- Show receipt modal ---
function showReceipt() {
    const maHD = document.getElementById('invoice-id').innerText;
    const paymentMethod = getPaymentById(selectedMaPT);

    document.getElementById('rec-mahd').innerText = maHD;
    document.getElementById('rec-date').innerText = new Date().toLocaleString();
    document.getElementById('rec-employee').innerText = currentEmployee.HoTen + ' (' + currentEmployee.MaNV + ')';
    document.getElementById('rec-customer').innerText = currentCustomer.HoTen;
    document.getElementById('rec-makh').innerText = currentCustomer.MaKH;
    document.getElementById('rec-method').innerText = paymentMethod.TenPT + ' (' + paymentMethod.MaPT + ')';

    // Render items as CHITIETHOADON rows
    const list = document.getElementById('rec-items-list');
    list.innerHTML = cart.map((item, i) => `
        <div class="rec-item-row">
            <span>${i + 1}. ${item.TenSP} (${item.MaSP}) x${item.quantity}</span>
            <span>$${(item.GiaBan * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    document.getElementById('rec-sub').innerText = document.getElementById('subtotal').innerText;
    document.getElementById('rec-tax').innerText = document.getElementById('tax').innerText;
    document.getElementById('rec-total').innerText = document.getElementById('total').innerText;

    // Points earned (100.000đ = 1 point, simplified: $10 = 1 point)
    let subtotal = cart.reduce((sum, item) => sum + item.GiaBan * item.quantity, 0);
    let pointsEarned = Math.floor(subtotal / 10);
    document.getElementById('rec-points').innerText =
        pointsEarned > 0 ? 'Loyalty points earned: +' + pointsEarned + ' points' : '';

    document.getElementById('modal-receipt').style.display = 'flex';
}

// --- Finish order: build HOADON + CHITIETHOADON + LICHSUDIEM records ---
function finishOrder() {
    let subtotal = cart.reduce((sum, item) => sum + item.GiaBan * item.quantity, 0);
    let tax = subtotal * 0.1;
    let total = subtotal + tax;

    // Build HOADON record
    const maHD = document.getElementById('invoice-id').innerText;
    const hoaDon = {
        MaHD: maHD,
        NgayLap: new Date().toISOString().split('T')[0],
        TongTien: total,
        MaNV: currentEmployee.MaNV,
        MaKH: currentCustomer.MaKH,
        MaPT: selectedMaPT
    };

    // Build CHITIETHOADON records
    const chiTiet = cart.map(item => ({
        MaHD: maHD,
        MaSP: item.MaSP,
        SoLuong: item.quantity,
        DonGia: item.GiaBan
    }));

    // Build LICHSUDIEM record
    let pointsEarned = Math.floor(subtotal / 10);
    const lichSuDiem = pointsEarned > 0 ? {
        MaGD: MOCK_LICHSUDIEM.length + 1,
        MaKH: currentCustomer.MaKH,
        NgayGD: hoaDon.NgayLap,
        SoDiemThayDoi: pointsEarned
    } : null;

    // Log what would be sent to backend
    console.log('=== HOADON ===', hoaDon);
    console.log('=== CHITIETHOADON ===', chiTiet);
    if (lichSuDiem) console.log('=== LICHSUDIEM ===', lichSuDiem);

    alert('Transaction completed! Invoice ' + maHD + ' saved.\nCheck console for DB records.');

    localStorage.removeItem('cart');
    localStorage.removeItem('currentEmployee');
    window.location.href = '../index.html';
}
