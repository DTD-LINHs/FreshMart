"""Test role-based access control enforcement."""


def test_cashier_cannot_create_product(client, cashier_headers):
    resp = client.post("/api/products", headers=cashier_headers, json={
        "MaSP": "SP99", "TenSP": "Test", "DonViTinh": "kg",
        "GiaBan": 10000, "SoLuongTon": 10, "MaNhom": "NH01",
    })
    assert resp.status_code == 403


def test_cashier_cannot_delete_product(client, cashier_headers):
    resp = client.delete("/api/products/SP01", headers=cashier_headers)
    assert resp.status_code == 403


def test_cashier_cannot_create_promotion(client, cashier_headers):
    resp = client.post("/api/promotions", headers=cashier_headers, json={
        "TenKM": "Hack", "NgayBatDau": "2026-01-01", "NgayKetThuc": "2026-12-31",
    })
    assert resp.status_code == 403


def test_cashier_cannot_delete_promotion(client, cashier_headers):
    resp = client.delete("/api/promotions/KM01", headers=cashier_headers)
    assert resp.status_code == 403


def test_cashier_cannot_list_employees(client, cashier_headers):
    resp = client.get("/api/employees", headers=cashier_headers)
    assert resp.status_code == 403


def test_cashier_cannot_create_employee(client, cashier_headers):
    resp = client.post("/api/employees", headers=cashier_headers, json={
        "HoTen": "New Guy", "ChucVu": "Thu ngân",
        "SDT": "0999888777", "password": "123456",
    })
    assert resp.status_code == 403


def test_cashier_can_read_products(client, cashier_headers):
    resp = client.get("/api/products", headers=cashier_headers)
    assert resp.status_code == 200


def test_cashier_can_checkout(client, cashier_headers):
    resp = client.post("/api/invoices", headers=cashier_headers, json={
        "MaNV": "NV02", "MaKH": "KH01", "MaPT": "PT01", "points_used": 0,
        "items": [{"MaSP": "SP01", "SoLuong": 1}],
    })
    assert resp.status_code == 201


def test_cashier_can_view_own_profile(client, cashier_headers):
    resp = client.get("/api/employees/NV02", headers=cashier_headers)
    assert resp.status_code == 200
    assert resp.json()["HoTen"] == "Test Cashier"


def test_cashier_can_update_own_name(client, cashier_headers):
    resp = client.put("/api/employees/NV02", headers=cashier_headers, json={
        "HoTen": "Updated Cashier",
    })
    assert resp.status_code == 200
    assert resp.json()["HoTen"] == "Updated Cashier"


def test_cashier_cannot_change_own_role(client, cashier_headers):
    resp = client.put("/api/employees/NV02", headers=cashier_headers, json={
        "ChucVu": "Quản lý",
    })
    assert resp.status_code == 403


def test_cashier_cannot_update_other_employee(client, cashier_headers):
    resp = client.put("/api/employees/NV01", headers=cashier_headers, json={
        "HoTen": "Hacked",
    })
    assert resp.status_code == 403


def test_manager_can_create_employee(client, auth_headers):
    resp = client.post("/api/employees", headers=auth_headers, json={
        "HoTen": "New Employee", "ChucVu": "Kho",
        "SDT": "0999888777", "password": "123456",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["MaNV"] == "NV03"
    assert data["ChucVu"] == "Kho"


def test_manager_can_reset_password(client, auth_headers):
    resp = client.post("/api/employees/NV02/reset-password", headers=auth_headers)
    assert resp.status_code == 200
    assert "default_password" in resp.json()


def test_manager_can_change_employee_role(client, auth_headers):
    resp = client.put("/api/employees/NV02", headers=auth_headers, json={
        "ChucVu": "Kho",
    })
    assert resp.status_code == 200
    assert resp.json()["ChucVu"] == "Kho"
