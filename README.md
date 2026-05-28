# VNA-Project

Flat monorepo cho ứng dụng Next.js (Frontend) + NestJS (Backend) với shared TypeScript models.

## Cấu trúc thư mục

```
VNA-Project/
├── shared/                          # Models / types dùng chung
│   └── tts/
│       └── models/
│           └── department.model.ts
│
├── frontend/                        # Next.js 15 + Tailwind CSS v4
│   ├── app/                         # App Router (layout.tsx, page.tsx)
│   ├── public/
│   ├── src/
│   │   └── libs/
│   │       ├── core/                # components, hooks, services dùng chung
│   │       ├── shared/              # alias cho shared workspace
│   │       └── tts/                 # Feature module TTS
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                         # NestJS 11
│   ├── src/
│   │   ├── configurations/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── libs/                    # core (decorators, guards, interceptors)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── templates/
│   ├── test/
│   ├── nest-cli.json
│   └── tsconfig.json
│
├── package.json                     # npm workspaces: frontend, backend, shared
└── tsconfig.json                    # Path mappings: shared/* → shared/
```

## Yêu cầu

- Node.js >= 18

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
