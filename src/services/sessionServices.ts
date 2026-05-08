import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc,
  Timestamp,
  limit
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

const SESSIONS_COLLECTION = 'sessions';

// Tipo para los datos de Firestore
interface FirestoreSessionData {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  loginTime: Timestamp;
  logoutTime?: Timestamp | null;
  sessionDuration?: number;
  authMethod: string;
  status: string;
  userPhotoURL?: string | null;
}

// Registrar inicio de sesión
export const registerLogin = async (
  user: User, 
  authMethod: SessionLog['authMethod']
): Promise<string> => {
  try {
    //CALCULAR EL NOMBRE CORRECTAMENTE
    const userName = user.displayName || user.email?.split('@')[0] || 'Usuario';
    
    const sessionData: Omit<SessionLog, 'id'> = {
      userId: user.uid,
      userName: userName,
      userEmail: user.email,
      loginTime: new Date(),
      authMethod: authMethod,
      status: 'active',
      userPhotoURL: user.photoURL
    };

    console.log('📝 Registrando nueva sesión:', sessionData);
    
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      ...sessionData,
      loginTime: Timestamp.fromDate(sessionData.loginTime)
    });
    
    localStorage.setItem('currentSessionId', docRef.id);
    
    console.log('Sesión registrada:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error registrando login:', error);
    return '';
  }
};
// Registrar cierre de sesión
export const registerLogout = async (userId: string): Promise<void> => {
  try {
    console.log('🔍 Buscando sesión activa para usuario:', userId);
    
    // Buscar sesión activa del usuario
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const sessionQuery = query(
      sessionsRef,
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('loginTime', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(sessionQuery);
    
    console.log('📊 Sesiones activas encontradas:', querySnapshot.size);
    
    if (!querySnapshot.empty) {
      const sessionDoc = querySnapshot.docs[0];
      const data = sessionDoc.data();
      const loginTime = data.loginTime.toDate();
      const logoutTime = new Date();
      const sessionDuration = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000);
      
      console.log(' Login time:', loginTime);
      console.log(' Logout time:', logoutTime);
      console.log(' Duración:', sessionDuration, 'segundos');
      
      await updateDoc(doc(db, SESSIONS_COLLECTION, sessionDoc.id), {
        logoutTime: Timestamp.fromDate(logoutTime),
        sessionDuration: sessionDuration,
        status: 'closed'
      });
      
      localStorage.removeItem('currentSessionId');
      console.log(' Sesión cerrada registrada correctamente');
    } else {
      console.warn('No se encontró sesión activa para el usuario:', userId);
    }
  } catch (error) {
    console.error(' Error registrando logout:', error);
  }
};

// Obtener historial de sesiones con filtros
export const getSessionsHistory = async (
  
  _lastDoc?: unknown, // Prefijo _ para indicar que no se usa
  pageSize: number = 10
): Promise<{ sessions: SessionLog[]; lastVisible: unknown }> => {
 
    // Construir consulta base
    const sessionsQuery = query(
      collection(db, SESSIONS_COLLECTION),
      orderBy('loginTime', 'desc')
    );
  
    
    // Paginación
    const paginatedSessions = sessions.slice(0, pageSize);
    const lastVisible = sessions[pageSize] || null;
    
    return {
      sessions: paginatedSessions,
      lastVisible
    };
};

// Obtener todas las sesiones
export const getAllSessions = async (): Promise<SessionLog[]> => {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const sessionsQuery = query(sessionsRef, orderBy('loginTime', 'desc'));
    const querySnapshot = await getDocs(sessionsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreSessionData;
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        loginTime: data.loginTime.toDate(),
        logoutTime: data.logoutTime?.toDate(),
        sessionDuration: data.sessionDuration,
        authMethod: data.authMethod as SessionLog['authMethod'],
        userPhotoURL: data.userPhotoURL
      };
    });
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    return [];
  }
};