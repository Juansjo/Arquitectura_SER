import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './UserProfile.css';

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

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [lo

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await onLogout();
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

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>¡Bienvenido!</h2>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            className="profile-image"
          />
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
      </div>
    </div>
  );
};

export default UserProfile;