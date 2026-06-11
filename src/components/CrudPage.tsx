import { useState, useEffect, useCallback } from 'react';
import { auth } from '../config/firebase';
import { createNote, getUserNotes, updateNote, deleteNote, type Note } from '../services/noteServices';
import './CrudPage.css';

const CrudPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = auth.currentUser;


  const loadNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const notesList = await getUserNotes(user.uid);
      setNotes(notesList);
    } catch (err) {
      console.error('Error cargando notas:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);


  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, loadNotes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingNote(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('El contenido es obligatorio');
      return;
    }
    
    try {
      if (editingNote) {
        // Actualizar nota existente
        await updateNote(editingNote.id!, {
          title: formData.title,
          content: formData.content
        });
        setSuccess('✅ Nota actualizada exitosamente');
      } else {
        // Crear nueva nota
        await createNote({
          title: formData.title,
          content: formData.content,
          userId: user!.uid,
          userName: user!.displayName || ''
        }, user!);
        setSuccess('✅ Nota creada exitosamente');
      }
      
      // Limpiar formulario y recargar
      resetForm();
      setShowModal(false);
      await loadNotes();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al guardar la nota');
      console.error(err);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content
    });
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota?')) {
      try {
        await deleteNote(noteId);
        setSuccess('🗑️ Nota eliminada exitosamente');
        await loadNotes();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error al eliminar la nota');
        console.error(err);
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (date: Date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="crud-container">
        <div className="loading-spinner">Cargando notas...</div>
      </div>
    );
  }

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>📝 Mis Notas</h2>
        <p>Gestiona tus notas personales</p>
        <button onClick={openCreateModal} className="create-button">
          ➕ Crear nueva nota
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>📭 No tienes notas aún</p>
          <p>Haz clic en "Crear nueva nota" para comenzar</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                  <button onClick={() => handleEdit(note)} className="edit-btn" title="Editar">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(note.id!)} className="delete-btn" title="Eliminar">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="note-content">
                <p>{note.content}</p>
              </div>
              <div className="note-footer">
                <span>Creado: {formatDate(note.createdAt)}</span>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <span>Editado: {formatDate(note.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar nota */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-crud" onClick={(e) => e.stopPropagation()}>
            <h3>{editingNote ? '✏️ Editar Nota' : '➕ Nueva Nota'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ingresa el título"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Contenido</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Escribe tu nota aquí..."
                  rows={6}
                />
              </div>
              {error && <div className="error-text">{error}</div>}
              <div className="modal-buttons">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  {editingNote ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudPage;