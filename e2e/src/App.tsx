import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedLayout from './components/ProtectedLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RequestTrip from './pages/RequestTrip';
import TripDetail from './pages/TripDetail';
import History from './pages/History';
import './App.css';

function RoleDashboard() {
  const { user } = useAuth();
  if (user?.role === 'DRIVER') return <DriverDashboard />;
  return <PassengerDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/request-trip" element={<RequestTrip />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/history" element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
