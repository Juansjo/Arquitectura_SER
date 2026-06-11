import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

export interface Note {
  id?: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const NOTES_COLLECTION = 'notes';

// Crear nota
export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, user: User): Promise<string> => {
  try {
    const noteData = {
      ...note,
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Usuario',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteData);
    console.log('✅ Nota creada:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creando nota:', error);
    throw error;
  }
};

// Obtener todas las notas del usuario
export const getUserNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    const q = query(
      notesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        userId: data.userId,
        userName: data.userName,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Note;
    });
  } catch (error) {
    console.error('Error obteniendo notas:', error);
    return [];
  }
};

// Actualizar nota
export const updateNote = async (noteId: string, updates: { title?: string; content?: string }): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Nota actualizada:', noteId);
  } catch (error) {
    console.error('❌ Error actualizando nota:', error);
    throw error;
  }
};

// Eliminar nota
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteRef);
    console.log('✅ Nota eliminada:', noteId);
  } catch (error) {
    console.error('❌ Error eliminando nota:', error);
    throw error;
  }
};