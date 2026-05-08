let cart = [];


function clearInvoice() {
    // Hiện modal thay vì confirm mặc định
    document.getElementById('custom-confirm').style.display = 'flex';
}

function closeModal() {
    document.getElementById('custom-confirm').style.display = 'none';
}

function confirmClear() {
    cart = []; // Xóa giỏ hàng
    renderCart();
    closeModal();
}

function addToCart(name, price, image) {
  let item = cart.find(p => p.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1
    });
  }

  renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#ccc; margin-top:20px;">Your invoice is empty</div>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" class="cart-img"/>
                <div class="cart-info">
                    <p class="name">${item.name}</p>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity">
                        <button onclick="decreaseQty('${item.name}')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQty('${item.name}')">+</button>
                    </div>
                </div>
                <div class="cart-total" style="font-weight:700; font-size:14px;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join("");
    }
    calculateTotal();
}


function calculateTotal() {
  let subtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  let tax = subtotal * 0.1; // Giả sử thuế là 10%
  let total = subtotal + tax;

  document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
  document.getElementById("tax").innerText = `$${tax.toFixed(2)}`;
  document.getElementById("total").innerText = `$${total.toFixed(2)}`;
}


function increaseQty(name) {
  let item = cart.find(p => p.name === name);
  item.quantity++;
  renderCart();
}

function decreaseQty(name) {
  let item = cart.find(p => p.name === name);

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.name !== name);
  }

  renderCart();
}


function goToCheckout(){
    if(cart.length === 0){
        alert("Giỏ hàng đang trống!");
        return;
    }

    // lưu cart vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // chuyển trang
    window.location.href = "/pages/checkout.html";
}

