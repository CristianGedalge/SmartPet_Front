# Diseño Técnico: Arquitectura Base (`smartpet_front`)

## 1. Mapa de Rutas
- **Públicas (`PublicOnlyGuard` + `AuthLayout`):**
  - `/login` → `LoginPage` (`expectedRole="ENCARGADO"`)
  - `/register` → `RegisterPage`
  - `/admin/login` → `AdminLoginPage` (`expectedRole="ADMIN"`)
- **Portal Encargado (`RoleGuard(['ENCARGADO'])` + `EncargadoLayout`):**
  - `/dashboard` → `EncargadoDashboardPage`
  - `/pets` → `EncargadoPetsPage`
  - `/profile` → `ProfilePage`
- **Portal Administrador (`RoleGuard(['ADMIN'])` + `AdminLayout`):**
  - `/admin/dashboard` → `AdminDashboardPage`
  - `/admin/users` → `AdminUsersPage`
  - `/admin/pets` → `AdminPetsPage`
  - `/admin/profile` → `ProfilePage`

## 2. Integración con Backend (`smartpet_api`)
- Base URL: `VITE_API_URL=http://localhost:3000/api/v1`
- Endpoints de Auth:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /auth/profile`
  - `PATCH /auth/profile`
