// ============================================
// FreshMart API Client
// Replaces mock-data.js with real backend calls
// ============================================

const API_BASE = "http://127.0.0.1:8000/api";

// --- Currency Formatter ---
function fmtVND(amount) {
  return Math.round(amount).toLocaleString("vi-VN") + "₫";
}

// --- Toast Notification ---
function showToast(message, type = "info", title = "") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
  };
  const titles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
  };
  const toast = document.createElement("div");
  toast.className = "toast " + (type || "info");
  toast.innerHTML =
    '<div class="toast-icon"><i class="fa-solid ' + (icons[type] || icons.info) + '"></i></div>' +
    '<div class="toast-body"><div class="toast-title">' + (title || titles[type] || titles.info) + '</div>' +
    '<div class="toast-msg">' + message + '</div></div>' +
    '<button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add("fade-out");
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}

function validateForm(rules) {
  var errors = [];
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    var val = r.value;
    if (r.required && (val === "" || val === null || val === undefined)) {
      errors.push(r.name + " is required");
    } else if (r.min !== undefined && Number(val) < r.min) {
      errors.push(r.name + " must be >= " + r.min);
    } else if (r.gt !== undefined && Number(val) <= r.gt) {
      errors.push(r.name + " must be > " + r.gt);
    } else if (r.pattern && val && !r.pattern.test(val)) {
      errors.push(r.name + " has invalid format");
    } else if (r.maxLength && val && val.length > r.maxLength) {
      errors.push(r.name + " max " + r.maxLength + " characters");
    }
  }
  return errors;
}

async function api(endpoint, options = {}) {
  const url = API_BASE + endpoint;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  var res;
  try {
    res = await fetch(url, config);
  } catch (e) {
    showToast("Cannot connect to server", "error");
    throw new Error("Network error");
  }
  if (res.status === 401) {
    var isLoginPage = window.location.pathname.includes("login.html");
    if (isLoginPage) {
      var errBody = await res.json().catch(function () { return { detail: "Invalid credentials" }; });
      throw new Error(errBody.detail || "Invalid credentials");
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInEmployee");
    window.location.href = window.location.pathname.includes("/pages/")
      ? "../login.html"
      : "login.html";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Auth ---
async function apiLogin(MaNV, password) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ MaNV, password }),
  });
}

// --- Categories ---
async function apiGetCategories() {
  return api("/categories");
}

// --- Products ---
async function apiGetProducts(category, search) {
  let params = [];
  if (category) params.push("category=" + encodeURIComponent(category));
  if (search) params.push("search=" + encodeURIComponent(search));
  const qs = params.length ? "?" + params.join("&") : "";
  return api("/products" + qs);
}

async function apiGetProduct(MaSP) {
  return api("/products/" + encodeURIComponent(MaSP));
}

async function apiCreateProduct(data) {
  return api("/products", { method: "POST", body: JSON.stringify(data) });
}

async function apiUpdateProduct(MaSP, data) {
  return api("/products/" + encodeURIComponent(MaSP), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function apiDeleteProduct(MaSP) {
  return api("/products/" + encodeURIComponent(MaSP), { method: "DELETE" });
}

async function apiUploadProductImage(MaSP, file) {
  const formData = new FormData();
  formData.append("file", file);
  const url =
    API_BASE + "/products/" + encodeURIComponent(MaSP) + "/upload-image";
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

async function apiGetProductDiscount(MaSP) {
  return api("/products/" + encodeURIComponent(MaSP) + "/discount");
}

// --- Customers ---
async function apiGetCustomerByPhone(SDT) {
  return api("/customers/phone/" + encodeURIComponent(SDT));
}

async function apiGetCustomer(MaKH) {
  return api("/customers/" + encodeURIComponent(MaKH));
}

async function apiCreateCustomer(data) {
  return api("/customers", { method: "POST", body: JSON.stringify(data) });
}

// --- Payment Methods ---
async function apiGetPaymentMethods() {
  return api("/payment-methods");
}

// --- Invoices ---
async function apiGetInvoices() {
  return api("/invoices");
}

async function apiGetInvoice(MaHD) {
  return api("/invoices/" + encodeURIComponent(MaHD));
}

async function apiCheckout(data) {
  return api("/invoices", { method: "POST", body: JSON.stringify(data) });
}

// --- Employees ---
async function apiGetEmployees() {
  return api("/employees");
}

async function apiGetEmployee(MaNV) {
  return api("/employees/" + encodeURIComponent(MaNV));
}

async function apiCreateEmployee(data) {
  return api("/employees", { method: "POST", body: JSON.stringify(data) });
}

async function apiUpdateEmployee(MaNV, data) {
  return api("/employees/" + encodeURIComponent(MaNV), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function apiResetPassword(MaNV) {
  return api("/employees/" + encodeURIComponent(MaNV) + "/reset-password", {
    method: "POST",
  });
}

async function apiChangePassword(currentPassword, newPassword) {
  return api("/employees/me/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// --- Promotions ---
async function apiGetActivePromotions() {
  return api("/promotions/active");
}

async function apiGetAllPromotions() {
  return api("/promotions");
}

async function apiCreatePromotion(data) {
  return api("/promotions", { method: "POST", body: JSON.stringify(data) });
}

async function apiUpdatePromotion(MaKM, data) {
  return api("/promotions/" + encodeURIComponent(MaKM), {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function apiDeletePromotion(MaKM) {
  return api("/promotions/" + encodeURIComponent(MaKM), { method: "DELETE" });
}

async function apiAddProductToPromo(MaKM, data) {
  return api("/promotions/" + encodeURIComponent(MaKM) + "/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function apiRemoveProductFromPromo(MaKM, MaSP) {
  return api(
    "/promotions/" +
      encodeURIComponent(MaKM) +
      "/products/" +
      encodeURIComponent(MaSP),
    { method: "DELETE" },
  );
}

// --- Audit Log ---
async function apiGetAuditLog(targetType, targetId) {
  var params = [];
  if (targetType) params.push("target_type=" + encodeURIComponent(targetType));
  if (targetId) params.push("target_id=" + encodeURIComponent(targetId));
  var qs = params.length ? "?" + params.join("&") : "";
  return api("/audit-log" + qs);
}

// --- Notifications ---
async function apiGetNotifications() {
  return api("/notifications");
}
