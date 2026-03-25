import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Reemplaza con TU configuración de Firebase
const firebaseConfig = {
 apiKey: "AIzaSyDMy8f5IUJCgK3rzZyqZUUzZZ85CF7eyfM",
  authDomain: "aosparcial.firebaseapp.com",
  projectId: "aosparcial",
  storageBucket: "aosparcial.firebasestorage.app",
  messagingSenderId: "101497469617",
  appId: "1:101497469617:web:1f9c5378d9ddd44b3dc090",
  measurementId: "G-E4E5KH11J6"
};

// Verificar que la configuración existe
if (!firebaseConfig.projectId || firebaseConfig.projectId === "tu-proyecto-id") {
  console.error("❌ ERROR: Firebase configuration is missing or incorrect");
  console.error("Please update firebaseConfig in src/config/firebase.ts with your project details");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();

export { sendPasswordResetEmail, confirmPasswordReset };