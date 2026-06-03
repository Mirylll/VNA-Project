# ⚡ Quick Start Guide

## 🐳 Using Docker (Recommended - 1 command)

```bash
docker-compose up
```

**Done!** Open:
- Frontend: http://localhost:3000/login
- Backend: http://localhost:3001

Login with: `demo` / `Demo@1234`

---

## 💻 Manual Setup (Local Node.js)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Test Features

1. **Login** → Use `demo / Demo@1234`
2. **Profile** → Click user button (bottom-left)
3. **Change Email** → Click "Thay đổi email" → Enter new email → Get OTP from logs
4. **Profile Update** → Edit "Họ và tên" → Click "Lưu"

---

## 📋 Default Credentials

- **Username**: demo
- **Password**: Demo@1234
- **Email**: newmail@example.com

---

## 🔍 Get OTP for Email Change

When testing email change, OTP is logged to console:

```bash
docker logs vna-backend | grep "Change-email"
```

Look for: `Change-email OTP for user 1: XXXXXX`

---

## 🛑 Stop Services

```bash
docker-compose down
```

---

For full documentation, see **README.md**
