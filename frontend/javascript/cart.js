// =============================================
// FreshMart POS — Cart Module
// Depends on globals: cart, productsCache, categoriesCache (from main.js)
// Depends on: fmtVND(), showToast() (from api.js), calculateTotal() (from main.js)
// =============================================

// ── RENDER PRODUCTS ──
function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = products
    .map((sp) => {
      const category = categoriesCache.find((c) => c.MaNhom === sp.MaNhom);
      const outOfStock = sp.SoLuongTon <= 0;
      const promo = sp._discount;
      const finalPrice = promo ? sp.GiaBan - promo.MucGiam : sp.GiaBan;
      const imgSrc =
        sp.HinhAnh ||
        "https://via.placeholder.com/400x300?text=" +
          encodeURIComponent(sp.TenSP);

      return `
      <div class="card ${outOfStock ? "out-of-stock" : ""}${promo ? " has-promo" : ""}" onclick="${outOfStock ? "" : "addToCart('" + sp.MaSP + "')"}">
        ${promo ? '<div class="promo-badge"><i class="fa-solid fa-percent"></i> -' + Math.round(promo.MucGiam / sp.GiaBan * 100) + "%</div>" : ""}
        <img src="${imgSrc}" alt="${sp.TenSP}" />
        <div class="card-body">
          <div class="title">${sp.TenSP}</div>
          <div class="card-price-row">
            <span style="color:var(--orange);font-size:14px;font-weight:800;">${fmtVND(finalPrice)}</span>
            ${promo ? '<span class="card-price-original">' + fmtVND(sp.GiaBan) + "</span>" : ""}
          </div>
          ${promo ? '<p class="card-promo-label"><i class="fa-solid fa-tag"></i> Giảm ' + fmtVND(promo.MucGiam) + "</p>" : ""}
          <p>Còn ${sp.SoLuongTon} · ${sp.DonViTinh}</p>
        </div>
      </div>
    `;
    })
    .join("");
}

// ── ADD TO CART ──
function addToCart(maSP) {
  const product = productsCache.find((p) => p.MaSP === maSP);
  if (!product || product.SoLuongTon <= 0) return;

  let item = cart.find((p) => p.MaSP === maSP);
  if (item) {
    if (item.quantity >= product.SoLuongTon) {
      showToast("Not enough stock! Remaining: " + product.SoLuongTon, "warning");
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
      HinhAnh:
        product.HinhAnh ||
        "https://via.placeholder.com/80?text=" +
          encodeURIComponent(product.TenSP),
      quantity: 1,
      discount: discount,
      promoName: promo ? promo.TenKM : null,
    });
  }
  renderCart();
}

// ── RENDER CART ──
function renderCart() {
  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML =
      '<div class="cart-empty"><i class="fa-solid fa-basket-shopping"></i><p>No products yet</p></div>';
  } else {
    container.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <img src="${item.HinhAnh}" class="cart-img"/>
        <div class="cart-info">
          <p class="name">${item.TenSP}</p>
          <p class="price">
            ${item.discount > 0 ? '<s style="color:#ccc;font-size:11px;">' + fmtVND(item.GiaBan) + "</s> " : ""}
            ${fmtVND(item.GiaSauGiam)}
          </p>
          ${item.promoName ? '<p class="cart-promo-tag"><i class="fa-solid fa-tag"></i> ' + item.promoName + " (-" + fmtVND(item.discount) + ")</p>" : ""}
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${item.MaSP}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.MaSP}', 1)">+</button>
        </div>
        <div class="cart-line-total">${fmtVND(item.GiaSauGiam * item.quantity)}</div>
      </div>
    `,
      )
      .join("");
  }
  calculateTotal();
}

function changeQty(maSP, delta) {
  let item = cart.find((p) => p.MaSP === maSP);
  if (!item) return;

  if (delta > 0) {
    const product = productsCache.find((p) => p.MaSP === maSP);
    if (item.quantity >= product.SoLuongTon) {
      showToast("Not enough stock! Remaining: " + product.SoLuongTon, "warning");
      return;
    }
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((p) => p.MaSP !== maSP);
  }
  renderCart();
}
