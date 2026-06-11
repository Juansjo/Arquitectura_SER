import type { User } from 'firebase/auth';
import { linkWithPopup, AuthProvider } from 'firebase/auth';
import { auth, googleProvider, githubProvider, facebookProvider } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { useEffect, useState } from 'react';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

interface UserData {
  name?: string;
  displayName?: string;
  email?: string;
  uid?: string;
  photoUrl?: string;
}

interface FirebaseLinkError {
  code: string;
  message: string;
}

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name ?? data.displayName ?? user.displayName ?? undefined,
            displayName: data.displayName ?? user.displayName ?? undefined,
            email: data.email ?? user.email ?? undefined,
            uid: user.uid,
            photoUrl: data.photoURL ?? user.photoURL ?? undefined
          });
        } else {
          setUserData({
            name: user.displayName ?? undefined,
            displayName: user.displayName ?? undefined,
            email: user.email ?? undefined,
            uid: user.uid,
            photoUrl: user.photoURL ?? undefined
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({
          name: user.displayName ?? undefined,
          displayName: user.displayName ?? undefined,
          email: user.email ?? undefined,
          uid: user.uid,
          photoUrl: user.photoURL ?? undefined
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await onLogout();
  };

  const linkAccount = async (provider: AuthProvider, providerName: string) => {
    setLinking(providerName);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('No hay usuario logueado');
        return;
      }

      await linkWithPopup(currentUser, provider);
      alert(`✅ Cuenta de ${providerName} vinculada exitosamente`);

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const existingProviders = userDoc.exists() ? userDoc.data().linkedProviders || [] : [];
      const providers = [...new Set([...existingProviders, providerName])];

      await setDoc(userRef, {
        linkedProviders: providers,
        lastLinked: new Date()
      }, { merge: true });

    } catch (err) {
      const error = err as FirebaseLinkError;
      if (error.code === 'auth/provider-already-linked') {
        alert(`⚠️ La cuenta de ${providerName} ya está vinculada`);
      } else if (error.code === 'auth/credential-already-in-use') {
        alert(`⚠️ Esta cuenta ya está vinculada a otro usuario`);
      } else {
        alert(`❌ Error: ${error.message || 'No se pudo vincular la cuenta'}`);
      }
    } finally {
      setLinking(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="loading-spinner">Cargando datos...</div>
        </div>
      </div>
    );
  }

  const displayName = userData?.name || userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Usuario';
  const profilePhoto = userData?.photoUrl || user.photoURL;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>¡Bienvenido!</h2>
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="profile-image"
          />
        ) : (
          <div className="profile-image-placeholder">👤</div>
        )}

        <div className="user-info">
          <p><strong>Nombre:</strong> {displayName}</p>
          <p><strong>Email:</strong> {user.email || 'No disponible'}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </div>

        <Link to="/sessions" className="sessions-button">
          📊 Ver registro de sesiones
        </Link>

        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
        <div className="link-section">
  <h4 style={{ marginBottom: '10px', color: '#333', textAlign: 'center' }}>🔗 Vincular otras cuentas</h4>
  <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '15px' }}>
    Vincula tu cuenta para poder iniciar sesión con cualquiera de estos métodos
  </p>
  
  <div className="link-buttons">
    <button 
      onClick={() => linkAccount(googleProvider, 'Google')} 
      className="link-btn-social google"
      disabled={linking !== null}
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" />
      <span>{linking === 'Google' ? 'Vinculando...' : 'Vincular Google'}</span>
    </button>
    
    <button 
      onClick={() => linkAccount(githubProvider, 'GitHub')} 
      className="link-btn-social github"
      disabled={linking !== null}
    >
      <img src="https://github.com/favicon.ico" alt="GitHub" />
      <span>{linking === 'GitHub' ? 'Vinculando...' : 'Vincular GitHub'}</span>
    </button>
    
    <button 
      onClick={() => linkAccount(facebookProvider, 'Facebook')} 
      className="link-btn-social facebook"
      disabled={linking !== null}
    >
      <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
      <span>{linking === 'Facebook' ? 'Vinculando...' : 'Vincular Facebook'}</span>
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default UserProfile;