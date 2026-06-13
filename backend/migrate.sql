-- FreshMart DB Migrations
-- Run against QuanLyBanHang database

-- 1. Add password field to NHANVIEN
ALTER TABLE NHANVIEN ADD COLUMN MatKhau VARCHAR(255);

-- 2. Add image field to SANPHAM
ALTER TABLE SANPHAM ADD COLUMN HinhAnh VARCHAR(500);

-- 3. Link existing product images (run after images are in frontend/assets/products/)
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP01_f2cbf608.jfif' WHERE MaSP = 'SP01' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP02_0306492e.jfif' WHERE MaSP = 'SP02' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP03_04465625.webp' WHERE MaSP = 'SP03' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP04_b5009f5d.jfif' WHERE MaSP = 'SP04' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP05_75827867.jfif' WHERE MaSP = 'SP05' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP06_1d64caab.jfif' WHERE MaSP = 'SP06' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP07_6bc6212e.jfif' WHERE MaSP = 'SP07' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP08_90b4480e.jfif' WHERE MaSP = 'SP08' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP09_5b7bf923.jfif' WHERE MaSP = 'SP09' AND HinhAnh IS NULL;
UPDATE SANPHAM SET HinhAnh = 'assets/products/SP10_6497c9fb.jfif' WHERE MaSP = 'SP10' AND HinhAnh IS NULL;

-- 4. Fix LICHSUDIEM auto-increment for checkout (points history)
ALTER TABLE LICHSUDIEM MODIFY MaGD INT NOT NULL AUTO_INCREMENT;
