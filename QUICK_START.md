# Quick Start Guide

This guide walks you through setting up and running the VNA Project on your local machine. The recommended approach uses Docker, which requires no manual dependency installation beyond Docker itself.

---

## Prerequisites

### Docker Setup (Recommended)

- Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Ensure Docker Compose is included (it ships with Docker Desktop by default)

### Manual Setup (Alternative)

- Node.js 18 or later
- npm 9 or later
- PostgreSQL 15 or later

---

## Quick Start with Docker

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd VNA-Project
```

### Step 2: Configure Environment Files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

The default values work for local development. If you want to test email features, configure SMTP credentials in `.env`. Otherwise, emails (OTP codes) will be printed to the backend console.

### Step 3: Start All Services

```bash
docker compose up -d
```

This starts three services in the background:
- **PostgreSQL database** on port 5433
- **NestJS backend** on port 3001
- **Next.js frontend** on port 3000

Wait 20-30 seconds for all services to initialize. You can check progress with:

```bash
docker compose ps
```

All three services should show a "running" status.

### Step 4: Seed the Database

```bash
docker exec vna-backend npm run seed
```

This populates the database with reference data, sample enterprises, and a default admin account.

### Step 5: Open the Application

Open your browser and navigate to:

```
http://localhost:3000
```

Log in with the default admin credentials:

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin123 |

---

## Default Accounts

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | Super Admin | Full system access |
| 910000888295 | 12345678 | Enterprise | Sample enterprise account (ABC Trading) |
| 910000888296 | 12345678 | Enterprise | Sample enterprise account (Binh Minh Investment) |
| 910000888297 | 12345678 | Enterprise | Sample enterprise account (Hoang Anh Private Enterprise) |

Enterprise accounts use their tax code as the username. Additional enterprise accounts (11 more) use tax codes in the same 9100008882XX range with password `12345678`.

---

## Manual Setup (Without Docker)

### Backend

```bash
cd backend
cp .env.example .env
npm install

# Edit .env: set DB_HOST to localhost, adjust DB_USERNAME/DB_PASSWORD for your local PostgreSQL
npm run start:dev
```

The backend starts on http://localhost:3001.

### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

The frontend starts on http://localhost:3000.

### Seed the Database

```bash
cd backend
npm run seed
```

---

## Useful Commands

### View logs

```bash
docker compose logs -f backend       # Backend logs (includes OTP codes)
docker compose logs -f frontend      # Frontend logs
docker compose logs -f postgres      # Database logs
```

### Find OTP codes (development mode)

When SMTP credentials are not configured, OTP codes appear in the backend logs:

```bash
docker logs vna-backend | grep "\[DEV\]"
```

Example output: `[DEV] Generated OTP for email change: 482916`

### Run database queries

```bash
docker exec -it vna-postgres psql -U vna_user -d vna_db
```

### Stop all services

```bash
docker compose down
```

### Stop and delete database data

```bash
docker compose down -v
```

This removes all containers and the PostgreSQL data volume. You will need to re-seed after running this command.

### Rebuild a service after code changes

```bash
docker compose up -d --build backend
```

---

## Common Issues

### Port conflicts

If ports 3000, 3001, or 5433 are already in use:

- On Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
- On macOS/Linux: `lsof -ti:3000 | xargs kill -9`

Or change the host port in `docker-compose.yml` (e.g., `"3000:3000"` to `"3001:3000"`).

### Backend fails to start

Ensure the PostgreSQL container is healthy first:

```bash
docker compose logs postgres
```

If the database credentials in `backend/.env` do not match `docker-compose.yml`, update them and restart.

### Frontend shows network errors

Verify the backend is running by visiting http://localhost:3001/auth (you should see a 401 response, not a connection refused error). If the backend URL differs, update it in `frontend/.env.local` or the `environment` section of `docker-compose.yml`.

### Seed script says "no such command"

Ensure the backend container is fully started:

```bash
docker compose logs backend | tail -10
```

Look for "Nest application successfully started" before running the seed command.
