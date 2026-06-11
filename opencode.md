## Goal
Complete the VNA-Project monorepo (Next.js 15 frontend + NestJS backend + PostgreSQL) via Docker Compose — RBAC permission/role/user system, enterprise-types/industries/enterprises CRUD, OTP email flow, sidebar sync with real user data, enterprise wizard with file attachments.

## Constraints & Preferences
- Run full stack via `docker compose up -d` on Windows with Docker Desktop (WSL2 backend).
- Route paths use English kebab-case, mapping to database permission codes.
- All sidebar routes under `/admin/` prefix (flat style), not nested.
- Modal fields use border-intersector style via absolute label `-top-2.5 left-3 bg-white px-1 text-xs`.
- After login, redirect to `/admin/permissions` (first admin page).
- Enterprise wizard grid: `grid grid-cols-1 md:grid-cols-3 gap-6`, field wrappers `h-11` + `border-slate-200`, labels `text-slate-500`.
- All form fields use `border-slate-200` (not `border-slate-300`) with `h-11`.
- **Only commit/push when explicitly requested.**
- **Form fields in UserDetailClient use border-intersector style** (`absolute -top-2.5 left-3 bg-white px-1 text-xs text-slate-400`).
- OTP email: default Ethereal (dev), fallback SMTP when `MAIL_USER`/`MAIL_PASSWORD` are set in `.env`.
- Sidebar popup menu icons: `profile.svg` → Thông tin tài khoản, `key.svg` → Đổi mật khẩu, `log-out.svg` → Đăng xuất.
- Delete confirmations use styled `ConfirmDeleteDialog` (red header, Trash2 icon) — never `window.confirm`.
- `.next/` stored in named Docker volume `next_cache` — isolated from host filesystem.
- **Do not run `npm run build` on host** — use `npx tsc --noEmit` to check types.
- File upload triggers only on "Choose File" button click, not the whole row.
- Enterprise wizard Step2 uses 2-column key-value profile layout (labels bold + colon, values regular weight), centered on `max-w-3xl mx-auto`.
- Attachment files stored on disk at `uploads/enterprises/{enterpriseId}/`.

## Progress
### Done
- All RBAC backend: Permission (self-referencing tree), Role (code+updatedAt+ManyToMany), Title (lookup), User (UUID PK + title FK + soft delete). Modules + CRUD APIs for Permissions, Roles, Users, Titles. Seed data (22 permissions, 4 roles, 5 titles, admin user). PermissionsGuard + `@RequirePermission` decorator. Migration file.
- All backend APIs tested (`POST /auth/login`, `GET /permissions/tree`, `GET /roles`, `GET /users`, `GET /titles`).
- Sidebar redesigned: `bg-[#112D75]`, `text-slate-300`, accordion with Settings icon + ChevronDown rotation, active item `bg-[#1D4ED8] text-white`. Header: emblem logo + 2-line government title.
- **PermissionListPage:** dynamic client-side filter (code/name), connected to `GET /permissions/tree` with Bearer token. Collapsible tree, Roman/Arabic STT, loading/error/empty states.
- **RoleListPage:** fetch `GET /roles`, client-side filter (code/name), selectAll + row checkboxes with `selectedIds[]`, SelectionBar, delete (`Promise.allSettled` via ConfirmDeleteDialog). Loading/error/empty states.
- **RoleModal:** add/edit role with 2-column border-intersector form + permissions tree table (expand/collapse, checkbox select/deselect group + children, filter, pagination 10/page). Header checkbox with select-all + indeterminate state.
- **SelectionBar:** floating action bar at bottom center: blue counter `|` "dữ liệu được chọn" `|` red Xoá (Trash2) `|` X clear. `fadeInUp` keyframe in globals.css.
- **Backend delete protection:** `roles.service.remove()` checks `userRepo.count()` before delete.
- **UserDetailPage** at `/admin/users/detail`: dual-layout for add vs edit mode, border-intersector fields, form validation, avatar upload, email verification + ChangeEmailModal integration.
- **UserListPage:** fetch `GET /users`, client-side filters (fullName, username, email, role, status), select-all + row checkboxes, SelectionBar bulk delete (ConfirmDeleteDialog), ResetPasswordModal + SuccessToast, createdAt DESC order.
- **ResetPasswordModal:** password reset modal, validates min 6 chars, shows actual backend error, 401 redirect.
- **User management schema:** Province, District, UserAvatar entities. User entity updated with `dateOfBirth`, `gender` (GenderEnum), `avatarUrl`, `province`/`district` FKs, `address`, `avatar` OneToOne.
- **DistrictsModule:** `GET /districts?provinceId=` endpoint.
- **UsersService** updated: relation handling (roleId, titleId, provinceId, districtId), duplicate password check, avatar disk management.
- **DTOs updated:** `CreateUserDto`/`UpdateUserDto` with `@IsNumber()`, `UploadAvatarDto` with `validateAvatarFile()`.
- **Seed data expanded:** HCMC province + 30 wards, role codes renamed (CEO/MANAGER/EMPLOYEE/ADMIN), 7 enterprise types, 59 multi-level industries, 3 sample enterprises.
- **Migrations:** 5 files (RBAC, user management, enterprise types, industries, enterprises).
- **Website title/favicon:** "Phần Mềm Quản Lý - Tạo Lập Cơ Sở Dữ Liệu An Toàn Vệ Sinh Lao Động", favicon = `/vna-group-logo.png`.
- **Enterprise wizard** at `/admin/enterprises/create`: stepper (`layout.tsx`), `EnterpriseFormProvider`, `EnterpriseStep1` (3-panel with validation + file attach table, edit mode fetches `GET /enterprises/:id`), `EnterpriseStep2` (2-column key-value layout, calls POST/PUT API with username=taxCode/password=12345678).
- **EnterpriseListPage:** self-contained — fetch `GET /enterprises`, filter (name/taxCode/type/industry/status), select-all + SelectionBar delete (ConfirmDeleteDialog), toggle active status, Eye → AccountInfoModal, Pencil → wizard edit, KeyRound → EnterpriseResetPasswordModal. Loading/error/empty states.
- **EnterpriseModal:** controlled form, POST/PUT API, fetch types/industries/wards, inline validation.
- **AccountInfoModal:** blue header, displays enterprise name + username (mono) + password (mono), Huỷ bỏ button.
- **EnterpriseResetPasswordModal:** calls `PUT /enterprises/:id` with `{ password }`, validates min 6 chars, 401 redirect.
- **EnterpriseStep1 validation:** 7 required fields validated before allowing "Tiếp tục". Red border + inline error text.
- **AttachmentDialog:** file upload modal, file picker on "Choose File" button click only, preserves `file: File` objects.
- **ConfirmDeleteDialog:** reusable styled component — red header with Trash2 icon, Huỷ bỏ + Xoá (red) buttons, loading state, `onConfirm` wrapped in try/finally for guaranteed close.
- **Docker `.next` isolation:** named volume `next_cache:/app/.next` + `.dockerignore`.
- **Backend avatar upload:** `JwtAuthGuard`, `PATCH /users/:id/avatar` with `FileInterceptor('file')`, `updateAvatar()` disk management, `useStaticAssets` for `/uploads/*`.
- **SuccessToast:** green-50 bg, CheckCircle2 + X icons, auto-dismiss 3s, slide animation.
- **ChangeEmailModal:** OTP input with border-intersector, 60s countdown timer, Step1 (OTP verify) → Step2 (enter new email). Handles 401 redirect.
- **UserProfilePopup.tsx:** handles 401 on `GET /auth/me`, updated ChangeEmailModal props.
- **OTP email fallback (deimos0810 version):** HTML email template with inline logo, `path.resolve(process.cwd(), 'assets/logo.png')` for logo, `context` param (`fullName`/`username`/`isRegister`), Ethereal fallback in `createTransporter()` when SMTP env vars missing.
- **Login isActive check:** throws `'Tài khoản đã bị vô hiệu hóa'` when `user.isActive === false`.
- **EnterpriseTypesModule** — entity, DTOs, service, controller (5 CRUD endpoints), migration, seed (7 types).
- **EnterpriseTypeListPage:** fetch `GET /enterprise-types`, filter (code/name/status), select-all + SelectionBar delete, toggle active status, loading/error/empty states.
- **AddEnterpriseTypeModal:** controlled form (code/name/isActive), POST/PUT API, validation.
- **IndustriesModule** — entity (self-referencing parent), DTOs, service (CRUD + child check before delete), controller (5 endpoints), migration, seed (59 industries: 13 L1 + 40 L2 + 6 L3).
- **IndustryListPage:** fetch `GET /industries`, filter (code/name/level), select-all + SelectionBar delete, toggle active, loading/error/empty states.
- **IndustryModal:** form (code/name/parentId/level/isActive), auto-set level from parent, POST/PUT API.
- **EnterprisesModule** + **Attachment** entity — service with `findAttachments`/`uploadAttachment`/`removeAttachment` (disk at `uploads/enterprises/{id}/`), controller with `GET/POST/DELETE /enterprises/:id/attachments`.
- **AuthService.getProfile()** enhanced: returns `avatarUrl`, `titleName`, `roleName`.
- **Sidebar.tsx** updated: fetches `GET /auth/me`, dynamic `fullName`/`titleName`, avatar with img/initials fallback, popup with SVG icons, 401 redirect, avatar `onError`.
- **EnterpriseStep2 FK fixes:** relation objects (`entity.enterpriseType = { id: dto.enterpriseTypeId }`) — fixed `EntityPropertyNotFoundError`. Edit mode async/await with `cancelled` flag.
- **Delete confirm dialog:** `try/finally` for `setDeleteConfirm(null)`.
- **EnterpriseFormContext:** `AttachmentFile` with `id?` and `file?`, `deletedAttachmentIds[]`, `markAttachmentForDelete`, `clearDeletedAttachments`.
- **AttachmentDialog:** hidden `<input>`, `fileInputRef.current?.click()` on button click.
- **EnterpriseStep2 layout:** removed file attachments block, 2-column key-value with `w-56` + `flex-1`, `max-w-3xl mx-auto`, "Thông tin về hồ sơ" title.
- **Data loss prevention fixes:**
  - Removed `seed()` from `backend/src/main.ts` — seed no longer runs on startup
  - Created `backend/src/seed-cli.ts` — standalone seed script
  - Added `npm run seed` to `backend/package.json`
  - Added `backend/.dockerignore` and `frontend/.dockerignore`
  - Fixed RBAC migration: removed `DROP TABLE users`
  - Fixed UserManagement migration: `ALTER TABLE ADD COLUMN IF NOT EXISTS` + `DROP COLUMN IF EXISTS`
  - Updated `docker-compose.yml`: removed deprecated `version`, `npm install` conditional on `node_modules` existence
- **6 commits pushed to `origin/miryl`** — organised by feature groups
- **`miryl` merged into `main`**, pushed both to origin
- **`deimos0810` merged into `miryl`** — resolved 2 conflicts:
  - `otp.service.ts`: kept deimos0810's version (HTML email templates with VNA logo, `context` param for register/reset)
  - `user.entity.ts`: kept miryl's version (no `lastLoginAt` field)
  - Merge commit `35df759` pushed to `origin/miryl`
- **Logo path fixed:** `backend/assets/logo.png` (copied from `frontend/public/vna-group-logo.png`), path in `otp.service.ts` changed to `process.cwd(), 'assets/logo.png'`
- **Permission entity `type` column reverted from `varchar(20)` to `enum('Group', 'Component')`** — deimos0810 changed to varchar which broke TypeORM `synchronize: true` with existing enum column in DB
- **Commit `6fef87a` pushed to `origin/miryl`** — both fixes (logo path + permission.type enum revert)

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- `Permission.code` naming: `ADMIN_G_GROUP` for groups, `ADMIN_C_RESOURCE_ACTION` for components.
- `synchronize: true` kept for dev speed; migration files provided as reference.
- All list pages follow same structural pattern: header with buttons, table with column headers + filter rows + skeleton row, ToggleSwitch for status columns, SelectionBar, modals with border-intersector style.
- Delete uses `Promise.allSettled` + `ConfirmDeleteDialog` (styled modal) for resilience against partial failures.
- Province selects hardcoded to one option ("Thành phố Hồ Chí Minh") — no province API.
- Form errors displayed inline per-field (red border + text-xs message).
- `roleId`/`titleId` sent as `Number()` from frontend instead of adding `transform: true` to ValidationPipe.
- Avatar upload uses local disk (`/uploads/avatars/{userId}/`) with `Todo: swap to S3`.
- `avatarUrl` stored as relative path; frontend prefixes with `baseUrl`.
- OTP email: deimos0810's approach — HTML templates with VNA Group logo inline, `createTransporter()` with Ethereal fallback when SMTP env vars missing. Subject differs for register vs reset password.
- Docker compose `.env` vars: `MAIL_USER`/`MAIL_PASSWORD` set to empty defaults (`${MAIL_USER:-}`) so only explicit values in `backend/.env` work.
- Industry/Enterprise relation FK columns mapped via relation objects in `create()`/`update()`.
- `.next/` isolated via named Docker volume `next_cache:/app/.next` to prevent cache corruption from host builds.
- All `window.confirm()` replaced with `ConfirmDeleteDialog` (red header, Trash2 icon, Huỷ bỏ/Xoá buttons).
- AttachmentDialog stores file URLs as blob: URLs + keeps `file: File` reference for upload. File picker triggered by button click.
- Enterprise edit mode loads attachments with `{ id, name, fileName, url, size }` — server files have `id`, new files have `file`. Delete queue tracks server IDs to DELETE on confirm.
- EnterpriseStep2: after PUT/POST enterprise, uploads attachments with `file`, deletes queued IDs. Does not re-upload existing server files.
- ConfirmDeleteDialog's `onConfirm` wrapped in `try/finally` to always close the dialog.
- **Seed decoupled from startup**: removed from `main.ts`, runs only via `npm run seed` CLI script.
- **Conflict resolution for deimos0810 merge**: `otp.service.ts` → deimos0810 (HTML templates), `user.entity.ts` → miryl (no lastLoginAt).
- **Permission `type` column kept as `enum`** to match existing DB schema — deimos0810's `varchar(20)` change reverted.

## Next Steps
1. (none — all tasks complete)

## Critical Context
- Backend `main.ts` no longer auto-seeds — seed must be run manually via `docker compose exec backend npm run seed`.
- `PermissionsGuard` registered in `UsersModule.providers`.
- Docker Desktop currently running (postgres, backend, frontend all up).
- Frontend uses `NEXT_PUBLIC_API_URL || 'http://localhost:3001'` for API base URL, `getAuthToken()` from localStorage/sessionStorage for Bearer token.
- Backend `UsersService.create/update` loads Role/Title/Province/District/EnterpriseType entities from DB by ID.
- `JwtAuthGuard` in `backend/src/libs/core/guards/jwt-auth.guard.ts` — verifies JWT + loads User from DB.
- Static files served via `app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })`.
- Docker compose now uses named volume `next_cache:/app/.next` for frontend — host `.next/` ignored.
- `frontend/.dockerignore` and `backend/.dockerignore` exclude `dist/`, `node_modules`, `.next`, `uploads`, `.env`.
- Backend `.env` vars in docker-compose: `MAIL_USER:-` / `MAIL_PASSWORD:-` default to empty.
- Seed data: 59 multi-level industries, 7 enterprise types, 30 HCMC wards, 3 sample enterprises (VNA, An Phát, Sài Gòn).
- Sidebar popup icons: `frontend/public/icons/{profile,key,log-out}.svg`.
- To fully reset dev cache: `docker compose down -v && docker compose up -d` (wipes postgres data + next_cache + rebuilds).
- Enterprise wizard username = taxCode, password = `12345678` fixed (sent in POST/PUT body).
- Current branch `miryl` has `deimos0810` merged in — `otp.service.ts` uses deimos0810's HTML template approach.
- Logo file at `backend/assets/logo.png` (copied from frontend), path in otp.service.ts uses `process.cwd(), 'assets/logo.png'`.
- Permission entity `type` column uses `@Column({ type: 'enum', enum: ['Group', 'Component'] })` to match DB schema.

## Relevant Files
- `frontend/src/libs/tts/components/Sidebar.tsx`: syncs user data from `GET /auth/me`, SVG icons, 401 handling, avatar onError.
- `frontend/src/libs/tts/components/PermissionListPage.tsx`, `RoleListPage.tsx`, `RoleModal.tsx`, `SelectionBar.tsx`, `SuccessToast.tsx`.
- `frontend/src/libs/tts/components/UserListPage.tsx`, `ResetPasswordModal.tsx`, `ChangeEmailModal.tsx`.
- `frontend/app/admin/users/detail/UserDetailClient.tsx`: dual-layout CRUD detail page with email verification.
- `frontend/src/libs/tts/components/UserProfilePopup.tsx`: global popup with change password/email, handles 401.
- `frontend/src/libs/tts/components/EnterpriseTypeListPage.tsx`, `AddEnterpriseTypeModal.tsx`: enterprise types CRUD.
- `frontend/src/libs/tts/components/IndustryListPage.tsx`, `IndustryModal.tsx`: industries CRUD (API-connected).
- `frontend/src/libs/tts/components/EnterpriseListPage.tsx`: fully API-connected (fetch, filter, select-all, delete, toggle, Eye/Pencil/KeyRound buttons).
- `frontend/src/libs/tts/components/EnterpriseModal.tsx`: controlled POST/PUT form with validation.
- `frontend/src/libs/tts/components/EnterpriseStep1.tsx`: wizard step 1 with validation, attachment table, edit mode fetch + loadFromApi, markAttachmentForDelete.
- `frontend/src/libs/tts/components/EnterpriseStep2.tsx`: wizard step 2 — 2-column key-value layout, calls POST/PUT with username=taxCode/password=12345678, handles attachment upload + delete queue.
- `frontend/src/libs/tts/components/AccountInfoModal.tsx`: view enterprise username/password (Eye button).
- `frontend/src/libs/tts/components/EnterpriseResetPasswordModal.tsx`: reset enterprise password (KeyRound button).
- `frontend/src/libs/tts/components/AttachmentDialog.tsx`: file upload modal — "Choose File" button triggers file picker.
- `frontend/src/libs/tts/components/ConfirmDeleteDialog.tsx`: reusable styled delete confirmation — `onConfirm` in try/finally + `setDeleteConfirm` fix for all 5 list pages.
- `frontend/src/libs/tts/contexts/EnterpriseFormContext.tsx`: wizard form state with `deletedAttachmentIds[]`, `markAttachmentForDelete`.
- `frontend/app/admin/enterprises/create/`: wizard stepper + EnterpriseFormProvider + EnterpriseStep1 + EnterpriseStep2.
- `frontend/.dockerignore`, `backend/.dockerignore`: exclude build artifacts and uploads from Docker context.
- `docker-compose.yml`: `next_cache:/app/.next`, conditional `npm install`, no `version` field.
- `backend/src/modules/enterprise-types/`, `industries/`, `enterprises/`: full CRUD modules (entity, DTOs, service, controller, migration, seed).
- `backend/src/modules/enterprises/entities/attachment.entity.ts`: Attachment entity.
- `backend/src/modules/enterprises/enterprises.service.ts`: create/update with FK-to-relation mapping, attachment disk management.
- `backend/src/app.module.ts`: includes `Attachment` entity in TypeORM entities list.
- `backend/src/modules/auth/services/auth.service.ts`: `getProfile()` returns `avatarUrl`, `titleName`, `roleName`; `sendOtpEmail()` with `context` param for register/reset; login with isActive check.
- `backend/src/modules/auth/services/otp.service.ts`: deimos0810's version — HTML templates, `context` param, Ethereal fallback in `createTransporter()`, logo path: `process.cwd(), 'assets/logo.png'`.
- `backend/src/libs/core/guards/jwt-auth.guard.ts`: JWT authentication guard.
- `backend/src/seeds/seed.ts`: seeds all data (roles, permissions, admin user, titles, wards, enterprise types, industries, enterprises).
- `backend/src/seed-cli.ts`: standalone seed script (replaces auto-seed in main.ts).
- `backend/src/migrations/`: 5 migration files — RBAC (fixed: no DROP TABLE users), user management (IF NOT EXISTS), enterprise types, industries, enterprises.
- `backend/src/modules/permissions/entities/permission.entity.ts`: `type` column uses `enum('Group', 'Component')` (reverted from varchar).
- `backend/assets/logo.png`: logo file for OTP email HTML template (copied from frontend public).
- `frontend/public/icons/`: profile.svg, key.svg, log-out.svg (sidebar popup icons).
