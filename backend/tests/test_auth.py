def test_login_success(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV01", "password": "password123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["employee"]["MaNV"] == "NV01"


def test_login_wrong_password(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV01", "password": "wrong"})
    assert resp.status_code == 401


def test_login_nonexistent_employee(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "NV99", "password": "password123"})
    assert resp.status_code == 401


def test_login_empty_fields(client, seed_data):
    resp = client.post("/api/auth/login", json={"MaNV": "", "password": "pass"})
    assert resp.status_code == 422


def test_protected_route_without_token(client, seed_data):
    resp = client.get("/api/products")
    assert resp.status_code == 403


def test_protected_route_invalid_token(client, seed_data):
    resp = client.get("/api/products", headers={"Authorization": "Bearer invalid-token"})
    assert resp.status_code == 401
