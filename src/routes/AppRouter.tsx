import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PageLoader } from '../components/shared/PageLoader';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { EncargadoLayout } from '../layouts/EncargadoLayout';
import { PublicOnlyGuard } from './PublicOnlyGuard';
import { PublicLayout } from '../layouts/PublicLayout';
import { RoleGuard } from './RoleGuard';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const AdminLoginPage = lazy(
  () => import('../features/auth/pages/AdminLoginPage'),
);

const EncargadoDashboardPage = lazy(
  () => import('../features/dashboard/pages/EncargadoDashboardPage'),
);
const EncargadoPetsPage = lazy(
  () => import('../features/pets/pages/EncargadoPetsPage'),
);

const AdminDashboardPage = lazy(
  () => import('../features/dashboard/pages/AdminDashboardPage'),
);
const AdminUsersPage = lazy(
  () => import('../features/users/pages/AdminUsersPage'),
);
const AdminEstablishmentsPage = lazy(
  () => import('../features/establishments/pages/AdminEstablishmentsPage'),
);
const AdminPetsPage = lazy(
  () => import('../features/pets/pages/AdminPetsPage'),
);

const EncargadoAdoptionsPage = lazy(() => import('../features/adoptions/pages/EncargadoAdoptionsPage'));
const PublicAdoptionsPage = lazy(() => import('../features/adoptions/pages/PublicAdoptionsPage'));

const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const HeatmapPage = lazy(() => import('../features/analitica/pages/HeatmapPage'));
const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const EstablishmentsLandingPage = lazy(() => import('../features/landing/pages/EstablishmentsLandingPage'));
const LegalPage = lazy(() => import('../features/legal/pages/LegalPage'));
const AboutPage = lazy(() => import('../features/about/pages/AboutPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/establecimientos" element={<EstablishmentsLandingPage />} />
            <Route path="/sobre-nosotros" element={<AboutPage />} />
            <Route path="/adopciones" element={<PublicAdoptionsPage />} />
            <Route path="/terminos" element={<LegalPage document="terminos" />} />
            <Route path="/privacidad" element={<LegalPage document="privacidad" />} />
          </Route>
          {/* Rutas Públicas de Autenticación */}
          <Route element={<PublicOnlyGuard />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Route>
          </Route>

          {/* Portal ENCARGADO */}
          <Route element={<RoleGuard allowedRoles={['ENCARGADO']} />}>
            <Route element={<EncargadoLayout />}>
              <Route path="/dashboard" element={<EncargadoDashboardPage />} />
              <Route path="/pets" element={<EncargadoPetsPage />} />
              <Route path="/adoptions" element={<EncargadoAdoptionsPage />} />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Portal ADMIN */}
          <Route
            path="/admin"
            element={<RoleGuard allowedRoles={['ADMIN']} />}
          >
            <Route element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="establishments" element={<AdminEstablishmentsPage />} />
              <Route path="pets" element={<AdminPetsPage />} />
              <Route path="heatmap" element={<HeatmapPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
