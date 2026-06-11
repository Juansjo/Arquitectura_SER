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

  // Validación de fortaleza de contraseña (mismos requisitos que RegisterPage)
  const validatePasswordStrength = (pwd: string): { isValid: boolean; errors: string[] } => {
    const errorsList: string[] = [];
    
    if (pwd.length < 10) {
      errorsList.push('• Mínimo 10 caracteres');
    }
    if (!/[A-Z]/.test(pwd)) {
      errorsList.push('• Al menos 1 mayúscula');
    }
    if (!/[a-z]/.test(pwd)) {
      errorsList.push('• Al menos 1 minúscula');
    }
    if (!/[0-9]/.test(pwd)) {
      errorsList.push('• Al menos 1 número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errorsList.push('• Al menos 1 carácter especial (!@#$%^&*)');
    }
    
    return {
      isValid: errorsList.length === 0,
      errors: errorsList
    };
  };

  useEffect(() => {
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
    
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors.join('\n'));
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
        title: '✅ Contraseña Restablecida',
        message: 'Tu contraseña ha sido actualizada exitosamente',
        instructions: 'Ahora puedes iniciar sesión con tu nueva contraseña. Recuerda que debe cumplir con los requisitos de seguridad.'
      });
      setShowModal(true);
      
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/expired-action-code') {
        setError('El enlace ha expirado. Solicita un nuevo restablecimiento.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('El enlace es inválido. Solicita un nuevo restablecimiento.');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es muy débil. Debe cumplir con los requisitos de seguridad.');
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
        
        {error && <div className="error-message" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
        
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
              placeholder="Mínimo 10 caracteres, mayúscula, minúscula, número y especial"
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