import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, AuthProvider } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, githubProvider } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';
import type { FirebaseError, ModalData } from '../types';
import './AuthPages.css';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email no válido');
      return false;
    }
    return true;
  };

  const saveUserToFirestore = async (user: User, provider: string): Promise<void> => {
  try {
    // Verificar si el usuario ya existe en Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Si no existe, crearlo
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        name: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        provider: provider,
        createdAt: new Date()
      });
    } else {
      // Si existe, solo actualizar lastLogin
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
        provider: provider
      }, { merge: true });
    }
  } catch (err) {
    console.error('Error guardando usuario:', err);
  }
};

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await saveUserToFirestore(userCredential.user, 'email');
      
      setModalData({
        title: '¡Bienvenido!',
        message: `Inicio de sesión exitoso`,
        userData: {
          nombre: userCredential.user.displayName || formData.email,
          email: userCredential.user.email || ''
        }
      });
      setShowModal(true);
      
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 2000);
      
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: AuthProvider, providerName: string): Promise<void> => {
  setLoading(true);
  setError('');
  
  try {
    const result = await signInWithPopup(auth, provider);
    await saveUserToFirestore(result.user, providerName);
    
    setModalData({
      title: '¡Bienvenido!',
      message: `Inicio de sesión exitoso con ${providerName}`,
      userData: {
        nombre: result.user.displayName || '',
        email: result.user.email || '',
        provider: providerName
      }
    });
    setShowModal(true);
    
    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2000);
    
  } catch (err) {
    const error = err as FirebaseError;
    console.error('Error completo de autenticación:', error);
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    
    // Manejo específico de errores de GitHub
    if (error.code === 'auth/account-exists-with-different-credential') {
      setError('Ya existe una cuenta con el mismo email pero diferente proveedor. Inicia sesión con el método que usaste originalmente.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      setError('La ventana de autenticación fue cerrada antes de completar el proceso.');
    } else if (error.code === 'auth/unauthorized-domain') {
      setError('El dominio no está autorizado. Agrega localhost a los dominios autorizados en Firebase Console.');
    } else if (error.code === 'auth/operation-not-allowed') {
      setError('La autenticación con GitHub no está habilitada. Habilítala en Firebase Console.');
    } else if (error.code === 'auth/invalid-oauth-provider') {
      setError('Configuración de OAuth inválida. Verifica Client ID y Client Secret.');
    } else {
      setError(`Error al autenticar con ${providerName}: ${error.message || error.code}`);
    }
  } finally {
    setLoading(false);
  }
};

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          <div className="forgot-link">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        
        <div className="divider">
          <span>O continúa con</span>
        </div>
        
        <div className="social-buttons">
          <button 
            onClick={() => handleSocialLogin(googleProvider, 'Google')}
            disabled={loading}
            className="social-button google"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Google
          </button>
          
          <button 
            onClick={() => handleSocialLogin(facebookProvider, 'Facebook')}
            disabled={loading}
            className="social-button facebook"
          >
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
            Facebook
          </button>
          
          <button 
            onClick={() => handleSocialLogin(githubProvider, 'GitHub')}
            disabled={loading}
            className="social-button github"
          >
            <img src="https://github.com/favicon.ico" alt="GitHub" />
            GitHub
          </button>
        </div>
        
        <div className="auth-links">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
      
      {/* Modal de éxito */}
      {showModal && modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalData.title}</h3>
            <p>{modalData.message}</p>
            {modalData.userData && (
              <div className="modal-user-data">
                <p><strong>Nombre:</strong> {modalData.userData.nombre}</p>
                <p><strong>Email:</strong> {modalData.userData.email}</p>
                {modalData.userData.provider && (
                  <p><strong>Proveedor:</strong> {modalData.userData.provider}</p>
                )}
              </div>
            )}
            <button onClick={closeModal} className="modal-button">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;