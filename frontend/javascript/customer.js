// =============================================
// FreshMart POS — Customer Module
// Depends on globals: currentCustomer (from main.js)
// Depends on: apiGetCustomerByPhone(), apiGetProducts(), apiCreateCustomer() (from api.js)
//             updatePointsSection() (from points.js), closeAllModals() (from main.js)
//             showToast() (from api.js)
// =============================================

// ── CUSTOMER LOOKUP ──
function toggleCustomer() {
  const fields = document.getElementById("customer-fields");
  fields.style.display = fields.style.display === "none" ? "flex" : "none";
}

let customerLookupTimer = null;
function lookupCustomer(sdt) {
  clearTimeout(customerLookupTimer);
  const infoBox = document.getElementById("customer-info");
  const display = document.getElementById("customer-display");

  if (!sdt || sdt.length < 3) {
    currentCustomer = null;
    display.innerText = "No customer";
    display.className = "customer-tag";
    infoBox.innerHTML = "";
    return;
  }

  customerLookupTimer = setTimeout(async () => {
    try {
      const customer = await apiGetCustomerByPhone(sdt);
      currentCustomer = customer;
      display.innerText = customer.HoTen;
      display.className = "customer-tag found";
      infoBox.innerHTML = `
        <span><b>${customer.HoTen}</b> (${customer.MaKH})</span>
        <span>${customer.HangThanhVien || "Member"} · ${customer.DiemTichLuy} points</span>
      `;
      updatePointsSection();
    } catch {
      currentCustomer = null;
      display.innerText = "Not found";
      display.className = "customer-tag";
      infoBox.innerHTML =
        '<span style="color:#EF4444;">Not found. <a href="#" onclick="openAddCustomerModal()" style="color:#3B82F6;">Add new?</a></span>';
      updatePointsSection();
    }
  }, 400);
}

// ── ADD CUSTOMER MODAL ──
function openAddCustomerModal() {
  const sdt = document.getElementById("inp-sdt").value;
  document.getElementById("new-cust-sdt").value = sdt;
  document.getElementById("new-cust-name").value = "";
  document.getElementById("modal-add-customer").style.display = "flex";
}

async function saveNewCustomer(e) {
  e.preventDefault();
  const name = document.getElementById("new-cust-name").value.trim();
  const sdt = document.getElementById("new-cust-sdt").value.trim();
  var errors = validateForm([
    { name: "Customer name", value: name, required: true },
    { name: "Phone number", value: sdt, required: true, pattern: /^0\d{9}$/ },
  ]);
  if (errors.length > 0) {
    showToast(errors[0], "error");
    return;
  }

  try {
    // Generate a customer ID
    const existing = await apiGetProducts(); // just to get a count approximation
    const newId = "KH" + String(Date.now()).slice(-4);

    const customer = await apiCreateCustomer({
      MaKH: newId,
      HoTen: name,
      SDT: sdt,
      DiemTichLuy: 0,
      HangThanhVien: "Bronze",
    });

    currentCustomer = customer;
    document.getElementById("customer-display").innerText = customer.HoTen;
    document.getElementById("customer-display").className =
      "customer-tag found";
    document.getElementById("customer-info").innerHTML = `
      <span><b>${customer.HoTen}</b> (${customer.MaKH})</span>
      <span>${customer.HangThanhVien || "Member"} · ${customer.DiemTichLuy} points</span>
    `;
    updatePointsSection();
    closeAllModals();
  } catch (err) {
    showToast("Cannot create customer: " + err.message, "error");
  }
}
