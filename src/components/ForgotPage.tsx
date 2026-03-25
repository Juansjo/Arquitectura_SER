import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { FirebaseError, ModalData } from '../types';
import './AuthPages.css';

const ForgotPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const validateEmail = (): boolean => {
    if (!email) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email no válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      
      setModalData({
        title: 'Correo Enviado',
        message: `Se ha enviado un enlace de recuperación a ${email}`,
        instructions: 'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.'
      });
      setShowModal(true);
      
      // Redirigir después de 5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo electrónico');
      } else {
        setError('Error al enviar el correo. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        <p>Ingresa tu email para recibir un enlace de recuperación</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="ejemplo@correo.com"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Volver al inicio de sesión</Link>
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
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
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPage;