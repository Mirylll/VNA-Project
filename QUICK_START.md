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

## 📂 Database Sharing

The project uses `dump-data.sql` (data-only) to synchronize database state:

### Dump (before push — automatic)
Pre-push hook auto-dumps the database:
```bash
git config core.hooksPath .githooks    # already set
# Just push normally — hook runs automatically
```

### Restore (after pull)
```bash
bash scripts/restore-db.sh
```
Or manually:
```bash
docker exec -i vna-postgres psql -U vna_user vna_db < dump-data.sql
```

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
