def test_list_products(client, auth_headers):
    resp = client.get("/api/products", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) == 1
    assert resp.json()[0]["MaSP"] == "SP01"


def test_get_product(client, auth_headers):
    resp = client.get("/api/products/SP01", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["TenSP"] == "Apple"


def test_get_product_not_found(client, auth_headers):
    resp = client.get("/api/products/SP99", headers=auth_headers)
    assert resp.status_code == 404


def test_create_product(client, auth_headers):
    resp = client.post(
        "/api/products",
        headers=auth_headers,
        json={
            "MaSP": "SP02",
            "TenSP": "Banana",
            "DonViTinh": "kg",
            "GiaBan": 30000,
            "SoLuongTon": 50,
            "MaNhom": "NH01",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["MaSP"] == "SP02"


def test_create_product_duplicate_id(client, auth_headers):
    resp = client.post(
        "/api/products",
        headers=auth_headers,
        json={
            "MaSP": "SP01",
            "TenSP": "Duplicate",
            "GiaBan": 10000,
            "MaNhom": "NH01",
        },
    )
    assert resp.status_code == 400


def test_create_product_invalid_price(client, auth_headers):
    resp = client.post(
        "/api/products",
        headers=auth_headers,
        json={
            "MaSP": "SP03",
            "TenSP": "Bad Product",
            "GiaBan": -100,
            "MaNhom": "NH01",
        },
    )
    assert resp.status_code == 422


def test_update_product(client, auth_headers):
    resp = client.put(
        "/api/products/SP01",
        headers=auth_headers,
        json={"TenSP": "Green Apple", "GiaBan": 60000},
    )
    assert resp.status_code == 200
    assert resp.json()["TenSP"] == "Green Apple"
    assert resp.json()["GiaBan"] == 60000


def test_delete_product(client, auth_headers):
    resp = client.delete("/api/products/SP01", headers=auth_headers)
    assert resp.status_code == 200

    resp = client.get("/api/products/SP01", headers=auth_headers)
    assert resp.status_code == 404
