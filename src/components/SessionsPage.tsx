import { useState, useEffect, useMemo } from 'react';
import { getAllSessions } from '../services/sessionServices';
import type { SessionLog } from '../types';
import './SessionsPage.css';

const SessionsPage = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar sesiones
  useEffect(() => {
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

  // Filtrar sesiones
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Filtrar por búsqueda (nombre o email)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        (session.userName?.toLowerCase().includes(term) || false) ||
        (session.userEmail?.toLowerCase().includes(term) || false)
      );
    }

    // Filtrar por método de autenticación
    if (filterMethod !== 'todos') {
      filtered = filtered.filter(session => session.authMethod === filterMethod);
    }

    // Filtrar por estado
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(session => session.status === filterStatus);
    }

    return filtered;
  }, [sessions, searchTerm, filterMethod, filterStatus]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: filteredSessions.length,
    active: filteredSessions.filter(s => s.status === 'active').length,
    closed: filteredSessions.filter(s => s.status === 'closed').length
  }), [filteredSessions]);

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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'google': return '🔵';
      case 'github': return '⚫';
      case 'facebook': return '🔷';
      case 'email': return '📧';
      default: return '🔐';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <span className="badge active">🟢 Activa</span>
      : <span className="badge closed">🔴 Finalizada</span>;
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

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Método:</label>
          <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="github">GitHub</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Estado:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="active">Activas</option>
            <option value="closed">Finalizadas</option>
          </select>
        </div>

        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Sesiones</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Sesiones Activas</h3>
          <p>{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>Finalizadas</h3>
          <p>{stats.closed}</p>
        </div>
      </div>

      {/* Tabla de sesiones */}
      <div className="sessions-table-wrapper">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Método</th>
              <th>Hora de entrada</th>
              <th>Hora de salida</th>
              <th>Duración</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">No hay registros de sesiones</td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    <div className="user-cell">
                      {session.userPhotoURL && (
                        <img src={session.userPhotoURL} alt="" className="user-avatar" />
                      )}
                      <span>{session.userName || '—'}</span>
                    </div>
                  </td>
                  <td>{session.userEmail || '—'}</td>
                  <td className="method-cell">
                    {getMethodIcon(session.authMethod)} {session.authMethod}
                  </td>
                  <td>{formatDate(session.loginTime)}</td>
                  <td>{formatDate(session.logoutTime as Date)}</td>
                  <td>{formatDuration(session.sessionDuration)}</td>
                  <td>{getStatusBadge(session.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;