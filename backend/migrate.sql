-- FreshMart DB Migrations
-- Run against QuanLyBanHang database

-- 1. Add password field to NHANVIEN
ALTER TABLE NHANVIEN ADD COLUMN MatKhau VARCHAR(255);

-- 2. Add image field to SANPHAM
ALTER TABLE SANPHAM ADD COLUMN HinhAnh VARCHAR(500);
