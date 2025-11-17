import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem('clientes');
    return saved ? JSON.parse(saved) : [
      {id: 1, nombre: "Juan Pérez", empresa: "Tech Solutions", email: "juan@empresa.com", status: "Activo"},
      {id: 2, nombre: "María García", empresa: "Startup Inc", email: "maria@startup.com", status: "Activo"},
      {id: 3, nombre: "Pedro López", empresa: "Design Studio", email: "pedro@design.com", status: "Prospecto"},
      {id: 4, nombre: "Ana Martínez", empresa: "Marketing Pro", email: "ana@marketing.com", status: "Inactivo"}
    ];
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    empresa: '',
    email: '',
    status: 'Prospecto'
  });

  const [filtro, setFiltro] = useState('Todos');

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  // Filtrar clientes
  const clientesFiltrados = filtro === 'Todos' 
    ? clientes 
    : clientes.filter(c => c.status === filtro);

  // Agregar cliente
  const agregarCliente = (e) => {
    e.preventDefault();
    
    const clienteCompleto = {
      id: Date.now(),
      ...nuevoCliente
    };

    setClientes([...clientes, clienteCompleto]);
    
    setNuevoCliente({
      nombre: '',
      empresa: '',
      email: '',
      status: 'Prospecto'
    });
    
    setMostrarFormulario(false);
  };

  // Eliminar cliente
  const eliminarCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  // Calcular estadísticas
  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(c => c.status === "Activo").length;
  const clientesProspectos = clientes.filter(c => c.status === "Prospecto").length;
  const clientesInactivos = clientes.filter(c => c.status === "Inactivo").length;

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="titulo">Mi CRM</h1>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn-agregar"
        >
          {mostrarFormulario ? 'Cancelar' : '+ Agregar Cliente'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-container">
          <h2 className="formulario-titulo">Nuevo Cliente</h2>
          <form onSubmit={agregarCliente}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Nombre completo"
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                required
                className="form-input"
              />
              
              <input
                type="text"
                placeholder="Empresa"
                value={nuevoCliente.empresa}
                onChange={(e) => setNuevoCliente({...nuevoCliente, empresa: e.target.value})}
                required
                className="form-input"
              />
              
              <input
                type="email"
                placeholder="Email"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                required
                className="form-input"
              />
              
              <select
                value={nuevoCliente.status}
                onChange={(e) => setNuevoCliente({...nuevoCliente, status: e.target.value})}
                className="form-input"
              >
                <option value="Prospecto">Prospecto</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            
            <button type="submit" className="btn-guardar">
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="estadisticas-container">
        <div className="stat-card">
          <p className="stat-label">Total</p>
          <p className="stat-numero">{totalClientes}</p>
        </div>
        
        <div className="stat-card stat-activo">
          <p className="stat-label">Activos</p>
          <p className="stat-numero">{clientesActivos}</p>
        </div>
        
        <div className="stat-card stat-prospecto">
          <p className="stat-label">Prospectos</p>
          <p className="stat-numero">{clientesProspectos}</p>
        </div>
        
        <div className="stat-card stat-inactivo">
          <p className="stat-label">Inactivos</p>
          <p className="stat-numero">{clientesInactivos}</p>
        </div>
      </div>

      <div className="filtros-container">
        {['Todos', 'Activo', 'Prospecto', 'Inactivo'].map(f => (
          <button 
            key={f}
            onClick={() => setFiltro(f)}
            className={`btn-filtro ${filtro === f ? 'activo' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="cliente-card">
            <button 
              onClick={() => eliminarCliente(cliente.id)}
              className="btn-eliminar"
              title="Eliminar cliente"
            >
              ✕
            </button>
            <h3 className="cliente-nombre">{cliente.nombre}</h3>
            <p className="cliente-empresa">{cliente.empresa}</p>
            <p className="cliente-email">{cliente.email}</p>
            <span className={`badge-${cliente.status.toLowerCase()}`}>
              {cliente.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;