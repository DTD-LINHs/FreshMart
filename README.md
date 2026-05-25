# FreshMart POS

A supermarket Point-of-Sale system with a Python FastAPI backend and vanilla HTML/CSS/JS frontend, connected to a MySQL database.

## Prerequisites

- **Python 3.10+**
- **MySQL 8.0+**
- A MySQL database named `QuanLyBanHang` with the required tables (see `docs/ProjectDocument.md`)

## Project Structure

```
FreshMart/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py             # DB & JWT settings (reads .env)
│   ├── database.py           # SQLAlchemy engine & session
│   ├── models/               # SQLAlchemy ORM models (13 tables)
│   ├── schemas/              # Pydantic request/response schemas
│   ├── routers/              # API route handlers
│   ├── requirements.txt
│   └── .env                  # Environment variables (DB credentials, JWT secret)
├── frontend/
│   ├── index.html            # POS main page (product grid + invoice panel)
│   ├── main.js               # POS logic (cart, checkout, promotions, points)
│   ├── style.css             # All styles
│   ├── javascript/
│   │   └── api.js            # API client + shared utilities (fmtVND, showToast)
│   ├── pages/
│   │   ├── cart.html         # Product management (CRUD)
│   │   ├── invoice.html      # Invoice history (search, sort, detail view)
│   │   ├── notification.html # Notifications & active promotions
│   │   └── account.html      # Employee profile
│   └── assets/               # Images & product photos
└── docs/
    └── ProjectDocument.md    # Database schema documentation
```

## Setup

### 1. Clone & install backend dependencies

```bash
cd FreshMart
pip install -r backend/requirements.txt
```

### 2. Configure environment

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=QuanLyBanHang
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### 3. Set up the database

Make sure MySQL is running and the `QuanLyBanHang` database exists with all required tables. Refer to `docs/ProjectDocument.md` for the full schema.

### 4. Run the backend

```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 5. Open the frontend

Open `frontend/index.html` in a browser, or serve it with any static file server:

```bash
# Option 1: Python built-in server
cd frontend
python -m http.server 5500

# Option 2: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

The frontend expects the backend API at `http://localhost:8000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Employee login (MaNV + password) |
| GET | `/api/categories` | List product categories |
| GET | `/api/products` | List products (supports `?category=` & `?search=`) |
| POST/PUT/DELETE | `/api/products` | Product CRUD |
| GET | `/api/customers/phone/{SDT}` | Customer lookup by phone |
| POST | `/api/customers` | Register new customer |
| GET | `/api/payment-methods` | List payment methods |
| GET | `/api/promotions/active` | Active promotions |
| GET | `/api/invoices` | Invoice history (newest first) |
| GET | `/api/invoices/{MaHD}` | Invoice detail |
| POST | `/api/invoices` | Checkout (create invoice, deduct stock, handle points & loyalty) |
| GET | `/api/employees/{MaNV}` | Employee profile |
| PUT | `/api/employees/{MaNV}` | Update employee profile |
| GET | `/api/notifications` | System notifications |

## Features

- **POS Checkout** — Add products to cart, apply promotions, process payment
- **Customer Loyalty** — Points system (earn 1% per order, redeem 10 points = 1₫), auto tier upgrade (Đồng → Bạc → Vàng → Kim Cương)
- **Promotions** — Automatic discount application with visibility panel
- **Invoice History** — Search by ID/customer, sort by date/total, newest first
- **Product Management** — Full CRUD with category filtering
- **Authentication** — JWT-based employee login
