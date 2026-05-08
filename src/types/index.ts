import type { User } from 'firebase/auth';

export interface FirebaseError {
  code: string;
  message: string;
}

export interface ModalData {
  title: string;
  message: string;
  instructions?: string;
  userData?: {
    nombre?: string;
    email?: string;
    uid?: string;
    provider?: string;
  };
}

export interface FormData {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: Date;
  provider?: string;
  name?: string;
  role?: string;
  createdAt?: Date;
}


export interface SessionLog {
  id?: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  loginTime: Date;
  logoutTime?: Date | null;
  sessionDuration?: number; // en segundos
  authMethod: 'email' | 'google' | 'github' | 'facebook';
  status: 'active' | 'closed';
  userPhotoURL?: string | null;
}


