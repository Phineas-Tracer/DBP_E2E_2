import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedLayout } from './components/ProtectedLayout';
import Login from './pages/Login';
import RegisterPage from './pages/Register';
import PassengerDashboard from './pages/PassengerDashboard';
import RequestTrip from './pages/RequestTrip';
import DriverDashboard from './pages/DriverDashboard';
import TripDetail from './pages/TripDetail';
import History from './pages/History';

/** Envía a cada usuario a su panel según su rol, o a /login si no hay sesión. */
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'PASSENGER' ? '/passenger' : '/driver'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas para cualquier usuario autenticado, sin restricción de rol */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/history" element={<History />} />
          </Route>

          {/* Rutas solo para PASSENGER */}
          <Route element={<ProtectedLayout allowedRoles={['PASSENGER']} />}>
            <Route path="/passenger" element={<PassengerDashboard />} />
            <Route path="/request-trip" element={<RequestTrip />} />
          </Route>

          {/* Rutas solo para DRIVER */}
          <Route element={<ProtectedLayout allowedRoles={['DRIVER']} />}>
            <Route path="/driver" element={<DriverDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}