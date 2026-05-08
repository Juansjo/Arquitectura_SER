import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPage from './components/ForgotPage';
import ResetPage from './components/ResetPage';
import UserProfile from './components/UserProfile';
import SessionsPage from './components/SessionsPage';
import { registerLogout } from './services/sessionServices';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      if (user) {
        console.log('Registrando cierre de sesión para:', user.uid);
        await registerLogout(user.uid);
        console.log('Cierre de sesión registrado');
      }
      await auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPage /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={!user ? <ResetPage /> : <Navigate to="/" />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={user ? <UserProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/sessions" element={user ? <SessionsPage /> : <Navigate to="/login" />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;