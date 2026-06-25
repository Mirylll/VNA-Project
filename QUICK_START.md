# ⚡ Quick Start Guide

## 🐳 Docker (Recommended)

```bash
docker-compose up
```

**Open:**
- Frontend: http://localhost:3000/login
- Backend: http://localhost:3001

> Use `docker-compose up --build` to rebuild after code changes.

---

## 💻 Manual Setup

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📂 Database Initialization

Reference data (permissions, roles, enterprise types, industries, districts, etc.) is managed via TypeORM migrations + seed:

```bash
cd backend
npm run seed
```

This seeds:
- Permissions & role-permission assignments
- Roles & titles
- Enterprises (14 sample companies) + enterprise user accounts
- Enterprise types, industries (hierarchical)
- Province (TP. HCM) & wards
- Admin user (default: `admin` / `admin123`)

> For full reset: run migrations first, then seed.

---

## 🔍 OTP Logs

OTP codes appear in the backend console:
```bash
docker logs vna-backend | grep "\[DEV\]"
```
Look for: `[DEV] Generated OTP for ...: XXXXXX`

---

## 🛑 Stop

```bash
docker-compose down
```

For full documentation, see **README.md**
