# VNA Project - Quản Lý An Toàn Vệ Sinh Lao Động

Hệ thống quản lý an toàn vệ sinh lao động với backend NestJS + TypeORM + PostgreSQL và frontend Next.js 15.

## 📋 Prerequisites

- **Docker & Docker Compose** (Recommended for easy setup)
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop)

- **OR Local Node.js** (For manual setup)
  - Node.js >= 18
  - PostgreSQL 15+
  - npm/yarn

## 🚀 Quick Start (Recommended)

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd VNA-Project-main
```

### 2. Start All Services with Docker Compose
```bash
docker-compose up
```

This will automatically:
- Start PostgreSQL database on port 5432
- Start NestJS backend on port 3001
- Start Next.js frontend on port 3000
- Initialize database schema

### 3. Access Application
- **Frontend**: http://localhost:3000/login
- **Backend API**: http://localhost:3001/auth
- **Database**: localhost:5432

### 4. Default Credentials
```
Username: demo
Password: Demo@1234
```

## 🔧 Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your database credentials

# 3. Run migrations
npm run typeorm migration:run

# 4. Start development server
npm run start:dev
```

### Frontend Setup
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# 3. Start development server
npm run dev
```

## 📁 Project Structure

```
VNA-Project-main/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication & Authorization
│   │   │   ├── users/         # User Management
│   │   │   ├── roles/         # Role Management
│   │   │   ├── permissions/   # Permission Management
│   │   │   └── ...
│   │   ├── config/            # Configuration files
│   │   ├── database/          # TypeORM setup & migrations
│   │   ├── common/            # Shared utilities, guards, interceptors
│   │   └── main.ts            # Application entry point
│   ├── Dockerfile.dev         # Development Dockerfile
│   └── package.json
│
├── frontend/                  # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx         # Root layout with UserProfilePopup
│   │   ├── login/             # Login page
│   │   └── page.tsx           # Home page
│   ├── src/libs/tts/
│   │   ├── components/
│   │   │   └── UserProfilePopup.tsx  # User profile & email change UI
│   │   ├── pages/
│   │   │   └── login/page.tsx        # Login form
│   │   └── ...
│   ├── Dockerfile.dev         # Development Dockerfile
│   └── package.json
│
├── shared/                    # Shared types, utilities
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # This file
```

## 🔑 Key Features

### Authentication
- JWT-based authentication
- Login with username/password
- Password hashing with bcrypt
- Role-based access control (RBAC)

### User Profile Management
- View user profile (username, email, full name)
- Edit profile information (except username)
- Change email with OTP verification
- Change password functionality

### Email & OTP
- OTP generation for email change verification
- Email sending via Nodemailer
- Development mode: Ethereal test email preview
- Production: Real SMTP configuration

### API Endpoints

#### Authentication
- `POST /auth/login` - Login with credentials
- `GET /auth/me` - Get current user info
- `POST /auth/profile` - Update profile
- `POST /auth/request-change-email` - Request email change (sends OTP)
- `POST /auth/verify-change-email-otp` - Verify OTP and update email
- `POST /auth/change-password` - Change password

## 🧪 Testing Flows

### 1. Login
1. Go to http://localhost:3000/login
2. Enter: `demo` / `Demo@1234`
3. Click "Đăng nhập"
4. Success message appears

### 2. User Profile
1. Click user button (bottom-left corner with "U")
2. View profile info in modal
3. Edit "Họ và tên" field
4. Click "Lưu" to save

### 3. Email Change with OTP
1. In profile modal, click "Thay đổi email"
2. Enter new email: `newemail@example.com`
3. Click "Gửi" - OTP generated
4. Check backend logs: `docker logs vna-backend | grep "Change-email"`
5. Enter OTP code in popup
6. Click "Xác nhận"
7. Email updated, popup closes

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=vna_user
DB_PASSWORD=vna_password
DB_NAME=vna_db
JWT_SECRET=your-secret-key
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=your-ethereal-email
MAIL_PASSWORD=your-ethereal-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up          # Start in foreground
docker-compose up -d       # Start in background
```

### View Logs
```bash
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
docker compose logs -f postgres   # Database logs
```

### Stop Services
```bash
docker-compose down       # Stop all
docker-compose down -v    # Stop and remove volumes
```

## 🌱 Database Seeding

Demo user auto-created on first run:
- Username: `demo`
- Password: `Demo@1234`
- Email: `newmail@example.com`

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Check PostgreSQL is running: `docker ps | grep postgres`
- Verify credentials in `.env`
- Check logs: `docker-compose logs postgres`

### Frontend Won't Build
```bash
rm -rf frontend/.next
docker-compose up --build
```

## 📝 Git Workflow

1. Create branch: `git checkout -b feature/name`
2. Commit: `git commit -am "Description"`
3. Push: `git push origin feature/name`
4. Create Pull Request

## 📄 License

This project is proprietary and confidential.

---

**Last Updated**: May 2026
**Version**: 1.0.0

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
# Frontend (http://localhost:3000)
npm run dev:frontend

# Backend (http://localhost:3001)
npm run dev:backend
```

## Build

```bash
npm run build:shared
npm run build:frontend
npm run build:backend
```
