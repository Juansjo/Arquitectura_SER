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
import { useState, useEffect, useMemo } from 'react';
import { getAllSessions } from '../services/sessionServices';
import type { SessionLog } from '../types';
import './SessionsPage.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  // Estadísticas
  const stats = useMemo(() => ({
    total: filteredSessions.length,
    active: filteredSessions.filter(s => s.status === 'active').length,
    closed: filteredSessions.filter(s => s.status === 'closed').length
  }), [filteredSessions]);

  
  // funcion para exportar pdf
  
  const exportToPDF = () => {
    // Crear documento PDF
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Título
    doc.setFontSize(18);
    doc.setTextColor(102, 126, 234);
    doc.text('📊 Reporte de Sesiones', 14, 20);
    
    // Subtítulo
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 14, 30);
    doc.text(`Total de registros: ${filteredSessions.length}`, 14, 36);
    doc.text(`Sesiones activas: ${stats.active} | Finalizadas: ${stats.closed}`, 14, 42);
    
    // Filtros aplicados
    let filtrosTexto = 'Filtros: ';
    if (searchTerm) filtrosTexto += `Búsqueda: "${searchTerm}" | `;
    if (filterMethod !== 'todos') filtrosTexto += `Método: ${filterMethod} | `;
    if (filterStatus !== 'todos') filtrosTexto += `Estado: ${filterStatus}`;
    if (filtrosTexto === 'Filtros: ') filtrosTexto = 'Filtros: Ninguno';
    
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(filtrosTexto, 14, 50);
    
    // Preparar datos para la tabla
    const tableColumnas = [
      'Usuario',
      'Email',
      'Método',
      'Hora Entrada',
      'Hora Salida',
      'Duración',
      'Estado'
    ];
    
    const tableDatos = filteredSessions.map(session => [
      session.userName || '—',
      session.userEmail || '—',
      session.authMethod,
      formatDate(session.loginTime),
      session.logoutTime ? formatDate(session.logoutTime as Date) : '—',
      formatDuration(session.sessionDuration),
      session.status === 'active' ? 'Activa' : 'Finalizada'
    ]);
    
    // Generar tabla
    autoTable(doc, {
      startY: 55,
      head: [tableColumnas],
      body: tableDatos,
      theme: 'striped',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      }
    });
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} - Sistema de Autenticación`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Guardar PDF
    doc.save(`sesiones_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`);
  };

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

   const fixSessionsStatus = async () => {
    try {
      // Importar dinámicamente las funciones necesarias
      const { collection, getDocs, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const sessionsRef = collection(db, 'sessions');
      const snapshot = await getDocs(sessionsRef);
      
      console.log(`📊 Total sesiones: ${snapshot.size}`);
      
      let updated = 0;
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        let newStatus = data.status;
        
        if (!data.status || (data.status !== 'active' && data.status !== 'closed')) {
          newStatus = data.logoutTime ? 'closed' : 'active';
          await updateDoc(docSnap.ref, { status: newStatus });
          console.log(`✅ Actualizada: ${docSnap.id} → ${newStatus}`);
          updated++;
        }
      }
      
      alert(`✅ Proceso completado: ${updated} sesiones actualizadas. Recarga la página.`);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al corregir sesiones');
    }
  };

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>📊 Registro de Sesiones</h2>
        <p>Historial de ingresos a la aplicación</p>
        <div className="header-buttons">
          <button onClick={() => window.location.href = '/'} className="back-button">
            ← Volver al perfil
          </button>
          <button onClick={exportToPDF} className="pdf-button">
            📄 Exportar a PDF
          </button>
          <button onClick={fixSessionsStatus} className="fix-button" style={{ background: '#ff9800', marginLeft: '10px' }}>
    🔧 Corregir estados
  </button>
        </div>
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