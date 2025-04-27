import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomeScreen from './pages/HomeScreen';
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
       {/* 2) Pantalla pública en “/” */}
+     <Route path="/" element={<HomeScreen />}/>
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }/>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


