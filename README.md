# VNA Project — Occupational Safety and Health Management System

A full-stack application for managing occupational safety and health (OSH) declarations, enterprise registrations, and accident/incident reporting. Built with a monorepo structure comprising a NestJS backend, a Next.js frontend, and a PostgreSQL database.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started with Docker](#getting-started-with-docker)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Default Accounts](#default-accounts)
- [API Overview](#api-overview)
- [Docker Commands Reference](#docker-commands-reference)
- [Troubleshooting](#troubleshooting)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 15 |
| UI Library | React | 19 |
| Styling | Tailwind CSS | 4 |
| Icons | lucide-react | 0.486 |
| Backend Framework | NestJS | 11 |
| ORM | TypeORM | 0.3 |
| Database | PostgreSQL | 15 |
| Authentication | JWT + Passport | — |
| Validation | class-validator + class-transformer | — |
| Password Hashing | bcrypt | 6 |
| Email | Nodemailer | 6.9 |
| Runtime | Node.js | 20 |
| Containerization | Docker + Docker Compose | — |
| Package Manager | npm (workspaces) | — |

---

## Key Features

### Authentication and Authorization
- JWT-based login with username and password.
- Role-based access control (RBAC) with a hierarchical permission tree.
- Permissions are grouped into functional groups (e.g., User Management, Role Management, Enterprise Management) and individual component permissions (View, Create, Update, Delete, Assign, Accept, etc.).
- Endpoints are protected by guards that verify the current user's permissions at runtime.
- Support for both internal (system admin) and enterprise (registered company) account types.

### User Management
- Full CRUD for system users with avatar upload (JPEG/PNG, max 5 MB).
- Soft delete support (users are not permanently removed).
- Role and title assignment per user.
- Password policy enforcement (minimum 8 characters, must include uppercase, lowercase, and digit).
- CSV import/export for bulk user operations.
- OTP-verified email change workflow.
- Admin-initiated password reset.

### Enterprise Management
- Create, view, update, and delete enterprises.
- Multi-step wizard for enterprise registration (basic info, contact details, attachments).
- Each enterprise gets a dedicated user account with the ROLE_ENTERPRISE role, using the tax code as the username.
- File attachment upload and management per enterprise.
- Self-registration endpoint for enterprises (with OTP email verification).

### Role and Permission Management
- Visual permission tree with expand/collapse groups.
- Assign multiple permissions to a single role.
- Create, edit, and delete roles.
- Roles have a unique code and display name.

### Enterprise Types and Industries
- Manage enterprise type lookup table (e.g., LLC, Joint Stock, Private Enterprise).
- Manage industry hierarchy with up to 4 levels of nesting.
- Each industry has a unique code and display name.

### Occupational Accident (TNLĐ) Contract Reporting
- Full CRUD for occupational accident contract reports.
- Reports include: overview statistics (employee counts, payroll, accident figures), per-accident detail rows (cause, injury factor, occupation, victim breakdown), subsidy/compensation data, and file attachments.
- Status workflow: draft, submitted, accepted/rejected.
- Separate views for admin acceptance and enterprise submission.
- Enterprise portal for managing their own reports.
- Print and export support.

### Two Portal Views
- **Admin Portal**: Full system management with sidebar menus for departments, roles, users, permissions, reports, enterprise types, industries, report periods, TNLĐ categories, and TNLĐ contracts.
- **Enterprise Portal**: Company profile management, account settings, and TNLĐ contract report submission.

---

## Architecture Overview

The application follows a three-tier architecture:

1. **Frontend (Presentational Layer)**: Next.js 15 with App Router. The frontend communicates with the backend via REST API calls. It includes two distinct user interfaces: an admin dashboard (full management) and an enterprise dashboard (self-service).

2. **Backend (API Layer)**: NestJS 11 with a modular architecture. Each functional domain (auth, users, roles, permissions, enterprises, etc.) is a self-contained NestJS module with its own controller, service, entity, and DTO files. The backend handles authentication, authorization, validation, and business logic.

3. **Database (Persistence Layer)**: PostgreSQL 15 accessed through TypeORM. The schema is managed via TypeORM migrations and can optionally be auto-synchronized in development mode. Seed data populates the database with default configuration and sample records.

The entire stack runs in Docker containers orchestrated by Docker Compose, making setup consistent across environments.

---

## Project Structure

```
VNA-Project/
├── backend/                          # NestJS backend application
│   ├── src/
│   │   ├── main.ts                   # Application entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── seed-cli.ts               # Standalone seed runner
│   │   ├── seeds/
│   │   │   └── seed.ts               # Database seed script
│   │   ├── migrations/               # TypeORM migration files (7 files)
│   │   ├── libs/
│   │   │   └── core/
│   │   │       ├── decorators/       # @Public(), @RequirePermission()
│   │   │       └── guards/           # JwtAuthGuard, PermissionsGuard
│   │   └── modules/
│   │       ├── auth/                 # Login, register, OTP, profile, password
│   │       ├── users/                # User CRUD, avatar, CSV import
│   │       ├── roles/                # Role CRUD, permission assignment
│   │       ├── permissions/          # Permission tree, CRUD
│   │       ├── enterprises/          # Enterprise CRUD, attachments
│   │       ├── enterprise-types/     # Enterprise type lookup
│   │       ├── industries/           # Hierarchical industry management
│   │       ├── titles/               # Title lookup (job titles)
│   │       ├── districts/            # Province and district lookup
│   │       └── tnld-contract-reports/ # OSH contract reporting
│   ├── Dockerfile.dev
│   ├── .env.example
│   └── package.json
│
├── frontend/                         # Next.js frontend application
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Redirects to /login
│   │   ├── login/                    # Login page
│   │   ├── admin/                    # Admin portal pages
│   │   │   ├── users/                # User list, detail (create/edit)
│   │   │   ├── roles/                # Role management
│   │   │   ├── permissions/          # Permission management
│   │   │   ├── enterprises/          # Enterprise management
│   │   │   ├── enterprise-types/     # Enterprise type management
│   │   │   ├── industries/           # Industry management
│   │   │   ├── tnld-categories/      # TNLĐ category management
│   │   │   └── tnld-contracts/       # TNLĐ contract management
│   │   └── enterprise/               # Enterprise portal pages
│   │       ├── company-info/         # Company profile
│   │       ├── account-info/         # Account settings
│   │       └── tnld-hdld/            # TNLĐ contract submission
│   ├── src/libs/tts/
│   │   └── components/               # Reusable React components
│   │       ├── Sidebar.tsx           # Admin sidebar
│   │       ├── EnterpriseSidebar.tsx # Enterprise sidebar
│   │       ├── UserProfilePopup.tsx  # Global profile popup
│   │       ├── PermissionListPage.tsx
│   │       ├── RoleListPage.tsx / RoleModal.tsx
│   │       ├── UserListPage.tsx
│   │       ├── EnterpriseListPage.tsx
│   │       ├── DatePicker.tsx / Autocomplete.tsx / Pagination.tsx
│   │       ├── ConfirmDeleteDialog.tsx
│   │       └── ... (other shared components)
│   ├── Dockerfile.dev
│   ├── next.config.ts
│   └── package.json
│
├── shared/                           # Shared workspace (types, models)
├── docker-compose.yml                # Service orchestration
├── test-data/                        # Sample CSV import files
├── scripts/
│   └── restore-db.sh                 # Database restore script
├── .env.example                      # Root environment template
└── package.json                      # Monorepo root with npm workspaces
```

---

## Prerequisites

### Option A: Docker (Recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Docker Engine and Docker Compose).
- A computer with at least 8 GB of RAM and 10 GB of free disk space.

### Option B: Manual Setup
- Node.js 18 or later.
- npm 9 or later.
- PostgreSQL 15 or later running locally or accessible via network.
- A Git client.

---

## Getting Started with Docker

Follow these steps to get the application running in under 5 minutes.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd VNA-Project
```

### Step 2: Configure Environment Variables

Copy the example environment files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

The root `.env` file contains SMTP settings for email delivery. If you leave `MAIL_USER` and `MAIL_PASSWORD` empty, the application falls back to Ethereal (a test email service) and logs the preview URL to the backend console. This is fine for development.

The `backend/.env` file contains database credentials, JWT settings, and email configuration. The default values are pre-configured for Docker and should work without modification in development.

### Step 3: Start the Services

```bash
docker compose up -d
```

This command starts three containers:
- **postgres**: PostgreSQL 15 database on port 5433 (mapped from internal port 5432).
- **backend**: NestJS API server on port 3001 with hot-reload.
- **frontend**: Next.js dev server on port 3000 with hot-reload.

The backend container waits for PostgreSQL to become healthy before starting. npm dependencies are automatically installed inside each container on first run.

### Step 4: Seed the Database

After all containers are running, execute the seed script:

```bash
docker exec vna-backend npm run seed
```

This populates the database with reference data and sample records (see [Database Seeding](#database-seeding) for details).

### Step 5: Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Database | localhost:5433 |

Log in with the default admin account:

- **Username:** admin
- **Password:** admin123

---

## Manual Setup

### Backend

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# 3. Create the database
createdb vna_db

# 4. Start the development server
npm run start:dev
```

The backend starts on http://localhost:3001. With `TYPEORM_SYNC=true` (default in development), TypeORM automatically creates database tables on startup.

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 3. Start the development server
npm run dev
```

The frontend starts on http://localhost:3000.

### Seed the Database (Manual Setup)

```bash
cd backend
npm run seed
```

---

## Environment Variables

### Root `.env` (SMTP Configuration)

| Variable | Description | Default |
|----------|-------------|---------|
| `MAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP server port | `587` |
| `MAIL_USER` | SMTP username (Gmail address) | empty (uses Ethereal) |
| `MAIL_PASSWORD` | SMTP password or App Password | empty (uses Ethereal) |
| `MAIL_FROM` | From address for outgoing emails | empty (uses Ethereal) |

For Gmail, enable 2-Step Verification and generate an App Password at https://myaccount.google.com/apppasswords. Use the 16-character App Password as `MAIL_PASSWORD`.

### Backend `backend/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `postgres` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | `vna_user` |
| `DB_PASSWORD` | Database password | `vna_password` |
| `DB_NAME` | Database name | `vna_db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-change-in-production` |
| `JWT_EXPIRATION` | JWT token lifetime | `24h` |
| `MAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_SECURE` | Use TLS | `false` |
| `MAIL_USER` | SMTP username | `your-real-email@gmail.com` |
| `MAIL_PASSWORD` | SMTP password | `your-gmail-app-password` |
| `MAIL_FROM` | From address | `your-real-email@gmail.com` |
| `TYPEORM_SYNC` | Auto-sync schema | `true` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

---

## Database Seeding

The seed script (`backend/src/seeds/seed.ts`) populates the database with the following data:

| Data | Count | Details |
|------|-------|---------|
| Permissions | 63 | Hierarchical permission tree with 15 groups and 48 component permissions covering admin and enterprise modules |
| Roles | 6 | ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_MANAGER, ROLE_USER, ROLE_ENTERPRISE, ROLE_DMC |
| Role-Permission Assignments | Pre-configured | Each role is assigned a subset of permissions appropriate to its function |
| Titles | 5 | Giám đốc, Trưởng phòng, Nhân viên, Kế toán, Quản trị viên |
| Admin User | 1 | Username: admin, Password: admin123, Email: admin@vna.local |
| Province | 1 | Thành phố Hồ Chí Minh |
| Districts/Wards | 30 | 20 phường + 10 xã within HCMC |
| Enterprise Types | 6 | CP (Công ty cổ phần), CPDC (Công ty cổ phần đại chúng), TNHH (Công ty TNHH), TNHH1TV (Công ty TNHH 1 thành viên), DNTN (Doanh nghiệp tư nhân), HTXCP (Hợp tác xã cổ phần) |
| Industries | 59 | Hierarchical with up to 4 levels (L1-L4) |
| Sample Enterprises | 14 | Each with a corresponding user account (username = tax code, password = 12345678) |
| TNLĐ Contract Reports | 2 | Sample reports with overview, accident details, and subsidy data |

### Re-seeding

The seed script is idempotent for most data types (it checks for existing records before inserting). To perform a full reset, run the TypeORM migrations first to recreate all tables, then execute the seed:

```bash
docker exec vna-backend npm run typeorm migration:run
docker exec vna-backend npm run seed
```

---

## Default Accounts

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | Quản trị viên cấp cao (Super Admin) | Full system access |
| 910000888295 | 12345678 | Doanh nghiệp (Enterprise) | Sample enterprise ABC Trading Co., Ltd. |
| 910000888296 | 12345678 | Doanh nghiệp (Enterprise) | Sample enterprise Binh Minh Investment |
| 910000888297 | 12345678 | Doanh nghiệp (Enterprise) | Sample enterprise Hoang Anh Private Enterprise |
| (10 more tax codes) | 12345678 | Doanh nghiệp (Enterprise) | Additional sample enterprises |

Enterprise accounts use their tax code as the username. All enterprise accounts use `12345678` as the default password.

---

## API Overview

### Authentication

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| POST | /auth/login | Login with username and password | Public |
| GET | /auth/me | Get current user profile | JWT |
| POST | /auth/profile | Update profile (name, email) | JWT |
| POST | /auth/change-password | Change password | JWT |
| POST | /auth/send-otp | Send OTP email | Public |
| POST | /auth/verify-otp | Verify OTP code | Public |
| POST | /auth/request-change-email | Request email change (sends OTP) | JWT |
| POST | /auth/verify-change-email-otp | Verify OTP and update email | JWT |
| POST | /auth/register-enterprise | Self-registration for enterprises | Public |
| POST | /auth/reset-password | Reset password with OTP | Public |
| GET | /auth/enterprise-types | List enterprise types | Public |
| GET | /auth/industries | List industries | Public |

### User Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /users | List all users | ADMIN_C_USER_VIEW |
| GET | /users/:id | Get user by ID | ADMIN_C_USER_VIEW |
| POST | /users | Create user | ADMIN_C_USER_CREATE |
| PUT | /users/:id | Update user | ADMIN_C_USER_UPDATE |
| DELETE | /users/:id | Soft-delete user | ADMIN_C_USER_DELETE |
| PATCH | /users/:id/avatar | Upload avatar | JWT |

### Role Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /roles | List all roles | ADMIN_C_ROLE_VIEW |
| GET | /roles/:id | Get role with permissions | ADMIN_C_ROLE_VIEW |
| POST | /roles | Create role | ADMIN_C_ROLE_CREATE |
| PUT | /roles/:id | Update role | ADMIN_C_ROLE_UPDATE |
| DELETE | /roles/:id | Delete role | ADMIN_C_ROLE_DELETE |

### Permission Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /permissions/tree | Get permission hierarchy | ADMIN_C_PERMISSION_VIEW |

### Enterprise Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /enterprises | List enterprises | ADMIN_C_ENTERPRISE_VIEW |
| GET | /enterprises/me | Get current enterprise | JWT (Enterprise) |
| GET | /enterprises/:id | Get enterprise detail | ADMIN_C_ENTERPRISE_VIEW |
| POST | /enterprises | Create enterprise | ADMIN_C_ENTERPRISE_CREATE |
| PUT | /enterprises/:id | Update enterprise | ADMIN_C_ENTERPRISE_UPDATE |
| PUT | /enterprises/me | Update own enterprise profile | JWT (Enterprise) |
| DELETE | /enterprises/:id | Delete enterprise | ADMIN_C_ENTERPRISE_DELETE |
| GET | /enterprises/:id/attachments | List attachments | ADMIN_C_ENTERPRISE_VIEW |
| POST | /enterprises/:id/attachments | Upload attachment | ADMIN_C_ENTERPRISE_UPDATE |

### Enterprise Types

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /enterprise-types | List all | ADMIN_C_ENTERPRISE_TYPE_VIEW |
| POST | /enterprise-types | Create | ADMIN_C_ENTERPRISE_TYPE_CREATE |
| PUT | /enterprise-types/:id | Update | ADMIN_C_ENTERPRISE_TYPE_UPDATE |
| DELETE | /enterprise-types/:id | Delete | ADMIN_C_ENTERPRISE_TYPE_DELETE |

### Industries

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /industries | List all | ADMIN_C_INDUSTRY_VIEW |
| POST | /industries | Create | ADMIN_C_INDUSTRY_CREATE |
| PUT | /industries/:id | Update | ADMIN_C_INDUSTRY_UPDATE |
| DELETE | /industries/:id | Delete | ADMIN_C_INDUSTRY_DELETE |

### TNLĐ Contract Reports

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /tnld-contract-reports | List all reports | ADMIN_C_TNLD_CONTRACT_VIEW |
| GET | /tnld-contract-reports/enterprise/:enterpriseId | List by enterprise | ADMIN_C_TNLD_CONTRACT_VIEW |
| GET | /tnld-contract-reports/:id | Get report detail | ADMIN_C_TNLD_CONTRACT_VIEW |
| POST | /tnld-contract-reports | Create report | ADMIN_C_TNLD_CONTRACT_CREATE |
| PUT | /tnld-contract-reports/:id | Update report | ADMIN_C_TNLD_CONTRACT_UPDATE |
| PATCH | /tnld-contract-reports/:id/accept | Accept/reject report | ADMIN_C_TNLD_CONTRACT_ACCEPT |
| DELETE | /tnld-contract-reports/:id | Delete report | ADMIN_C_TNLD_CONTRACT_DELETE |

### Lookup Endpoints

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | /provinces | List provinces | Public |
| GET | /districts?provinceId= | List districts by province | Public |
| GET | /titles | List titles | JWT |

---

## Docker Commands Reference

### Start Services

```bash
docker compose up            # Foreground mode (attached to console)
docker compose up -d         # Detached mode (background)
docker compose up --build    # Rebuild images before starting
```

### View Logs

```bash
docker compose logs -f backend       # Follow backend logs
docker compose logs -f frontend      # Follow frontend logs
docker compose logs -f postgres      # Follow database logs
docker compose logs -f               # Follow all services
```

### Stop Services

```bash
docker compose down          # Stop and remove containers
docker compose down -v       # Stop, remove containers, and delete volumes (erases database data)
```

### Execute Commands in Containers

```bash
# Seed the database
docker exec vna-backend npm run seed

# Access the PostgreSQL CLI
docker exec -it vna-postgres psql -U vna_user -d vna_db

# View OTP codes (useful when using Ethereal)
docker logs vna-backend | grep "\[DEV\]"

# Rebuild a single service
docker compose up -d --build backend
```

---

## Troubleshooting

### Port Already in Use

If port 3000, 3001, or 5433 is already occupied on your host machine:

```bash
# Find and kill the process on a specific port (Linux/macOS)
lsof -ti:3000 | xargs kill -9

# On Windows, use:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Alternatively, edit the port mappings in `docker-compose.yml` to use different host ports.

### Database Connection Errors

1. Ensure the PostgreSQL container is healthy:
   ```bash
   docker ps | grep vna-postgres
   ```
2. Verify the database credentials in `backend/.env` match those in `docker-compose.yml`.
3. Check PostgreSQL logs:
   ```bash
   docker compose logs postgres
   ```

### Frontend Not Loading or Build Errors

1. Clear the Next.js build cache and rebuild:
   ```bash
   docker compose down
   rm -rf frontend/.next
   docker compose up --build
   ```
2. Verify the frontend can reach the backend API by checking the browser's network tab for requests to `http://localhost:3001`.

### Backend Fails to Start

1. Check the backend logs for error details:
   ```bash
   docker compose logs backend
   ```
2. Ensure the `.env` file exists in the `backend/` directory.
3. If you encounter TypeORM errors, try setting `TYPEORM_SYNC=false` and running migrations manually:
   ```bash
   docker exec vna-backend npm run typeorm migration:run
   ```

### OTP Email Not Received

In development mode with empty SMTP credentials, the application uses Ethereal. The OTP code is printed to the backend console:

```bash
docker logs vna-backend | grep "\[DEV\]"
```

Look for output like: `[DEV] Generated OTP for ...: 123456`

When using real SMTP credentials (e.g., Gmail), ensure you are using an App Password, not your regular email password. See the [Environment Variables](#environment-variables) section for configuration instructions.

### Seed Script Fails

If the seed script fails, ensure the database is accessible and the tables exist:

```bash
# Check database connection
docker exec vna-backend npm run typeorm query "SELECT 1"

# Run migrations first
docker exec vna-backend npm run typeorm migration:run

# Re-run seed
docker exec vna-backend npm run seed
```

---

## License

This project is proprietary and confidential.
