import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { FirebaseError, ModalData } from '../types';
import './AuthPages.css';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // ============================================
  // OPCIÓN 1: REGISTRO REAL CON FIREBASE
  // ============================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });
      
      await userCredential.user.reload();
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        displayName: formData.name,
        email: formData.email,
        createdAt: new Date(),
        role: 'user'
      });
      
      setModalData({
        title: '✅ ¡Registro Exitoso! (Firebase)',
        message: 'Usuario registrado correctamente en Firebase',
        userData: {
          nombre: formData.name,
          email: formData.email,
          uid: userCredential.user.uid
        }
      });
      setShowModal(true);
      
      setTimeout(() => {
        setShowModal(false);
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Error completo:', error);
      
      let errorMessage = 'Error al registrar usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email ya está registrado';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del email no es válido';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'El registro con email/password no está habilitado';
          break;
        default:
          errorMessage = `Error: ${error.message || 'Error desconocido'}`;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // OPCIÓN 2: REGISTRO DEMO (SIMULADO)
  // ============================================
  const handleDemoRegister = () => {
    // Validar el formulario igual que en registro real
    if (!validateForm()) return;
    
    // Mostrar modal con datos simulados
    setModalData({
      title: '🎭 DEMO - Registro Simulado',
      message: 'Registro simulado exitosamente (sin conexión a Firebase)',
      userData: {
        nombre: formData.name,
        email: formData.email,
        uid: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      }
    });
    setShowModal(true);
    
    // Guardar en localStorage para referencia (opcional)
    const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    demoUsers.push({
      name: formData.name,
      email: formData.email,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
    
    setTimeout(() => {
      setShowModal(false);
      navigate('/login');
    }, 3000);
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        <p>Regístrate para comenzar</p>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ingresa tu nombre"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          {/* Botón registro real con Firebase */}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Registrando...' : '✅ Registrarse (Firebase real)'}
          </button>
          
          {/* Botón registro DEMO simulado */}
          <button 
            type="button"
            onClick={handleDemoRegister}
            disabled={loading}
            className="submit-button demo-button"
            style={{ 
              background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
              marginTop: '12px'
            }}
          >
            🎭 DEMO - Simular registro (sin Firebase)
          </button>
        </form>
        
        <div className="divider">
          <span>Nota</span>
        </div>
        
        <div className="auth-links">
          <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
            🔹 <strong>Opción real:</strong> Guarda el usuario en Firebase Autenticación y Firestore.<br />
            🔸 <strong>Opción DEMO:</strong> Solo simula el registro sin conexión a Firebase.
          </p>
          <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        </div>
      </div>
      
      {/* Modal compartido */}
      {showModal && modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalData.title}</h3>
            <p>{modalData.message}</p>
            {modalData.userData && (
              <div className="modal-user-data">
                <p><strong>Nombre:</strong> {modalData.userData.nombre}</p>
                <p><strong>Email:</strong> {modalData.userData.email}</p>
                <p><strong>UID:</strong> {modalData.userData.uid}</p>
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

export default RegisterPage;