import type { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
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
}

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
            uid: user.uid
          });
        } else {
          // Si no hay datos en Firestore, usar los de Auth
          setUserData({
            name: user.displayName ?? undefined,
            displayName: user.displayName ?? undefined,
            email: user.email ?? undefined,
            uid: user.uid
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({
          name: user.displayName ?? undefined,
          displayName: user.displayName ?? undefined,
          email: user.email ?? undefined,
          uid: user.uid
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
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

  // Determinar el nombre a mostrar
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
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserProfile;