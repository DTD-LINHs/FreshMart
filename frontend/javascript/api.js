// ============================================
// FreshMart API Client
// Replaces mock-data.js with real backend calls
// ============================================

const API_BASE = 'http://127.0.0.1:8000/api';

// --- Currency Formatter ---
function fmtVND(amount) {
  return Math.round(amount).toLocaleString('vi-VN') + '₫';
}

// --- Toast Notification ---
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = { success: '#22C55E', error: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
  const icons = { success: '\u2714', error: '\u2716', warning: '\u26A0', info: '\u2139' };
  toast.style.cssText = 'display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:12px;background:white;box-shadow:0 4px 20px rgba(0,0,0,0.15);font-family:Nunito,sans-serif;font-size:14px;font-weight:600;color:#333;min-width:280px;max-width:400px;animation:toastIn .3s ease;border-left:4px solid ' + (colors[type] || colors.info) + ';';
  toast.innerHTML = '<span style="font-size:18px;color:' + (colors[type] || colors.info) + ';">' + (icons[type] || icons.info) + '</span><span style="flex:1;">' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.transition = 'opacity .3s, transform .3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function validateForm(rules) {
  var errors = [];
  for (var i = 0; i < rules.length; i++) {
    var r = rules[i];
    var val = r.value;
    if (r.required && (val === '' || val === null || val === undefined)) {
      errors.push(r.name + ' không được để trống');
    } else if (r.min !== undefined && Number(val) < r.min) {
      errors.push(r.name + ' phải >= ' + r.min);
    } else if (r.gt !== undefined && Number(val) <= r.gt) {
      errors.push(r.name + ' phải > ' + r.gt);
    } else if (r.pattern && val && !r.pattern.test(val)) {
      errors.push(r.name + ' không đúng định dạng');
    } else if (r.maxLength && val && val.length > r.maxLength) {
      errors.push(r.name + ' tối đa ' + r.maxLength + ' ký tự');
    }
  }
  return errors;
}

async function api(endpoint, options = {}) {
  const url = API_BASE + endpoint;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  var res;
  try {
    res = await fetch(url, config);
  } catch (e) {
    showToast('Không thể kết nối server', 'error');
    throw new Error('Network error');
  }
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInEmployee');
    var isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) {
      window.location.href = window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
    }
    throw new Error('Phiên đăng nhập hết hạn');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'API error');
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Auth ---
async function apiLogin(MaNV, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ MaNV, password }),
  });
}

// --- Categories ---
async function apiGetCategories() {
  return api('/categories');
}

// --- Products ---
async function apiGetProducts(category, search) {
  let params = [];
  if (category) params.push('category=' + encodeURIComponent(category));
  if (search) params.push('search=' + encodeURIComponent(search));
  const qs = params.length ? '?' + params.join('&') : '';
  return api('/products' + qs);
}

async function apiGetProduct(MaSP) {
  return api('/products/' + encodeURIComponent(MaSP));
}

async function apiCreateProduct(data) {
  return api('/products', { method: 'POST', body: JSON.stringify(data) });
}

async function apiUpdateProduct(MaSP, data) {
  return api('/products/' + encodeURIComponent(MaSP), { method: 'PUT', body: JSON.stringify(data) });
}

async function apiDeleteProduct(MaSP) {
  return api('/products/' + encodeURIComponent(MaSP), { method: 'DELETE' });
}

async function apiUploadProductImage(MaSP, file) {
  const formData = new FormData();
  formData.append('file', file);
  const url = API_BASE + '/products/' + encodeURIComponent(MaSP) + '/upload-image';
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

async function apiGetProductDiscount(MaSP) {
  return api('/products/' + encodeURIComponent(MaSP) + '/discount');
}

// --- Customers ---
async function apiGetCustomerByPhone(SDT) {
  return api('/customers/phone/' + encodeURIComponent(SDT));
}

async function apiGetCustomer(MaKH) {
  return api('/customers/' + encodeURIComponent(MaKH));
}

async function apiCreateCustomer(data) {
  return api('/customers', { method: 'POST', body: JSON.stringify(data) });
}

// --- Payment Methods ---
async function apiGetPaymentMethods() {
  return api('/payment-methods');
}

// --- Invoices ---
async function apiGetInvoices() {
  return api('/invoices');
}

async function apiGetInvoice(MaHD) {
  return api('/invoices/' + encodeURIComponent(MaHD));
}

async function apiCheckout(data) {
  return api('/invoices', { method: 'POST', body: JSON.stringify(data) });
}

// --- Employees ---
async function apiGetEmployee(MaNV) {
  return api('/employees/' + encodeURIComponent(MaNV));
}

async function apiUpdateEmployee(MaNV, data) {
  return api('/employees/' + encodeURIComponent(MaNV), { method: 'PUT', body: JSON.stringify(data) });
}

// --- Promotions ---
async function apiGetActivePromotions() {
  return api('/promotions/active');
}

// --- Notifications ---
async function apiGetNotifications() {
  return api('/notifications');
}
