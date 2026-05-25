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
│   ├── config.py            # DB & JWT settings (reads .env)
│   ├── database.py          # SQLAlchemy engine & session
│   ├── dependencies.py      # Auth guards (get_current_user, require_role)
│   ├── models/              # SQLAlchemy ORM models (13 tables)
│   ├── schemas/             # Pydantic request/response schemas
│   ├── routers/             # API route handlers
│   ├── requirements.txt
│   └── .env                 # Environment variables (DB credentials, JWT secret)
├── frontend/
│   ├── index.html           # POS main page (product grid + invoice panel)
│   ├── login.html           # Employee login page
│   ├── main.js              # POS logic (cart, checkout, promotions, points)
│   ├── css/
│   │   ├── common.css       # CSS variables & resets
│   │   ├── layout.css       # App shell, sidebar, topbar
│   │   ├── tables.css       # Table & form-group styles
│   │   ├── modals.css       # Modal overlays, form cards, receipts
│   │   ├── invoice-panel.css # POS right panel (cart, summary)
│   │   ├── invoice-history.css # Invoice history page
│   │   ├── notifications.css # Notifications page
│   │   ├── account.css      # Account & checkout page
│   │   └── auth.css         # Login page
│   ├── javascript/
│   │   ├── api.js           # API client + shared utilities (fmtVND, showToast, validateForm)
│   │   ├── customer.js      # Customer search & loyalty panel
│   │   ├── promotions.js    # Active promotions panel
│   │   ├── points.js        # Points redemption panel
│   │   └── payment.js       # Checkout & payment flow
│   ├── pages/
│   │   ├── cart.html         # Product management (CRUD table + modals)
│   │   ├── invoice.html      # Invoice history (search, sort, detail view, print)
│   │   ├── checkout.html     # Order confirmation page
│   │   ├── promotions.html   # Promotions management (Manager only)
│   │   ├── notification.html # System notifications (stock, expiry, promos)
│   │   └── account.html      # Employee profile, change password, staff management
│   └── assets/               # Logo & product images
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

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Employee login (returns JWT token) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List product categories |
| GET | `/api/products` | List products (`?category=` & `?search=`) |
| GET | `/api/products/{MaSP}` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{MaSP}` | Update product |
| DELETE | `/api/products/{MaSP}` | Delete product |
| POST | `/api/products/{MaSP}/upload-image` | Upload product image |
| GET | `/api/products/{MaSP}/discount` | Get active discount for product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers/phone/{SDT}` | Customer lookup by phone |
| GET | `/api/customers/{MaKH}` | Get customer by ID |
| POST | `/api/customers` | Register new customer |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Invoice history |
| GET | `/api/invoices/{MaHD}` | Invoice detail with items |
| POST | `/api/invoices` | Checkout (create invoice, deduct stock, handle points) |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (Manager only) |
| GET | `/api/employees/{MaNV}` | Employee profile |
| PUT | `/api/employees/{MaNV}` | Update employee |
| POST | `/api/employees` | Create employee (Manager only) |
| POST | `/api/employees/me/change-password` | Change own password |
| POST | `/api/employees/{MaNV}/reset-password` | Reset password to default (Manager only) |

### Promotions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/promotions` | List all promotions |
| GET | `/api/promotions/active` | Active promotions with products |
| POST | `/api/promotions` | Create promotion (Manager only) |
| PUT | `/api/promotions/{MaKM}` | Update promotion (Manager only) |
| DELETE | `/api/promotions/{MaKM}` | Delete promotion (Manager only) |
| POST | `/api/promotions/{MaKM}/products` | Add product to promotion |
| DELETE | `/api/promotions/{MaKM}/products/{MaSP}` | Remove product from promotion |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment-methods` | List payment methods |
| GET | `/api/notifications` | System notifications (stock, expiry, promos) |
| GET | `/api/audit-log` | Activity log (`?target_type=` & `?target_id=`) |

## Features

- **POS Checkout** — Add products to cart, apply promotions, select payment method, print receipt
- **Customer Loyalty** — Points system (earn 1% per order, redeem 10 points = 1₫), auto tier upgrade (Bronze → Silver → Gold → Diamond)
- **Promotions Management** — Manager-only page to create/edit/delete promotions and assign product discounts
- **Invoice History** — Search by ID/date, sort by date/total, detail view with print support
- **Product Management** — Full CRUD with image upload, category filtering, and activity log
- **Staff Management** — Manager can add employees, edit roles, and reset passwords
- **Change Password** — Employees can change their own password (requires current password verification)
- **Notifications** — Low stock alerts, expiry warnings, promotion updates, with read/dismiss state
- **Authentication** — JWT-based login with role-based access control (Manager vs Cashier)
- **Responsive Design** — Sidebar navigation, scrollable panels, print-optimized invoice view
