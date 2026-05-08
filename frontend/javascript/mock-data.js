// ============================================
// MOCK DATA - Matches DB Schema (QuanLyBanHang)
// Replace with API calls when backend is ready
// ============================================

// --- NHOMHANG (Category) ---
const MOCK_NHOMHANG = [
  { MaNhom: 'NH01', TenNhom: 'Trái cây', GhiChu: 'Các loại trái cây tươi' },
  { MaNhom: 'NH02', TenNhom: 'Rau củ', GhiChu: 'Rau củ quả tươi sạch' },
  { MaNhom: 'NH03', TenNhom: 'Thịt tươi sống', GhiChu: 'Thịt bò, heo, gà' },
  { MaNhom: 'NH04', TenNhom: 'Sữa & sản phẩm từ sữa', GhiChu: 'Sữa tươi, sữa chua' },
  { MaNhom: 'NH05', TenNhom: 'Đồ uống', GhiChu: 'Nước ngọt, nước ép' },
  { MaNhom: 'NH06', TenNhom: 'Thực phẩm chế biến', GhiChu: 'Đồ hộp, mì gói' },
  { MaNhom: 'NH07', TenNhom: 'Hóa mỹ phẩm', GhiChu: 'Dầu gội, sữa tắm' },
  { MaNhom: 'NH08', TenNhom: 'Gia vị', GhiChu: 'Muối, đường, nước mắm' },
];

// --- NHANVIEN (Employee) ---
const MOCK_NHANVIEN = [
  { MaNV: 'NV01', HoTen: 'Nguyễn Văn An', ChucVu: 'Quản lý', SDT: '0901000001', NgayVaoLam: '2022-06-01' },
  { MaNV: 'NV02', HoTen: 'Trần Thị Bình', ChucVu: 'Thu ngân', SDT: '0901000002', NgayVaoLam: '2023-01-15' },
  { MaNV: 'NV03', HoTen: 'Lê Hoàng Cường', ChucVu: 'Bán hàng', SDT: '0901000003', NgayVaoLam: '2023-03-20' },
  { MaNV: 'NV04', HoTen: 'Phạm Minh Đức', ChucVu: 'Kho', SDT: '0901000004', NgayVaoLam: '2023-07-10' },
  { MaNV: 'NV05', HoTen: 'Hoàng Thị Em', ChucVu: 'Thu ngân', SDT: '0901000005', NgayVaoLam: '2024-02-01' },
];

// Current logged-in employee (simulated session)
const CURRENT_EMPLOYEE = MOCK_NHANVIEN[1]; // Trần Thị Bình - Thu ngân

// --- SANPHAM (Product) ---
// image field is for UI only, not in DB
const MOCK_SANPHAM = [
  { MaSP: 'SP01', TenSP: 'Fresh Apples', DonViTinh: 'kg', GiaBan: 3.00, SoLuongTon: 50, HSD: '2026-06-01', MaNhom: 'NH01', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop' },
  { MaSP: 'SP02', TenSP: 'Vegetable Mix', DonViTinh: 'kg', GiaBan: 2.50, SoLuongTon: 40, HSD: '2026-05-15', MaNhom: 'NH02', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' },
  { MaSP: 'SP03', TenSP: 'Beef Steak', DonViTinh: 'kg', GiaBan: 12.00, SoLuongTon: 30, HSD: '2025-12-01', MaNhom: 'NH03', image: 'https://images.unsplash.com/photo-1695683948382-868cd8d516fe?w=400&h=300&fit=crop' },
  { MaSP: 'SP04', TenSP: 'Fresh Milk', DonViTinh: 'Hộp', GiaBan: 1.20, SoLuongTon: 100, HSD: '2026-03-01', MaNhom: 'NH04', image: 'https://plus.unsplash.com/premium_photo-1694481099872-29a6ece2672c?w=400&h=300&fit=crop' },
  { MaSP: 'SP05', TenSP: 'Orange Juice', DonViTinh: 'Chai', GiaBan: 2.00, SoLuongTon: 60, HSD: '2026-08-01', MaNhom: 'NH05', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
  { MaSP: 'SP06', TenSP: 'Tomatoes', DonViTinh: 'kg', GiaBan: 1.80, SoLuongTon: 45, HSD: '2026-05-20', MaNhom: 'NH02', image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?w=400&h=300&fit=crop' },
  { MaSP: 'SP07', TenSP: 'Strawberries', DonViTinh: 'kg', GiaBan: 5.00, SoLuongTon: 35, HSD: '2026-04-10', MaNhom: 'NH01', image: 'https://plus.unsplash.com/premium_photo-1689344314069-b60bf06d564c?w=400&h=300&fit=crop' },
  { MaSP: 'SP08', TenSP: 'CocaCola', DonViTinh: 'Lon', GiaBan: 1.00, SoLuongTon: 200, HSD: '2027-01-01', MaNhom: 'NH05', image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400&h=300&fit=crop' },
  { MaSP: 'SP09', TenSP: 'Potatoes', DonViTinh: 'kg', GiaBan: 1.50, SoLuongTon: 80, HSD: '2026-07-01', MaNhom: 'NH02', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop' },
  { MaSP: 'SP10', TenSP: 'Carrots', DonViTinh: 'kg', GiaBan: 1.20, SoLuongTon: 70, HSD: '2026-06-15', MaNhom: 'NH02', image: 'https://images.unsplash.com/photo-1633380110125-f6e685676160?w=400&h=300&fit=crop' },
  { MaSP: 'SP11', TenSP: 'Mung Bean Sprouts', DonViTinh: 'kg', GiaBan: 0.80, SoLuongTon: 50, HSD: '2026-05-10', MaNhom: 'NH02', image: 'https://images.unsplash.com/photo-1645762854600-42d298660501?w=400&h=300&fit=crop' },
  { MaSP: 'SP12', TenSP: 'Chicken Breast', DonViTinh: 'kg', GiaBan: 6.50, SoLuongTon: 25, HSD: '2025-11-30', MaNhom: 'NH03', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=400&h=300&fit=crop' },
];

// --- KHACHHANG (Customer) ---
const MOCK_KHACHHANG = [
  { MaKH: 'KH01', HoTen: 'Lê Văn Cường', SDT: '0912345678', DiemTichLuy: 350, HangThanhVien: 'Vàng' },
  { MaKH: 'KH02', HoTen: 'Nguyễn Thị Dung', SDT: '0912345679', DiemTichLuy: 120, HangThanhVien: 'Bạc' },
  { MaKH: 'KH03', HoTen: 'Phạm Quốc Em', SDT: '0912345680', DiemTichLuy: 50, HangThanhVien: 'Đồng' },
  { MaKH: 'KH04', HoTen: 'Trần Minh Phúc', SDT: '0912345681', DiemTichLuy: 500, HangThanhVien: 'Kim cương' },
  { MaKH: 'KH05', HoTen: 'Hoàng Lan', SDT: '0912345682', DiemTichLuy: 0, HangThanhVien: 'Đồng' },
];

// --- PHUONGTHUCTT (Payment Method) ---
const MOCK_PHUONGTHUCTT = [
  { MaPT: 'PT01', TenPT: 'Tiền mặt', MoTa: 'Thanh toán bằng tiền mặt tại quầy' },
  { MaPT: 'PT02', TenPT: 'Chuyển khoản', MoTa: 'Chuyển khoản ngân hàng' },
  { MaPT: 'PT03', TenPT: 'Ví điện tử', MoTa: 'Momo, VNPay, ZaloPay' },
  { MaPT: 'PT04', TenPT: 'Quẹt thẻ', MoTa: 'Thẻ Visa, Mastercard' },
];

// --- KHUYENMAI (Promotion) ---
const MOCK_KHUYENMAI = [
  { MaKM: 'KM01', TenKM: 'Giảm giá mùa hè', NgayBatDau: '2026-05-01', NgayKetThuc: '2026-06-30' },
  { MaKM: 'KM02', TenKM: 'Flash Sale cuối tuần', NgayBatDau: '2026-05-08', NgayKetThuc: '2026-05-10' },
];

// --- AP_DUNG_KM (Promotion Application) ---
const MOCK_AP_DUNG_KM = [
  { MaKM: 'KM01', MaSP: 'SP01', MucGiam: 0.50 },
  { MaKM: 'KM01', MaSP: 'SP05', MucGiam: 0.30 },
  { MaKM: 'KM02', MaSP: 'SP03', MucGiam: 2.00 },
];

// --- NHACUNGCAP (Supplier) ---
const MOCK_NHACUNGCAP = [
  { MaNCC: 'NCC01', TenNCC: 'Công ty TNHH Thực phẩm Sạch', DiaChi: '123 Lê Lợi, Q1, TP.HCM', SDT: '0281234567', Email: 'thucphamsach@email.com' },
  { MaNCC: 'NCC02', TenNCC: 'Nông trại Đà Lạt Xanh', DiaChi: '456 Trần Phú, Đà Lạt', SDT: '0631234567', Email: 'dalatxanh@email.com' },
  { MaNCC: 'NCC03', TenNCC: 'Công ty CP Đồ uống Việt', DiaChi: '789 Nguyễn Huệ, Q1, TP.HCM', SDT: '0281234999', Email: 'douongviet@email.com' },
];

// --- HOADON (Invoice) - mock past invoices ---
const MOCK_HOADON = [
  { MaHD: 'HD01', NgayLap: '2026-05-07', TongTien: 23.10, MaNV: 'NV02', MaKH: 'KH01', MaPT: 'PT01' },
  { MaHD: 'HD02', NgayLap: '2026-05-07', TongTien: 45.60, MaNV: 'NV02', MaKH: 'KH02', MaPT: 'PT03' },
  { MaHD: 'HD03', NgayLap: '2026-05-06', TongTien: 18.70, MaNV: 'NV03', MaKH: 'KH04', MaPT: 'PT01' },
  { MaHD: 'HD04', NgayLap: '2026-05-06', TongTien: 67.20, MaNV: 'NV05', MaKH: 'KH01', MaPT: 'PT02' },
  { MaHD: 'HD05', NgayLap: '2026-05-05', TongTien: 32.50, MaNV: 'NV02', MaKH: 'KH03', MaPT: 'PT04' },
];

// --- CHITIETHOADON (Invoice Detail) ---
const MOCK_CHITIETHOADON = [
  { MaHD: 'HD01', MaSP: 'SP01', SoLuong: 2, DonGia: 3.00 },
  { MaHD: 'HD01', MaSP: 'SP04', SoLuong: 3, DonGia: 1.20 },
  { MaHD: 'HD01', MaSP: 'SP05', SoLuong: 2, DonGia: 2.00 },
  { MaHD: 'HD02', MaSP: 'SP03', SoLuong: 2, DonGia: 12.00 },
  { MaHD: 'HD02', MaSP: 'SP06', SoLuong: 3, DonGia: 1.80 },
  { MaHD: 'HD03', MaSP: 'SP02', SoLuong: 2, DonGia: 2.50 },
  { MaHD: 'HD03', MaSP: 'SP08', SoLuong: 5, DonGia: 1.00 },
  { MaHD: 'HD04', MaSP: 'SP03', SoLuong: 3, DonGia: 12.00 },
  { MaHD: 'HD04', MaSP: 'SP07', SoLuong: 2, DonGia: 5.00 },
  { MaHD: 'HD04', MaSP: 'SP04', SoLuong: 5, DonGia: 1.20 },
  { MaHD: 'HD05', MaSP: 'SP09', SoLuong: 3, DonGia: 1.50 },
  { MaHD: 'HD05', MaSP: 'SP10', SoLuong: 4, DonGia: 1.20 },
  { MaHD: 'HD05', MaSP: 'SP05', SoLuong: 5, DonGia: 2.00 },
];

// --- LICHSUDIEM (Point History) ---
const MOCK_LICHSUDIEM = [
  { MaGD: 1, MaKH: 'KH01', NgayGD: '2026-05-07', SoDiemThayDoi: 2 },
  { MaGD: 2, MaKH: 'KH02', NgayGD: '2026-05-07', SoDiemThayDoi: 4 },
  { MaGD: 3, MaKH: 'KH04', NgayGD: '2026-05-06', SoDiemThayDoi: 1 },
  { MaGD: 4, MaKH: 'KH01', NgayGD: '2026-05-06', SoDiemThayDoi: 6 },
  { MaGD: 5, MaKH: 'KH03', NgayGD: '2026-05-05', SoDiemThayDoi: 3 },
];

// --- Helper functions ---
function getProductById(maSP) {
  return MOCK_SANPHAM.find(p => p.MaSP === maSP);
}

function getCustomerById(maKH) {
  return MOCK_KHACHHANG.find(c => c.MaKH === maKH);
}

function getCustomerByPhone(sdt) {
  return MOCK_KHACHHANG.find(c => c.SDT === sdt);
}

function getEmployeeById(maNV) {
  return MOCK_NHANVIEN.find(e => e.MaNV === maNV);
}

function getCategoryById(maNhom) {
  return MOCK_NHOMHANG.find(n => n.MaNhom === maNhom);
}

function getPaymentById(maPT) {
  return MOCK_PHUONGTHUCTT.find(p => p.MaPT === maPT);
}

function getInvoiceDetails(maHD) {
  return MOCK_CHITIETHOADON.filter(ct => ct.MaHD === maHD);
}

function generateId(prefix, list, idField) {
  const nums = list.map(item => parseInt(item[idField].replace(prefix, '')));
  const next = Math.max(...nums) + 1;
  return prefix + String(next).padStart(2, '0');
}

// Get active discount for a product (checks KHUYENMAI dates + AP_DUNG_KM)
function getProductDiscount(maSP) {
  const today = new Date().toISOString().split('T')[0];
  for (const ap of MOCK_AP_DUNG_KM) {
    if (ap.MaSP === maSP) {
      const km = MOCK_KHUYENMAI.find(k => k.MaKM === ap.MaKM);
      if (km && km.NgayBatDau <= today && today <= km.NgayKetThuc) {
        return { MucGiam: ap.MucGiam, TenKM: km.TenKM, MaKM: km.MaKM };
      }
    }
  }
  return null;
}

// Get all currently active promotions
function getActivePromotions() {
  const today = new Date().toISOString().split('T')[0];
  return MOCK_KHUYENMAI.filter(km => km.NgayBatDau <= today && today <= km.NgayKetThuc);
}

// Deduct stock after a sale
function deductStock(cartItems) {
  cartItems.forEach(item => {
    const product = MOCK_SANPHAM.find(p => p.MaSP === item.MaSP);
    if (product) {
      product.SoLuongTon = Math.max(0, product.SoLuongTon - item.quantity);
    }
  });
}
