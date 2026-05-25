// =============================================
// FreshMart POS — Points Module
// Depends on globals: currentCustomer (from main.js)
// Depends on: fmtVND() (from api.js), calculateTotal() (from main.js)
// =============================================

// ── POINTS ──
function getPointsUsed() {
  const inp = document.getElementById("inp-points");
  return inp ? Math.max(0, parseInt(inp.value) || 0) : 0;
}

function onPointsChange() {
  let pts = getPointsUsed();
  const max = currentCustomer ? currentCustomer.DiemTichLuy || 0 : 0;
  if (pts > max) {
    pts = max;
    document.getElementById("inp-points").value = max;
  }
  document.getElementById("points-value").innerText = "= " + fmtVND(pts * 0.1);
  calculateTotal();
}

function useAllPoints() {
  const max = currentCustomer ? currentCustomer.DiemTichLuy || 0 : 0;
  document.getElementById("inp-points").value = max;
  onPointsChange();
}

function updatePointsSection() {
  const section = document.getElementById("points-section");
  if (currentCustomer && (currentCustomer.DiemTichLuy || 0) > 0) {
    section.style.display = "";
    document.getElementById("points-available").innerText =
      (currentCustomer.DiemTichLuy || 0) + " điểm";
    document.getElementById("inp-points").max =
      currentCustomer.DiemTichLuy || 0;
  } else {
    section.style.display = "none";
    document.getElementById("inp-points").value = 0;
  }
}
