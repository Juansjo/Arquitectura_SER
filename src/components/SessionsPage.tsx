import { useState, useEffect, useMemo } from 'react';
import type { SessionLog } from '../types';

const SessionsPage = () => {
  const [sessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Pequeño delay para evitar el desmontaje temprano
    const timer = setTimeout(() => {
      const loadSessions = async () => {
        try {
          setLoading(true);
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

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        (session.userName?.toLowerCase().includes(term) || false) ||
        (session.userEmail?.toLowerCase().includes(term) || false)
      );
    }

    if (filterMethod !== 'todos') {
      filtered = filtered.filter(session => session.authMethod === filterMethod);
    }

    if (filterStatus !== 'todos') {
      filtered = filtered.filter(session => session.status === filterStatus);
    }

    return filtered;
  }, [sessions, searchTerm, filterMethod, filterStatus]);

  const stats = useMemo(() => ({
    total: filteredSessions.length,
    active: filteredSessions.filter(s => s.status === 'active').length,
    closed: filteredSessions.filter(s => s.status === 'closed').length
  }), [filteredSessions]);

  
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

        

        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Actualizar
        </button>
      </div>

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

      <div className="sessions-table-wrapper">
        <table className="sessions-table">
          <thead>
            <tr>
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