// =============================================
// FreshMart POS — Promotions Panel Module
// Depends on globals: activePromosCache, cart (from main.js)
// Depends on: fmtVND() (from api.js)
// =============================================

// ── PROMOTIONS PANEL ──
function togglePromoPanel() {
  const body = document.getElementById("promo-section-body");
  const icon = document.getElementById("promo-toggle-icon");
  if (body.style.display === "none") {
    body.style.display = "";
    icon.style.transform = "rotate(180deg)";
  } else {
    body.style.display = "none";
    icon.style.transform = "";
  }
}

function renderPromoPanel() {
  const section = document.getElementById("promo-section");
  const body = document.getElementById("promo-section-body");
  if (!activePromosCache || activePromosCache.length === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "";

  let html = "";
  activePromosCache.forEach((promo) => {
    html += '<div class="promo-panel-item">';
    html +=
      '<div class="promo-panel-header"><i class="fa-solid fa-gift"></i> <b>' +
      promo.TenKM +
      "</b>";
    html +=
      '<span class="promo-panel-date">' +
      promo.NgayBatDau +
      " → " +
      promo.NgayKetThuc +
      "</span></div>";

    promo.products.forEach((p) => {
      const inCart = cart.find((c) => c.MaSP === p.MaSP);
      const applied = inCart && inCart.discount > 0;
      const statusClass = applied ? "applied" : "not-applied";
      const statusText = applied
        ? '<i class="fa-solid fa-check-circle"></i> Đã áp dụng (x' +
          inCart.quantity +
          " = -" +
          fmtVND(p.MucGiam * inCart.quantity) +
          ")"
        : '<i class="fa-solid fa-cart-plus"></i> Thêm <b>' +
          p.TenSP +
          "</b> vào giỏ để được giảm " +
          fmtVND(p.MucGiam);

      html += '<div class="promo-product-row ' + statusClass + '">';
      html +=
        '<span class="promo-product-name">' +
        p.TenSP +
        " <small>(" +
        p.MaSP +
        ")</small></span>";
      html +=
        '<span class="promo-product-discount">-' +
        fmtVND(p.MucGiam) +
        "/sp</span>";
      html += "</div>";
      html +=
        '<div class="promo-product-status ' +
        statusClass +
        '">' +
        statusText +
        "</div>";
    });
    html += "</div>";
  });
  body.innerHTML = html;
}
