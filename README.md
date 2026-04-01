# Point of Sale — Final Year Project

A high-performance Fast Food Point of Sale (POS) system built with the **MERN stack** (MongoDB, Express, React, Node.js). Developed as a Final Year Project to optimize quick-service restaurant workflows, featuring real-time order tracking, dynamic menu management, responsive customer-facing interface, and **AI-powered business intelligence**.

## Repository layout

- POS-backend — Express + TypeScript API (MongoDB, JWT auth, image uploads)
- POS-React — Vite + React frontend (Redux Toolkit, react-hook-form, Recharts)

## Core Features

- User signup/login with JWT
- Manage products, categories and product images
- Track ingredients and maintain two inventory types (main & kitchen)
- Create and manage orders, apply deals/combos
- Basic charts and printable receipts for simple reporting

## 🤖 AI Features (NEW)

### 📊 Sales Forecasting & Demand Prediction
- Neural network-based sales predictions using **brain.js**
- Analyzes 90 days of historical order data
- Predicts next 7 days of total sales with confidence metrics
- Product-level forecasts for top 10 best-selling items
- Identifies sales trends (increasing/decreasing/stable)
- **Endpoint:** `GET /api/v1/ai/sales-forecast`

### 🔔 Smart Inventory Management
- Intelligent low-stock alerts powered by **node-cron**
- Calculates average daily consumption per ingredient
- 3-tier alert system: Critical (<1 day), Low (1-3 days), Normal (>3 days)
- Automatic scheduler runs every 6 hours
- Actionable reorder recommendations to prevent stockouts
- **Endpoints:**
  - `GET /api/v1/ai/inventory-alerts` — Current alerts
  - `GET /api/v1/ai/inventory-summary` — Inventory health overview
  - `POST /api/v1/ai/trigger-inventory-check` — Manual trigger

---

## Quick start

Requirements: Node.js (v18+), npm (or yarn), and a MongoDB instance (Atlas or local).

Backend

1. Install dependencies:

```powershell
cd "d:\\Final-year-project\\Point_of_Sale_System\\POS-backend"
npm install
```

2. Copy `POS-backend/.env.example` to `POS-backend/.env` and fill in your values (MongoDB URL, JWT secret, PORT, etc.).

3. Start the API for development:

```powershell
# Quick: run TypeScript directly
npx ts-node ./src/server.ts

# Recommended during development (auto-reload)
npm install --save-dev nodemon
npx nodemon --exec "npx ts-node" ./src/server.ts
```

Frontend

1. Install dependencies and start dev server:

```powershell
cd "d:\\Final-year-project\\Point_of_Sale_System\\POS-React"
npm install
npm run dev
```

2. Configure the frontend to talk to your backend by creating `POS-React/.env` and adding:

```
VITE_API_URL=http://localhost:3000/api/v1
```

(Adjust the port if your backend uses a different one.)

## AI Features Setup

The AI features are automatically initialized when you start the backend:

1. **Sales Forecasting** requires at least 14 days of order history in the database
2. **Inventory Alerts** scheduler starts automatically and runs every 6 hours

Both features are **admin-only** endpoints — authenticate with a valid JWT Bearer token.

### Test AI Features

```bash
# Get sales forecast
curl -X GET http://localhost:3000/api/v1/ai/sales-forecast \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get inventory alerts
curl -X GET http://localhost:3000/api/v1/ai/inventory-alerts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get inventory summary
curl -X GET http://localhost:3000/api/v1/ai/inventory-summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Tech Stack & Dependencies

### Backend
- **Express + TypeScript** — API framework with type safety
- **MongoDB + Mongoose** — Database and ODM
- **JWT (jsonwebtoken)** — Authentication
- **brain.js** — Neural network for sales forecasting
- **node-cron** — Task scheduler for inventory checks
- **Helmet, express-mongo-sanitize, hpp** — Security middleware
- **Multer + Sharp** — Image upload and processing

### Frontend
- **React + Vite** — Fast UI framework with build tooling
- **Redux Toolkit** — State management
- **react-hook-form** — Form handling
- **Recharts** — Data visualization
- **Tailwind CSS** — Styling

---

## Notes

- Run the frontend and backend in separate terminals. The frontend reads the API base URL from `VITE_API_URL`.
- MongoDB Atlas is convenient for cloud-hosted development; otherwise run MongoDB locally.
- Use Postman or Insomnia to test endpoints while developing the UI.

Where to look in the code

- `POS-backend/src/app.ts` — main Express setup and mounted routes
- `POS-backend/src/routes/` — route definitions
- `POS-backend/src/controllers/` — request handlers
- `POS-backend/src/models/` — Mongoose schemas
- `POS-backend/src/dtos/` — data transfer objects (request shapes)
- `POS-React/src/` — frontend app, features and components

Security

The backend uses `helmet`, `express-mongo-sanitize`, `hpp`, and DOMPurify for basic hardening. Authentication is performed using signed JWTs.





