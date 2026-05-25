def test_list_all_promotions(client, auth_headers, seed_data):
    resp = client.get("/api/promotions", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["MaKM"] == "KM01"
    assert len(data[0]["products"]) == 1


def test_list_active_promotions(client, auth_headers, seed_data):
    resp = client.get("/api/promotions/active", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["TenKM"] == "Summer Sale"


def test_create_promotion(client, auth_headers, seed_data):
    resp = client.post("/api/promotions", headers=auth_headers, json={
        "TenKM": "Winter Sale",
        "NgayBatDau": "2026-11-01",
        "NgayKetThuc": "2026-12-31",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["MaKM"] == "KM02"
    assert data["TenKM"] == "Winter Sale"
    assert data["products"] == []


def test_create_promotion_invalid_dates(client, auth_headers, seed_data):
    resp = client.post("/api/promotions", headers=auth_headers, json={
        "TenKM": "Bad Promo",
        "NgayBatDau": "2026-12-31",
        "NgayKetThuc": "2026-01-01",
    })
    assert resp.status_code == 400


def test_update_promotion(client, auth_headers, seed_data):
    resp = client.put("/api/promotions/KM01", headers=auth_headers, json={
        "TenKM": "Updated Sale",
    })
    assert resp.status_code == 200
    assert resp.json()["TenKM"] == "Updated Sale"


def test_delete_promotion(client, auth_headers, seed_data):
    resp = client.delete("/api/promotions/KM01", headers=auth_headers)
    assert resp.status_code == 200

    resp = client.get("/api/promotions", headers=auth_headers)
    assert len(resp.json()) == 0


def test_add_product_to_promotion(client, auth_headers, seed_data, db):
    from backend.models.sanpham import SanPham
    from datetime import date
    sp2 = SanPham(MaSP="SP02", TenSP="Banana", DonViTinh="kg",
                  GiaBan=30000, SoLuongTon=50, HSD=date(2026, 12, 31), MaNhom="NH01")
    db.add(sp2)
    db.commit()

    resp = client.post("/api/promotions/KM01/products", headers=auth_headers, json={
        "MaSP": "SP02", "MucGiam": 3000,
    })
    assert resp.status_code == 201

    resp = client.get("/api/promotions", headers=auth_headers)
    promo = resp.json()[0]
    assert len(promo["products"]) == 2


def test_remove_product_from_promotion(client, auth_headers, seed_data):
    resp = client.delete("/api/promotions/KM01/products/SP01", headers=auth_headers)
    assert resp.status_code == 200

    resp = client.get("/api/promotions", headers=auth_headers)
    promo = resp.json()[0]
    assert len(promo["products"]) == 0


def test_duplicate_product_in_promotion(client, auth_headers, seed_data):
    resp = client.post("/api/promotions/KM01/products", headers=auth_headers, json={
        "MaSP": "SP01", "MucGiam": 2000,
    })
    assert resp.status_code == 400
