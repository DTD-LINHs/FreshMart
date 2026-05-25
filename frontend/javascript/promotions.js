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
    body.dataset.opened = "1";
    icon.style.transform = "rotate(180deg)";
  } else {
    body.style.display = "none";
    delete body.dataset.opened;
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
  var totalProducts = activePromosCache.reduce(function (s, p) { return s + p.products.length; }, 0);
  document.getElementById("promo-section-count").innerText =
    activePromosCache.length + " khuyến mãi khả dụng";

  section.style.display = "";
  if (!body.dataset.opened) {
    body.style.display = "none";
  }

  let html = "";
  activePromosCache.forEach((promo, idx) => {
    if (idx > 0) html += '<div class="promo-divider"></div>';
    html += '<div class="promo-panel-item">';
    html +=
      '<div class="promo-panel-header"><i class="fa-solid fa-gift"></i> <b>' +
      promo.TenKM + "</b></div>";
    html +=
      '<div class="promo-panel-date">' +
      promo.NgayBatDau + " → " + promo.NgayKetThuc + "</div>";

    promo.products.forEach((p) => {
      const inCart = cart.find((c) => c.MaSP === p.MaSP);
      const applied = inCart && inCart.discount > 0;
      const statusClass = applied ? "applied" : "not-applied";
      const statusIcon = applied ? "fa-circle-check" : "fa-circle-plus";
      const statusText = applied
        ? "Đã áp dụng (x" + inCart.quantity + " = -" + fmtVND(p.MucGiam * inCart.quantity) + ")"
        : "Thêm vào giỏ để được giảm";

      html += '<div class="promo-product-row ' + statusClass + '">';
      html += '<span class="promo-product-name">' + p.TenSP + "</span>";
      html += '<span class="promo-product-discount">-' + fmtVND(p.MucGiam) + "</span>";
      html += "</div>";
      html += '<div class="promo-product-status ' + statusClass + '">';
      html += '<i class="fa-solid ' + statusIcon + '"></i> ' + statusText;
      html += "</div>";
    });
    html += "</div>";
  });
  body.innerHTML = html;
}
