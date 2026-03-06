# Point of Sale — Final Year Project

This repository contains a full‑stack Point of Sale (POS) application I built for my final year project. It’s intended to be practical and straightforward to run — a working demo for small cafés and restaurants that covers product and inventory management, order processing, table handling, and simple reporting.

Repository layout

- POS-backend — Express + TypeScript API (MongoDB, JWT auth, image uploads)
- POS-React — Vite + React frontend (Redux Toolkit, react-hook-form, Recharts)

What it does

- User signup/login with JWT
- Manage products, categories and product images
- Track ingredients and maintain two inventory types (main & kitchen)
- Create and manage orders, apply deals/combos
- Basic charts and printable receipts for simple reporting

Quick start

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

Notes

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





