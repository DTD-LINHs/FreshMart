def test_checkout_success(client, auth_headers):
    resp = client.post(
        "/api/invoices",
        headers=auth_headers,
        json={
            "MaNV": "NV01",
            "MaKH": "KH01",
            "MaPT": "PT01",
            "items": [{"MaSP": "SP01", "SoLuong": 2}],
            "points_used": 0,
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["MaHD"].startswith("HD")
    assert data["subtotal"] == 100000
    assert data["total"] > 0


def test_checkout_insufficient_stock(client, auth_headers):
    resp = client.post(
        "/api/invoices",
        headers=auth_headers,
        json={
            "MaNV": "NV01",
            "MaKH": "KH01",
            "MaPT": "PT01",
            "items": [{"MaSP": "SP01", "SoLuong": 999}],
            "points_used": 0,
        },
    )
    assert resp.status_code == 400
    assert "Insufficient stock" in resp.json()["detail"]


def test_checkout_invalid_customer(client, auth_headers):
    resp = client.post(
        "/api/invoices",
        headers=auth_headers,
        json={
            "MaNV": "NV01",
            "MaKH": "KH99",
            "MaPT": "PT01",
            "items": [{"MaSP": "SP01", "SoLuong": 1}],
            "points_used": 0,
        },
    )
    assert resp.status_code == 400
    assert "Customer not found" in resp.json()["detail"]


def test_checkout_empty_items(client, auth_headers):
    resp = client.post(
        "/api/invoices",
        headers=auth_headers,
        json={
            "MaNV": "NV01",
            "MaKH": "KH01",
            "MaPT": "PT01",
            "items": [],
            "points_used": 0,
        },
    )
    assert resp.status_code == 422


def test_checkout_points_exceeding_balance(client, auth_headers):
    resp = client.post(
        "/api/invoices",
        headers=auth_headers,
        json={
            "MaNV": "NV01",
            "MaKH": "KH01",
            "MaPT": "PT01",
            "items": [{"MaSP": "SP01", "SoLuong": 1}],
            "points_used": 99999,
        },
    )
    assert resp.status_code == 400
    assert "Not enough points" in resp.json()["detail"]
