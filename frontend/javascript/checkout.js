let cart = [];

window.onload = function () {
    const data = localStorage.getItem("cart");
    if (data) {
        cart = JSON.parse(data);
        renderCart();
    }
};

function renderCart(){
    const container = document.getElementById("cart-items");
    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}">
            <div class="checkout-item-name">${item.name}</div>
            <div class="checkout-item-price">$${item.price.toFixed(2)}</div>
            <div class="checkout-item-qty">Quantity : ${item.quantity}</div>
            <div style="margin-left: 20px; color: #ccc; cursor: pointer;">✕</div>
        </div>
    `).join("");
    calculateTotal();
}

function calculateTotal(){
    let subtotal = cart.reduce((sum, item)=> sum + item.price * item.quantity, 0);
    let tax = subtotal * 0.1;
    let total = subtotal + tax + 24; // Cộng thêm Charges $24

    document.getElementById("subtotal").innerText = "$" + subtotal.toFixed(2);
    document.getElementById("tax").innerText = "$" + tax.toFixed(2);
    document.getElementById("total").innerText = "$" + total.toFixed(2);
}

// BƯỚC 1: Mở modal chọn phương thức
function openPaymentModal() {
    if(cart.length === 0) return alert("Cart is empty!");
    document.getElementById('modal-payment').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// BƯỚC 2: Xác nhận phương thức và điền vào Receipt
function confirmAndShowReceipt(method) {
    closeModal('modal-payment');
    
    // Lấy thông tin từ Input
    const name = document.getElementById('inp-name').value || "Walk-in Customer";
    const id = document.getElementById('inp-id').value || "N/A";
    
    // Gán dữ liệu vào Modal Receipt
    document.getElementById('rec-name').innerText = name;
    document.getElementById('rec-id').innerText = id;
    document.getElementById('rec-method').innerText = method;
    document.getElementById('rec-date').innerText = new Date().toLocaleString();

    // Render danh sách món vào receipt
    const list = document.getElementById('rec-items-list');
    list.innerHTML = cart.map((item, index) => `
        <div class="rec-item-row">
            <span>${index + 1}. ${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Sao chép tiền tổng
    document.getElementById('rec-sub').innerText = document.getElementById('subtotal').innerText;
    document.getElementById('rec-tax').innerText = document.getElementById('tax').innerText;
    document.getElementById('rec-total').innerText = document.getElementById('total').innerText;

    document.getElementById('modal-receipt').style.display = 'flex';
}

// BƯỚC 3: Hoàn tất đơn hàng (Gửi backend và reset)
async function finishOrder() {
    // Gọi API của bạn ở đây nếu cần
    alert("Transaction Completed & Receipt Printed!");
    localStorage.removeItem("cart");
    window.location.href = "home.html"; // Chuyển về trang chủ
}