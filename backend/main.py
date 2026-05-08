from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import (
    auth,
    categories,
    products,
    customers,
    invoices,
    employees,
    promotions,
    payment_methods,
    notifications,
    suppliers,
    stock_imports,
)

app = FastAPI(title="FreshMart POS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(invoices.router)
app.include_router(employees.router)
app.include_router(promotions.router)
app.include_router(payment_methods.router)
app.include_router(notifications.router)
app.include_router(suppliers.router)
app.include_router(stock_imports.router)


@app.get("/")
def root():
    return {"message": "FreshMart POS API", "docs": "/docs"}
