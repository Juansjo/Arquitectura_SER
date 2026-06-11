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


export interface SessionLog {
  id?: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  loginTime: Date;
  logoutTime?: Date | null;
  sessionDuration?: number;
  authMethod: 'email' | 'google' | 'github' | 'facebook';
  status: 'active' | 'closed';
  userPhotoURL?: string | null;
}

const SESSIONS_COLLECTION = 'sessions';


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
    const userName = user.displayName || user.email?.split('@')[0] || 'Usuario';
    
    const sessionData = {
      userId: user.uid,
      userName: userName,
      userEmail: user.email,
      loginTime: Timestamp.fromDate(new Date()),
      authMethod: authMethod,
      status: 'active',
      userPhotoURL: user.photoURL || null
    };

    console.log('📝 Registrando nueva sesión:', sessionData);
    
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
    localStorage.setItem('currentSessionId', docRef.id);
    
    console.log('✅ Sesión registrada:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error registrando login:', error);
    return '';
  }
};

// Registrar cierre de sesión
export const registerLogout = async (userId: string): Promise<void> => {
  try {
    console.log('🔍 Buscando sesión activa para usuario:', userId);
    
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
      
      await updateDoc(doc(db, SESSIONS_COLLECTION, sessionDoc.id), {
        logoutTime: Timestamp.fromDate(logoutTime),
        sessionDuration: sessionDuration,
        status: 'closed'
      });
      
      localStorage.removeItem('currentSessionId');
      console.log('✅ Sesión cerrada, duración:', sessionDuration, 'segundos');
    } else {
      console.warn('⚠️ No se encontró sesión activa para el usuario:', userId);
    }
  } catch (error) {
    console.error('❌ Error registrando logout:', error);
  }
};

// Obtener todas las sesiones
export const getAllSessions = async (): Promise<SessionLog[]> => {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const sessionsQuery = query(sessionsRef, orderBy('loginTime', 'desc'));
    const querySnapshot = await getDocs(sessionsQuery);
    
    console.log(`📊 Documentos encontrados: ${querySnapshot.size}`);
    
    let activeCount = 0;
    let closedCount = 0;
    
    const sessions: SessionLog[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreSessionData;
      
      // 👇 FORZAR EL TIPO CORRECTO PARA STATUS
      let status: 'active' | 'closed' = 'active';
      if (data.status === 'closed') {
        status = 'closed';
      } else if (data.logoutTime) {
        status = 'closed';
      } else {
        status = 'active';
      }
      
      if (status === 'active') activeCount++;
      if (status === 'closed') closedCount++;
      
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        loginTime: data.loginTime.toDate(),
        logoutTime: data.logoutTime?.toDate(),
        sessionDuration: data.sessionDuration,
        authMethod: data.authMethod as SessionLog['authMethod'],
        status: status,  // 👈 AHORA ES DEL TIPO CORRECTO
        userPhotoURL: data.userPhotoURL
      };
    });
    
    console.log(`📊 Estadísticas: Total=${sessions.length}, Activas=${activeCount}, Finalizadas=${closedCount}`);
    
    return sessions;
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    return [];
  }
};