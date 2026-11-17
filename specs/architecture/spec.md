# Especificación Funcional: Arquitectura Base y Autenticación por Portales (`smartpet_front`)

## 1. Propósito
Establecer la arquitectura **Feature-Based + Role-Based Routing** para la plataforma web de SmartPet, separando el acceso y navegación del **Encargado** (`/login`, `/register`, `/dashboard`, `/pets`, `/profile`) y del **Administrador** (`/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/pets`, `/admin/profile`) dentro de la misma aplicación React.

## 2. Criterios de Aceptación (CA)
- **CA-01 (Acceso separado por rol):** `LoginPage` (`/login`) solo permite el ingreso de usuarios con rol `ENCARGADO` y redirige a `/dashboard`. `AdminLoginPage` (`/admin/login`) solo permite el ingreso de usuarios con rol `ADMIN` y redirige a `/admin/dashboard`. Si el rol no coincide con el portal, muestra error de acceso y limpia la sesión.
- **CA-02 (Reutilización de LoginForm):** Tanto `/login` como `/admin/login` reutilizan el mismo componente `LoginForm.tsx`.
- **CA-03 (Protección de rutas con RoleGuard):** Un usuario no autenticado que intenta acceder a `/admin/*` es redirigido a `/admin/login`; si intenta acceder a rutas de encargado es redirigido a `/login`. Un `ADMIN` autenticado no puede entrar a rutas de `ENCARGADO` y viceversa.
- **CA-04 (Layouts diferenciados):** `AuthLayout` envuelve las vistas de autenticación; `AdminLayout` y `EncargadoLayout` envuelven sus respectivos portales reutilizando `AppSidebar` y `AppHeader`.
- **CA-05 (Carga diferida):** Todas las páginas principales se cargan bajo demanda mediante `React.lazy` y `Suspense`.
