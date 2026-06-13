// ============================================
// FreshMart API Client
// Replaces mock-data.js with real backend calls
// ============================================

const API_BASE = "http://127.0.0.1:8000/api";

// Ảnh mặc định theo mã SP (dùng khi DB chưa có HinhAnh hoặc file local lỗi).
// Muốn đổi ảnh mặc định: sửa URL tại đây theo MaSP tương ứng.
const PRODUCT_IMAGE_DEFAULTS = {
  SP01: "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400&h=300&fit=crop",
  SP02: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
  SP03: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
  SP04: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop",
  SP05: "https://images.unsplash.com/photo-1612929631298-494d332d6471?w=400&h=300&fit=crop",
  SP06: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
  SP07: "https://images.unsplash.com/photo-1497935586761-b94b596bf397?w=400&h=300&fit=crop",
  SP08: "https://images.unsplash.com/photo-1612929631298-494d332d6471?w=400&h=300&fit=crop",
  SP09: "https://images.unsplash.com/photo-1548839140-5a941f221e92?w=400&h=300&fit=crop",
  SP10: "https://images.unsplash.com/photo-1581441363687-9008fa6f5d45?w=400&h=300&fit=crop",
  SP11: "https://images.unsplash.com/photo-1606920805794-34b1e6b3e3a0?w=400&h=300&fit=crop",
  SP12: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
  SP13: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
  SP14: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
  SP15: "https://images.unsplash.com/photo-1612929631298-494d332d6471?w=400&h=300&fit=crop",
  SP16: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop",
  SP17: "https://images.unsplash.com/photo-1583485088034-697b5fe4190f?w=400&h=300&fit=crop",
  SP18: "https://images.unsplash.com/photo-1527799820374-dcf8d9a5ae48?w=400&h=300&fit=crop",
  SP19: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop",
  SP20: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop",
  SP21: "https://images.unsplash.com/photo-1645762854600-42d298660501?w=400&h=300&fit=crop",
};

function _productImagePlaceholder(label, width, height) {
  const text = String(label || "No image").slice(0, 24);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    width +
    '" height="' +
    height +
    '" viewBox="0 0 ' +
    width +
    " " +
    height +
    '"><rect fill="#f3f4f6" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Nunito,sans-serif" font-size="14">' +
    text +
    "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// --- Product image URL (DB path, default map, or placeholder) ---
function productImageUrl(hinhAnh, fallbackLabel, width, height, maSP) {
  width = width || 400;
  height = height || 300;
  if (hinhAnh) {
    if (/^https?:\/\//i.test(hinhAnh) || hinhAnh.startsWith("data:")) {
      return hinhAnh;
    }
    const inPages = window.location.pathname.includes("/pages/");
    const prefix = inPages ? "../" : "./";
    const path = hinhAnh.replace(/^\.\//, "").replace(/^\//, "");
    return prefix + path;
  }
  if (maSP && PRODUCT_IMAGE_DEFAULTS[maSP]) {
    return PRODUCT_IMAGE_DEFAULTS[maSP];
  }
  if (!fallbackLabel) return "";
  return _productImagePlaceholder(fallbackLabel, width, height);
}

function productImageFallback(maSP, fallbackLabel, width, height) {
  return (
    "this.onerror=null;this.src='" +
    productImageUrl(null, fallbackLabel, width, height, maSP).replace(/'/g, "\\'") +
    "';"
  );
}

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
  if (res.status === 403) {
    const err = await res.json().catch(() => ({ detail: "Permission denied" }));
    const msg = err.detail || "Permission denied";
    if (msg === "Permission denied") {
      throw new Error(
        "Bạn không có quyền thực hiện thao tác này. Chỉ tài khoản Quản lý hoặc Kho mới được sửa sản phẩm.",
      );
    }
    throw new Error(msg);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  if (res.status === 204) return null;
  return res.json();
}

const PRODUCT_MANAGER_ROLES = ["Quản lý", "Kho"];

function getLoggedInEmployee() {
  try {
    return JSON.parse(localStorage.getItem("loggedInEmployee") || "{}");
  } catch {
    return {};
  }
}

function canManageProducts() {
  return PRODUCT_MANAGER_ROLES.includes(getLoggedInEmployee().ChucVu);
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
  const headers = {};
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  let res;
  try {
    res = await fetch(url, { method: "POST", body: formData, headers });
  } catch (e) {
    showToast("Cannot connect to server", "error");
    throw new Error("Network error");
  }
  if (res.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInEmployee");
    window.location.href = window.location.pathname.includes("/pages/")
      ? "../login.html"
      : "login.html";
    throw new Error("Session expired");
  }
  if (res.status === 403) {
    const err = await res.json().catch(() => ({ detail: "Permission denied" }));
    const msg = err.detail || "Permission denied";
    if (msg === "Not authenticated" || msg === "Permission denied") {
      throw new Error(
        msg === "Not authenticated"
          ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          : "Bạn không có quyền upload ảnh sản phẩm.",
      );
    }
    throw new Error(msg);
  }
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
