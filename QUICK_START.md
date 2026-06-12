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

---

## 🔑 Accounts

### Admin Panel
| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | CEO (full permissions) |
| `banbanban` | *(user-defined)* | Employee |
| `baobao` | *(user-defined)* | CEO |
| `ducduc` | *(user-defined)* | Manager |

### Enterprise Portal (username = tax code)
| Tax Code | Password | Note |
|---|---|---|
| `910000888295` | `12345678` | Default |
| `910000888296` | `12345678` | Default |
| `910000888297` | `HoangAnh@2024` | Changed |
| `910000888298` | `Xanh@123` | Changed |

---

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
