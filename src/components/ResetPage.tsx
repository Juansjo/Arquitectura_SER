import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { FirebaseError, ModalData } from '../types';
import './AuthPages.css';

const ResetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [oobCode, setOobCode] = useState('');

  useEffect(() => {
    // Obtener el código de verificación de la URL
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      setError('Enlace de recuperación inválido');
    }
  }, [searchParams]);

  const validatePassword = (): boolean => {
    if (!password) {
      setError('La contraseña es obligatoria');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    if (!oobCode) {
      setError('Enlace de recuperación inválido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await confirmPasswordReset(auth, oobCode, password);
      
      setModalData({
        title: 'Contraseña Restablecida',
        message: 'Tu contraseña ha sido actualizada exitosamente',
        instructions: 'Ahora puedes iniciar sesión con tu nueva contraseña.'
      });
      setShowModal(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/expired-action-code') {
        setError('El enlace ha expirado. Solicita un nuevo restablecimiento.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('El enlace es inválido. Solicita un nuevo restablecimiento.');
      } else {
        setError('Error al restablecer la contraseña. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  if (!oobCode && !error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner">Validando enlace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Restablecer Contraseña</h2>
        <p>Ingresa tu nueva contraseña</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Repite tu nueva contraseña"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
      
      {/* Modal de éxito */}
      {showModal && modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalData.title}</h3>
            <p>{modalData.message}</p>
            {modalData.instructions && (
              <p className="modal-instructions">{modalData.instructions}</p>
            )}
            <button onClick={closeModal} className="modal-button">
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPage;