import { useState, useEffect, useMemo } from 'react';
import { getAllSessions } from '../services/sessionServices';
import type { SessionLog } from '../types';
import './SessionsPage.css';

const SessionsPage = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Pequeño delay para evitar el desmontaje temprano
    const timer = setTimeout(() => {
      const loadSessions = async () => {
        try {
          setLoading(true);
          console.log('🔄 Cargando sesiones...');
          const data = await getAllSessions();
          console.log('✅ Sesiones cargadas:', data.length);
          setSessions(data);
          setHasLoaded(true);
        } catch (error) {
          console.error('❌ Error cargando sesiones:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadSessions();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log('🔴 Cleanup: componente desmontado');
    };
  }, []);

  const formatDate = (date: Date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '—';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleRefresh = async () => {
    setLoading(true);
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  };

  if (loading && !hasLoaded) {
    return (
      <div className="sessions-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando registros de sesiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>📊 Registro de Sesiones</h2>
        <p>Historial de ingresos a la aplicación</p>
        <button onClick={() => window.location.href = '/'} className="back-button">
          ← Volver al perfil
        </button>
      </div>
      <div className="filters-bar">
        <div className="search-box">
         <button onClick={handleRefresh} className="refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      <div className="sessions-table-wrapper">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Hora de entrada</th>
              <th>Hora de salida</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;