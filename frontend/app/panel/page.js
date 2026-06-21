'use client'

import { useEffect, useState } from 'react'

const trabajosDemo = [
  { id: 1, cliente: 'Maria Gonzalez', trabajo: 'Reparacion calefon', comuna: 'Las Condes', fecha: 'Hoy 14:30', estado: 'En progreso', monto: '$45.000' },
  { id: 2, cliente: 'Roberto Sanchez', trabajo: 'Instalacion ducha', comuna: 'Providencia', fecha: 'Manana 10:00', estado: 'Pendiente', monto: '$85.000' },
  { id: 3, cliente: 'Carmen Valdes', trabajo: 'Reparacion caneria', comuna: 'Nunoa', fecha: 'Ayer', estado: 'Completado', monto: '$35.000' },
  { id: 4, cliente: 'Jorge Perez', trabajo: 'Cambio llave paso', comuna: 'Las Condes', fecha: 'Ayer', estado: 'Completado', monto: '$25.000' },
  { id: 5, cliente: 'Richard Martinez', trabajo: 'Instalacion calefon', comuna: 'Vitacura', fecha: '03/06/2026', estado: 'Cotizacion', monto: '$120.000' },
]

const estadoColor = {
  'En progreso': { bg: '#FEF3C7', color: '#92400E' },
  'Pendiente': { bg: '#EEF2FF', color: '#3730A3' },
  'Completado': { bg: '#ECFDF5', color: '#065F46' },
  'Cotizacion': { bg: '#F3F4F6', color: '#374151' },
}

const estadoColorCotizacion = {
  borrador: { bg: '#F3F4F6', color: '#374151' },
  enviada: { bg: '#EEF2FF', color: '#3730A3' },
  aprobada: { bg: '#ECFDF5', color: '#065F46' },
  rechazada: { bg: '#FEE2E2', color: '#991B1B' },
}

const comunas = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
  'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
  'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
  'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
  'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal',
  'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón',
  'Santiago Centro', 'Vitacura', 'Puente Alto', 'San Bernardo'
]

const oficios = ['Gasfitero', 'Electricista', 'Pintor', 'Cerrajero', 'Jardinero', 'Carpintero', 'Albanil', 'Tecnico en climatizacion', 'Técnico en refrigeración', 'Instalador de pisos', 'Techador', 'Plomero', 'Otro']

const itemVacio = () => ({ descripcion: '', cantidad: 1, precio_unitario: '' })

const TIPOS_IMPUESTO = [
  { value: 'ninguno', label: 'Sin impuesto', tasa: 0 },
  { value: 'iva', label: 'IVA 19% (Factura)', tasa: 0.19 },
  { value: 'honorarios', label: 'Retención 15,25% (Boleta honorarios)', tasa: 0.1525 },
]

const TODAS_COMUNAS = 'Todas las comunas de Santiago'

export default function Panel() {
  const [autorizado, setAutorizado] = useState(false)
  const [usuario, setUsuario] = useState({ nombre: '', email: '' })
  const [seccion, setSeccion] = useState('dashboard')

  const [trabajosReal, setTrabajosReal] = useState([])

  const [clientesReal, setClientesReal] = useState([])
  const [showModalCliente, setShowModalCliente] = useState(false)
  const [formCliente, setFormCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' })
  const [clienteEditando, setClienteEditando] = useState(null)

  const [cotizacionesReal, setCotizacionesReal] = useState([])
  const [showModalCotizacion, setShowModalCotizacion] = useState(false)
  const [formCotizacion, setFormCotizacion] = useState({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' })
  const [items, setItems] = useState([itemVacio()])
  const [cotizacionEditando, setCotizacionEditando] = useState(null)
  const [showModalCotizacionEnviada, setShowModalCotizacionEnviada] = useState(false)

  const [solicitudes, setSolicitudes] = useState([])
  const [solicitudesNoLeidas, setSolicitudesNoLeidas] = useState(0)
  const [filtroSolicitudes, setFiltroSolicitudes] = useState('activas')

  const [resenas, setResenas] = useState({ promedio: null, total: 0, resenas: [] })

  const [config, setConfig] = useState(null)
  const [formConfig, setFormConfig] = useState({ oficio: '', descripcion: '', comuna: '', comunas: [], experiencia: '', telefono: '', activo: true })
  const [formPassword, setFormPassword] = useState({ password_actual: '', password_nuevo: '', password_confirmar: '' })
  const [guardandoConfig, setGuardandoConfig] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [msgConfig, setMsgConfig] = useState(null)
  const [msgPassword, setMsgPassword] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [passwordEliminar, setPasswordEliminar] = useState('')
  const [showConfirmEliminar, setShowConfirmEliminar] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.replace('/login'); return }
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/perfil/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if (!res.ok) { localStorage.removeItem('token'); window.location.replace('/login'); return } return res.json() })
      .then(data => {
        if (data) {
          setUsuario(data)
          setAutorizado(true)
          fetch(`${API}/api/mis-solicitudes/`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(s => { setSolicitudes(s); setSolicitudesNoLeidas(s.filter(x => !x.leida && !x.descartada).length) })
        }
      })
      .catch(() => window.location.replace('/login'))
  }, [])

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const token = () => localStorage.getItem('token')
  const headers = () => ({ 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json' })

  async function fetchTrabajos() {
    const res = await fetch(`${API}/api/trabajos/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    setTrabajosReal(await res.json())
  }

  async function cambiarEstadoDirecto(id, nuevoEstado) {
    await fetch(`${API}/api/trabajos/${id}/`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ estado: nuevoEstado }) })
    fetchTrabajos()
  }

  async function fetchClientes() {
    const res = await fetch(`${API}/api/clientes/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    setClientesReal(await res.json())
  }

  async function crearCliente() {
    const res = await fetch(`${API}/api/clientes/`, { method: 'POST', headers: headers(), body: JSON.stringify(formCliente) })
    if (res.ok) {
      setShowModalCliente(false)
      setClienteEditando(null)
      setFormCliente({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' })
      fetchClientes()
    }
  }

  async function editarCliente() {
    const res = await fetch(`${API}/api/clientes/${clienteEditando}/`, { method: 'PATCH', headers: headers(), body: JSON.stringify(formCliente) })
    if (res.ok) { setShowModalCliente(false); setClienteEditando(null); setFormCliente({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' }); fetchClientes() }
  }

  function abrirEditarCliente(c) {
    setFormCliente({ nombre: c.nombre, telefono: c.telefono, email: c.email, direccion: c.direccion, comuna: c.comuna })
    setClienteEditando(c.id)
    setShowModalCliente(true)
  }

  function crearClienteDesdeSolicitud(s) {
    setFormCliente({ nombre: s.nombre_cliente, telefono: s.telefono_cliente, email: s.email_cliente || '', direccion: '', comuna: '' })
    setClienteEditando(null)
    setShowModalCliente(true)
    if (!s.leida) marcarLeida(s.id)
  }

  async function fetchCotizaciones() {
    const res = await fetch(`${API}/api/cotizaciones/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    setCotizacionesReal(await res.json())
  }

  async function crearCotizacion() {
    const itemsValidos = items.filter(i => i.descripcion && i.precio_unitario)
    const incluye_iva = formCotizacion.tipo_impuesto === 'iva'
    const res = await fetch(`${API}/api/cotizaciones/`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ ...formCotizacion, incluye_iva, items: itemsValidos })
    })
    if (res.ok) {
      setShowModalCotizacion(false); setCotizacionEditando(null)
      setFormCotizacion({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' })
      setItems([itemVacio()]); fetchCotizaciones()
    }
  }

  async function editarCotizacion() {
    const itemsValidos = items.filter(i => i.descripcion && i.precio_unitario)
    const tasa = TIPOS_IMPUESTO.find(t => t.value === formCotizacion.tipo_impuesto)?.tasa || 0
    const subtotal = itemsValidos.reduce((acc, i) => acc + (parseInt(i.cantidad) || 1) * (parseInt(i.precio_unitario) || 0), 0)
    const monto = Math.round(subtotal * (1 + tasa))
    const incluye_iva = formCotizacion.tipo_impuesto === 'iva'
    const res = await fetch(`${API}/api/cotizaciones/${cotizacionEditando}/`, {
      method: 'PATCH', headers: headers(),
      body: JSON.stringify({ ...formCotizacion, incluye_iva, monto })
    })
    if (res.ok) {
      setShowModalCotizacion(false); setCotizacionEditando(null)
      setFormCotizacion({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' })
      setItems([itemVacio()]); fetchCotizaciones()
    }
  }

  function abrirEditarCotizacion(c) {
    const tipo = c.incluye_iva ? 'iva' : 'ninguno'
    setFormCotizacion({ cliente: c.cliente, descripcion: c.descripcion, detalle: c.detalle || '', incluye_iva: c.incluye_iva, tipo_impuesto: tipo })
    setItems(c.items?.length > 0 ? c.items.map(i => ({ descripcion: i.descripcion, cantidad: i.cantidad, precio_unitario: i.precio_unitario })) : [itemVacio()])
    setCotizacionEditando(c.id)
    setShowModalCotizacion(true)
  }

  async function cambiarEstadoCotizacion(id, nuevoEstado) {
    await fetch(`${API}/api/cotizaciones/${id}/`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ estado: nuevoEstado }) })
    fetchCotizaciones()
    if (nuevoEstado === 'aprobada') fetchTrabajos()
    if (nuevoEstado === 'enviada') setShowModalCotizacionEnviada(true)
  }

  async function fetchSolicitudes() {
    const res = await fetch(`${API}/api/mis-solicitudes/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    const data = await res.json()
    setSolicitudes(data)
    setSolicitudesNoLeidas(data.filter(x => !x.leida && !x.descartada).length)
  }

  async function marcarLeida(id) {
    await fetch(`${API}/api/mis-solicitudes/${id}/leer/`, { method: 'PATCH', headers: headers() })
    fetchSolicitudes()
  }

  async function descartarSolicitud(id) {
    await fetch(`${API}/api/mis-solicitudes/${id}/descartar/`, { method: 'PATCH', headers: headers() })
    fetchSolicitudes()
  }

  async function fetchResenas() {
    const res = await fetch(`${API}/api/mis-resenas/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    setResenas(await res.json())
  }

  async function fetchConfig() {
    const res = await fetch(`${API}/api/configuracion/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    const data = await res.json()
    setConfig(data)
    setFormConfig({
      oficio: data.oficio || '',
      descripcion: data.descripcion || '',
      comuna: data.comuna || '',
      comunas: data.comunas || [],
      experiencia: data.experiencia || '',
      telefono: data.telefono || '',
      activo: data.activo,
    })
  }

  async function guardarConfig() {
    setGuardandoConfig(true); setMsgConfig(null)
    const res = await fetch(`${API}/api/configuracion/`, {
      method: 'PATCH', headers: headers(),
      body: JSON.stringify({ ...formConfig, experiencia: parseInt(formConfig.experiencia) || 0 })
    })
    setGuardandoConfig(false)
    if (res.ok) setMsgConfig({ tipo: 'ok', texto: 'Perfil actualizado correctamente' })
    else setMsgConfig({ tipo: 'error', texto: 'Error al guardar los cambios' })
  }

  async function cambiarPassword() {
    if (formPassword.password_nuevo !== formPassword.password_confirmar) {
      setMsgPassword({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' }); return
    }
    setGuardandoPassword(true); setMsgPassword(null)
    const res = await fetch(`${API}/api/configuracion/cambiar-password/`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ password_actual: formPassword.password_actual, password_nuevo: formPassword.password_nuevo })
    })
    const data = await res.json()
    setGuardandoPassword(false)
    if (res.ok) { setMsgPassword({ tipo: 'ok', texto: 'Contraseña actualizada correctamente' }); setFormPassword({ password_actual: '', password_nuevo: '', password_confirmar: '' }) }
    else setMsgPassword({ tipo: 'error', texto: data.error || 'Error al cambiar contraseña' })
  }

  async function eliminarCuenta() {
    setEliminando(true)
    const res = await fetch(`${API}/api/configuracion/eliminar-cuenta/`, {
      method: 'DELETE', headers: headers(),
      body: JSON.stringify({ password: passwordEliminar })
    })
    setEliminando(false)
    if (res.ok) { localStorage.removeItem('token'); localStorage.removeItem('refresh'); window.location.href = '/' }
    else { const data = await res.json(); alert(data.error || 'Error al eliminar la cuenta') }
  }

  const todasSeleccionadas = (formConfig.comunas || []).includes(TODAS_COMUNAS)
  function toggleTodasComunas(checked) { setFormConfig({ ...formConfig, comunas: checked ? [TODAS_COMUNAS] : [] }) }
  function agregarComuna(comuna) {
    if (!comuna || (formConfig.comunas || []).includes(comuna)) return
    setFormConfig({ ...formConfig, comunas: [...(formConfig.comunas || []), comuna] })
  }
  function quitarComuna(comuna) { setFormConfig({ ...formConfig, comunas: (formConfig.comunas || []).filter(c => c !== comuna) }) }

  const cerrarSesion = () => { localStorage.removeItem('token'); localStorage.removeItem('refresh'); window.location.href = '/' }

  const subtotalItems = items.reduce((acc, i) => acc + (parseInt(i.cantidad) || 0) * (parseInt(i.precio_unitario) || 0), 0)
  const tasaImpuesto = TIPOS_IMPUESTO.find(t => t.value === formCotizacion.tipo_impuesto)?.tasa || 0
  const total = subtotalItems + Math.round(subtotalItems * tasaImpuesto)

  const agregarItem = () => setItems([...items, itemVacio()])
  const quitarItem = (idx) => setItems(items.filter((_, i) => i !== idx))
  const actualizarItem = (idx, campo, valor) => setItems(items.map((item, i) => i === idx ? { ...item, [campo]: valor } : item))

  // cliente seleccionado en modal cotización
  const clienteSeleccionado = clientesReal.find(c => String(c.id) === String(formCotizacion.cliente))

  if (!autorizado) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Verificando sesion...</p>
    </div>
  )

  const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', marginTop: '4px', boxSizing: 'border-box', fontSize: '14px' }
  const labelStyle = { fontSize: '13px', color: '#6B7280', fontWeight: 500 }
  const btnEditar = { background: 'none', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#1B3A6B' }

  const solicitudesFiltradas = solicitudes.filter(s => filtroSolicitudes === 'todas' ? true : !s.descartada)

  const menuItems = [
    { icon: '▣', label: 'Dashboard', key: 'dashboard' },
    { icon: '📩', label: 'Solicitudes', key: 'solicitudes', badge: solicitudesNoLeidas },
    { icon: '⚒', label: 'Trabajos', key: 'trabajos' },
    { icon: '📋', label: 'Cotizaciones', key: 'cotizaciones' },
    { icon: '👥', label: 'Clientes', key: 'clientes' },
    { icon: '★', label: 'Resenas', key: 'resenas' },
    { icon: '⚙', label: 'Configuracion', key: 'configuracion' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>

      {/* SIDEBAR */}
      <div style={{ width: '240px', background: '#1B3A6B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        </div>
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>CM</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{usuario.nombre || 'Mi cuenta'}</p>
              <p style={{ color: '#93C5FD', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{usuario.email}</p>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div onClick={() => window.location.href = '/'}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color: '#93C5FD', fontSize: '13px' }}>← Ver mi perfil público</span>
            </div>
            <div onClick={cerrarSesion}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color: '#FCA5A5', fontSize: '13px' }}>✕ Cerrar sesión</span>
            </div>
          </div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map(item => (
              <div key={item.key} onClick={() => {
                setSeccion(item.key)
                if (item.key === 'trabajos') fetchTrabajos()
                if (item.key === 'clientes') fetchClientes()
                if (item.key === 'cotizaciones') { fetchCotizaciones(); fetchClientes() }
                if (item.key === 'solicitudes') fetchSolicitudes()
                if (item.key === 'resenas') fetchResenas()
                if (item.key === 'configuracion') fetchConfig()
              }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: seccion === item.key ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ color: seccion === item.key ? '#fff' : '#93C5FD', fontSize: '14px', fontWeight: seccion === item.key ? '500' : '400', flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background: '#F97316', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '2px 7px', minWidth: '18px', textAlign: 'center' }}>{item.badge}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {seccion === 'dashboard' && `Bienvenido, ${usuario.nombre ? usuario.nombre.split(' ')[0] : 'Contratista'}`}
              {seccion === 'solicitudes' && 'Solicitudes de clientes'}
              {seccion === 'trabajos' && 'Mis Trabajos'}
              {seccion === 'cotizaciones' && 'Cotizaciones'}
              {seccion === 'clientes' && 'Clientes'}
              {seccion === 'resenas' && 'Reseñas'}
              {seccion === 'configuracion' && 'Configuración'}
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Lunes 15 de junio, 2026</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>CM</div>
          </div>
        </div>

        {/* MODAL COTIZACIÓN ENVIADA */}
        {showModalCotizacionEnviada && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '480px', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>📤</div>
              <h2 style={{ fontWeight: 700, color: '#1B3A6B', margin: 0 }}>¡Cotización enviada!</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                La cotización fue enviada al cliente y lo notificamos por email para que la apruebe o rechace.
              </p>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px 16px' }}>
                <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}>
                  💡 Si lo deseas, también puedes contactar directamente al cliente para avisarle que tiene una cotización pendiente.
                </p>
              </div>
              <button onClick={() => setShowModalCotizacionEnviada(false)}
                style={{ padding: '12px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* MODAL CLIENTE */}
        {showModalCliente && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontWeight: 700, color: '#1B3A6B', margin: 0 }}>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              {!clienteEditando && formCliente.nombre && (
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#92400E' }}>
                  📩 Datos pre-llenados desde la solicitud — completa dirección y comuna
                </div>
              )}
              <div><label style={labelStyle}>Nombre</label><input type="text" value={formCliente.nombre} onChange={e => setFormCliente({ ...formCliente, nombre: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Teléfono</label><input type="text" value={formCliente.telefono} onChange={e => setFormCliente({ ...formCliente, telefono: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Email</label><input type="email" value={formCliente.email} onChange={e => setFormCliente({ ...formCliente, email: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Comuna</label>
                <select value={formCliente.comuna} onChange={e => setFormCliente({ ...formCliente, comuna: e.target.value })} style={{ ...inputStyle, background: '#fff' }}>
                  <option value="">Selecciona una comuna</option>
                  {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Dirección</label><input type="text" value={formCliente.direccion} onChange={e => setFormCliente({ ...formCliente, direccion: e.target.value })} style={inputStyle} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => { setShowModalCliente(false); setClienteEditando(null); setFormCliente({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' }) }}
                  style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                <button onClick={clienteEditando ? editarCliente : crearCliente}
                  style={{ flex: 1, padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {clienteEditando ? 'Guardar cambios' : 'Guardar cliente'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        {showConfirmEliminar && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '440px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                <h2 style={{ fontWeight: 700, color: '#991B1B', margin: '0 0 8px' }}>Eliminar cuenta permanentemente</h2>
                <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>Esta acción es irreversible. Se eliminarán todos tus datos, trabajos, clientes y cotizaciones.</p>
              </div>
              <div>
                <label style={labelStyle}>Ingresa tu contraseña para confirmar</label>
                <input type="password" value={passwordEliminar} onChange={e => setPasswordEliminar(e.target.value)} placeholder="Tu contraseña actual" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setShowConfirmEliminar(false); setPasswordEliminar('') }}
                  style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                <button onClick={eliminarCuenta} disabled={eliminando || !passwordEliminar}
                  style={{ flex: 1, padding: '10px', background: eliminando ? '#9CA3AF' : '#DC2626', color: 'white', border: 'none', borderRadius: '8px', cursor: eliminando ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {eliminando ? 'Eliminando...' : 'Eliminar cuenta'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN DASHBOARD */}
        {seccion === 'dashboard' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Trabajos activos', valor: '3', icono: '⚒', color: '#EEF2FF', texto: '#1B3A6B' },
                { label: 'Cotizaciones pendientes', valor: '2', icono: '📋', color: '#FEF3C7', texto: '#92400E' },
                { label: 'Ingresos del mes', valor: '$285.000', icono: '💰', color: '#ECFDF5', texto: '#065F46' },
                { label: 'Solicitudes nuevas', valor: String(solicitudesNoLeidas), icono: '📩', color: '#FFF7ED', texto: '#C2410C' },
              ].map(m => (
                <div key={m.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>{m.label}</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{m.icono}</div>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: m.texto, margin: 0 }}>{m.valor}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Trabajos recientes</h2>
                <button onClick={() => { setSeccion('trabajos'); fetchTrabajos() }} style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>Ver todos</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Cliente', 'Trabajo', 'Comuna', 'Fecha', 'Estado', 'Monto'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '12px', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trabajosDemo.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{t.cliente}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{t.trabajo}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{t.comuna}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{t.fecha}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: estadoColor[t.estado]?.bg, color: estadoColor[t.estado]?.color, fontSize: '12px', padding: '4px 10px', borderRadius: '999px', fontWeight: '500' }}>{t.estado}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{t.monto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Próximos trabajos</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {trabajosDemo.filter(t => t.estado === 'Pendiente' || t.estado === 'En progreso').map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8F9FA', borderRadius: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.estado === 'En progreso' ? '#F97316' : '#1B3A6B', flexShrink: 0 }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: '0 0 2px' }}>{t.cliente}</p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{t.trabajo} · {t.fecha}</p>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1B3A6B' }}>{t.monto}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>Solicitudes recientes</h2>
                  {solicitudesNoLeidas > 0 && <span style={{ background: '#F97316', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px' }}>{solicitudesNoLeidas} nuevas</span>}
                </div>
                {solicitudes.filter(s => !s.descartada).length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#9CA3AF' }}>No hay solicitudes aún.</p>
                ) : solicitudes.filter(s => !s.descartada).slice(0, 3).map(s => (
                  <div key={s.id} style={{ padding: '12px', background: s.leida ? '#F8F9FA' : '#FFF7ED', borderRadius: '10px', marginBottom: '8px', border: s.leida ? 'none' : '1px solid #FED7AA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{s.nombre_cliente}</span>
                      {!s.leida && <span style={{ fontSize: '11px', color: '#F97316', fontWeight: 600 }}>● Nueva</span>}
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>📞 {s.telefono_cliente}</p>
                    {s.email_cliente && <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>✉️ {s.email_cliente}</p>}
                    <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{s.descripcion.slice(0, 80)}{s.descripcion.length > 80 ? '...' : ''}</p>
                  </div>
                ))}
                {solicitudes.filter(s => !s.descartada).length > 0 && (
                  <button onClick={() => { setSeccion('solicitudes'); fetchSolicitudes() }} style={{ background: 'none', border: 'none', color: '#1B3A6B', fontSize: '13px', cursor: 'pointer', padding: 0, marginTop: '8px' }}>
                    Ver todas →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN SOLICITUDES */}
        {seccion === 'solicitudes' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[{ key: 'activas', label: 'Activas' }, { key: 'todas', label: 'Todas' }].map(f => (
                <button key={f.key} onClick={() => setFiltroSolicitudes(f.key)}
                  style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer', fontWeight: filtroSolicitudes === f.key ? 600 : 400, background: filtroSolicitudes === f.key ? '#1B3A6B' : '#fff', color: filtroSolicitudes === f.key ? '#fff' : '#374151', border: filtroSolicitudes === f.key ? 'none' : '1px solid #E5E7EB' }}>
                  {f.label}
                </button>
              ))}
            </div>
            {solicitudesFiltradas.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📩</div>
                <p style={{ color: '#6B7280', fontSize: '16px' }}>No hay solicitudes aún. Cuando un cliente te contacte desde tu perfil público, aparecerá aquí.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {solicitudesFiltradas.map(s => (
                  <div key={s.id} style={{ background: '#fff', border: `1px solid ${s.descartada ? '#E5E7EB' : s.leida ? '#E5E7EB' : '#FED7AA'}`, borderRadius: '16px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', opacity: s.descartada ? 0.6 : 1 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: s.descartada ? '#F3F4F6' : s.leida ? '#F3F4F6' : '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {s.descartada ? '🗑' : s.leida ? '👤' : '🔔'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>{s.nombre_cliente}</span>
                        {!s.leida && !s.descartada && <span style={{ background: '#F97316', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '2px 8px' }}>Nueva</span>}
                        {s.descartada && <span style={{ background: '#F3F4F6', color: '#9CA3AF', fontSize: '11px', fontWeight: 600, borderRadius: '999px', padding: '2px 8px' }}>Descartada</span>}
                      </div>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 4px' }}>📞 {s.telefono_cliente}</p>
                      {s.email_cliente && <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px' }}>✉️ {s.email_cliente}</p>}
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 12px' }}>{s.descripcion}</p>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                        {new Date(s.creado_en).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!s.descartada && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <button onClick={() => crearClienteDesdeSolicitud(s)}
                          style={{ background: '#1B3A6B', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                          + Crear cliente
                        </button>
                        <button onClick={() => descartarSolicitud(s.id)}
                          style={{ background: 'none', border: '1px solid #FCA5A5', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#EF4444' }}>
                          Descartar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN TRABAJOS */}
        {seccion === 'trabajos' && (
          <div style={{ padding: '32px' }}>
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <p style={{ fontSize: '13px', color: '#92400E', margin: 0 }}>Los trabajos se generan automáticamente cuando el cliente aprueba una cotización. Para crear un trabajo, primero crea una cotización desde la sección <strong>Cotizaciones</strong>.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Cliente', 'Descripción', 'Comuna', 'Fecha', 'Estado', 'Monto'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trabajosReal.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>No hay trabajos aún</td></tr>
                  ) : trabajosReal.map(t => (
                    <tr key={t.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{t.cliente}</td>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '14px' }}>{t.descripcion}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.comuna}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.fecha}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {t.estado === 'completado' ? (
                          <span style={{ background: '#ECFDF5', color: '#065F46', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>✓ Completado</span>
                        ) : (
                          <select value={t.estado} onChange={e => cambiarEstadoDirecto(t.id, e.target.value)}
                            style={{ border: `1px solid ${t.estado === 'pendiente' ? '#C7D2FE' : '#FDE68A'}`, background: t.estado === 'pendiente' ? '#EEF2FF' : '#FEF3C7', color: t.estado === 'pendiente' ? '#3730A3' : '#92400E', borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', outline: 'none' }}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en_progreso">En progreso</option>
                            <option value="completado">Completado</option>
                          </select>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>${t.monto?.toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN CLIENTES */}
        {seccion === 'clientes' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => { setClienteEditando(null); setFormCliente({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' }); setShowModalCliente(true) }}
                style={{ background: '#F97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                + Nuevo cliente
              </button>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Nombre', 'Teléfono', 'Email', 'Comuna', 'Dirección', 'Acción'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientesReal.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No hay clientes aún</td></tr>
                  ) : clientesReal.map(c => (
                    <tr key={c.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{c.nombre}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.telefono}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>{c.email}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.comuna}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>{c.direccion}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => abrirEditarCliente(c)} style={btnEditar}>Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN COTIZACIONES */}
        {seccion === 'cotizaciones' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => { setCotizacionEditando(null); setFormCotizacion({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' }); setItems([itemVacio()]); setShowModalCotizacion(true); fetchClientes() }}
                style={{ background: '#F97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                + Nueva cotización
              </button>
            </div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Cliente', 'Descripción', 'Subtotal', 'Impuesto', 'Total', 'Estado', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesReal.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No hay cotizaciones aún</td></tr>
                  ) : cotizacionesReal.map(c => {
                    const subtotal = c.incluye_iva ? Math.round(c.monto / 1.19) : c.monto
                    const impuesto = c.incluye_iva ? c.monto - subtotal : 0
                    return (
                      <tr key={c.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{clientesReal.find(cl => cl.id === c.cliente)?.nombre || c.cliente}</td>
                        <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '14px' }}>{c.descripcion}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>${subtotal.toLocaleString('es-CL')}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', color: impuesto > 0 ? '#92400E' : '#9CA3AF' }}>
                          {impuesto > 0 ? `$${impuesto.toLocaleString('es-CL')}` : '—'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>${c.monto?.toLocaleString('es-CL')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: estadoColorCotizacion[c.estado]?.bg || '#F3F4F6', color: estadoColorCotizacion[c.estado]?.color || '#374151', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>
                            {c.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {c.estado === 'borrador' && <>
                            <button onClick={() => abrirEditarCotizacion(c)} style={btnEditar}>Editar</button>
                            <button onClick={() => cambiarEstadoCotizacion(c.id, 'enviada')} style={{ ...btnEditar, color: '#3730A3', borderColor: '#C7D2FE' }}>Enviar</button>
                          </>}
                          {c.estado === 'enviada' && <span style={{ fontSize: '12px', color: '#3730A3', fontWeight: 500 }}>📧 Enviada al cliente</span>}
                          {c.estado === 'aprobada' && <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 600 }}>✓ Aprobada</span>}
                          {c.estado === 'rechazada' && <span style={{ fontSize: '12px', color: '#991B1B' }}>✗ Rechazada</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {showModalCotizacion && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '24px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '600px', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h2 style={{ fontWeight: 700, color: '#1B3A6B', margin: 0 }}>{cotizacionEditando ? 'Editar Cotización' : 'Nueva Cotización'}</h2>

                  {/* SELECTOR CLIENTE CON DATOS */}
                  <div>
                    <label style={labelStyle}>Cliente</label>
                    <select
                      value={formCotizacion.cliente}
                      onChange={e => setFormCotizacion({ ...formCotizacion, cliente: e.target.value })}
                      style={{ ...inputStyle, background: '#fff' }}>
                      <option value="">Selecciona un cliente</option>
                      {clientesReal.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    {clienteSeleccionado && (
                      <div style={{ marginTop: '8px', padding: '10px 12px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #F3F4F6', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                        {clienteSeleccionado.telefono && (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>📞 {clienteSeleccionado.telefono}</span>
                        )}
                        {clienteSeleccionado.email && (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>✉️ {clienteSeleccionado.email}</span>
                        )}
                        {clienteSeleccionado.comuna && (
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>📍 {clienteSeleccionado.comuna}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Descripción general</label>
                    <input type="text" value={formCotizacion.descripcion} onChange={e => setFormCotizacion({ ...formCotizacion, descripcion: e.target.value })} style={inputStyle} placeholder="Ej: Reparación sistema eléctrico" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>Items de la cotización</label>
                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 40px', background: '#F9FAFB', padding: '8px 12px' }}>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Descripción</span>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Cant.</span>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Precio unit.</span>
                        <span></span>
                      </div>
                      {items.map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 40px', gap: '4px', padding: '8px 12px', borderTop: '1px solid #F3F4F6', alignItems: 'center' }}>
                          <input type="text" value={item.descripcion} onChange={e => actualizarItem(idx, 'descripcion', e.target.value)} placeholder="Ej: Mano de obra" style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', boxSizing: 'border-box' }} />
                          <input type="number" value={item.cantidad} onChange={e => actualizarItem(idx, 'cantidad', e.target.value)} min="1" style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', boxSizing: 'border-box' }} />
                          <input type="number" value={item.precio_unitario} onChange={e => actualizarItem(idx, 'precio_unitario', e.target.value)} placeholder="0" style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 8px', fontSize: '13px', boxSizing: 'border-box' }} />
                          <button onClick={() => quitarItem(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', padding: '0' }}>×</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={agregarItem} style={{ marginTop: '8px', background: 'none', border: '1px dashed #E5E7EB', borderRadius: '8px', padding: '8px', width: '100%', cursor: 'pointer', color: '#6B7280', fontSize: '13px' }}>
                      + Agregar item
                    </button>
                  </div>
                  <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6B7280' }}>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>${subtotalItems.toLocaleString('es-CL')}</span>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>Tipo de documento / impuesto</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {TIPOS_IMPUESTO.map(tipo => (
                          <label key={tipo.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${formCotizacion.tipo_impuesto === tipo.value ? '#1B3A6B' : '#E5E7EB'}`, background: formCotizacion.tipo_impuesto === tipo.value ? '#EEF2FF' : '#fff' }}>
                            <input type="radio" name="tipo_impuesto" value={tipo.value} checked={formCotizacion.tipo_impuesto === tipo.value} onChange={() => setFormCotizacion({ ...formCotizacion, tipo_impuesto: tipo.value })} style={{ accentColor: '#1B3A6B' }} />
                            <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827', flex: 1 }}>{tipo.label}</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: tipo.tasa > 0 ? '#92400E' : '#9CA3AF' }}>
                              {tipo.tasa > 0 ? `+$${Math.round(subtotalItems * tipo.tasa).toLocaleString('es-CL')}` : '—'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>Total</span>
                      <span style={{ fontWeight: 700, fontSize: '16px', color: '#1B3A6B' }}>${total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => { setShowModalCotizacion(false); setCotizacionEditando(null); setItems([itemVacio()]) }}
                      style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                    <button onClick={cotizacionEditando ? editarCotizacion : crearCotizacion}
                      style={{ flex: 1, padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                      {cotizacionEditando ? 'Guardar cambios' : 'Guardar cotización'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN RESEÑAS */}
        {seccion === 'resenas' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: '#F97316', margin: '0 0 4px' }}>{resenas.promedio ? `${resenas.promedio}★` : '—'}</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Promedio general</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: '#1B3A6B', margin: '0 0 4px' }}>{resenas.total}</p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Reseñas recibidas</p>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: '#059669', margin: '0 0 4px' }}>
                  {resenas.total > 0 ? `${Math.round((resenas.resenas?.filter(r => r.rating >= 4).length / resenas.total) * 100)}%` : '—'}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Satisfacción (4-5★)</p>
              </div>
            </div>
            {resenas.total === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>⭐</div>
                <p style={{ color: '#6B7280', fontSize: '16px' }}>Aún no tienes reseñas. Cuando completes trabajos y tus clientes califiquen, aparecerán aquí.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resenas.resenas?.map((r, idx) => (
                  <div key={idx} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{r.nombre_cliente}</span>
                          <span style={{ fontSize: '13px', color: '#6B7280' }}>· {r.trabajo}</span>
                        </div>
                        <span style={{ fontSize: '20px' }}>{'⭐'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        {new Date(r.creado_en).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {r.comentario && <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>"{r.comentario}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN CONFIGURACIÓN */}
        {seccion === 'configuracion' && (
          <div style={{ padding: '32px', maxWidth: '720px' }}>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Perfil público</h2>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Esta información es visible para los clientes en el directorio.</p>
              {config === null ? <p style={{ color: '#6B7280', fontSize: '14px' }}>Cargando...</p> : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Oficio</label>
                      <select value={formConfig.oficio} onChange={e => setFormConfig({ ...formConfig, oficio: e.target.value })} style={{ ...inputStyle, background: '#fff' }}>
                        <option value="">Selecciona un oficio</option>
                        {oficios.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Años de experiencia</label>
                      <input type="number" min="0" max="50" value={formConfig.experiencia} onChange={e => setFormConfig({ ...formConfig, experiencia: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Comunas donde prestas servicio</label>
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${todasSeleccionadas ? '#1B3A6B' : '#E5E7EB'}`, background: todasSeleccionadas ? '#EEF2FF' : '#fff', marginBottom: '10px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={todasSeleccionadas} onChange={e => toggleTodasComunas(e.target.checked)} style={{ accentColor: '#1B3A6B', width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B3A6B' }}>🗺 Todas las comunas de Santiago</span>
                      </label>
                      {!todasSeleccionadas && (
                        <>
                          {(formConfig.comunas || []).length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                              {(formConfig.comunas || []).map(c => (
                                <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#EEF2FF', color: '#1B3A6B', fontSize: '13px', padding: '4px 10px', borderRadius: '999px', fontWeight: 500 }}>
                                  {c}<span onClick={() => quitarComuna(c)} style={{ cursor: 'pointer', color: '#6B7280', fontWeight: 700, lineHeight: 1 }}>×</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <select value="" onChange={e => agregarComuna(e.target.value)} style={{ ...inputStyle, background: '#fff', marginTop: 0 }}>
                            <option value="">+ Agregar una comuna...</option>
                            {comunas.filter(c => !(formConfig.comunas || []).includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          {(formConfig.comunas || []).length === 0 && <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Selecciona al menos una comuna o marca "Todas las comunas"</p>}
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Descripción / Sobre mí</label>
                    <textarea value={formConfig.descripcion} onChange={e => setFormConfig({ ...formConfig, descripcion: e.target.value })} rows={4} placeholder="Cuéntales a tus clientes quién eres y qué haces..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F8F9FA', borderRadius: '10px', marginBottom: '20px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Perfil público visible</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Desactiva para ocultarte del directorio</p>
                    </div>
                    <div onClick={() => setFormConfig({ ...formConfig, activo: !formConfig.activo })}
                      style={{ width: '44px', height: '24px', borderRadius: '999px', background: formConfig.activo ? '#059669' : '#D1D5DB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: formConfig.activo ? '23px' : '3px', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                  {msgConfig && (
                    <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', background: msgConfig.tipo === 'ok' ? '#ECFDF5' : '#FEE2E2', color: msgConfig.tipo === 'ok' ? '#065F46' : '#991B1B', fontSize: '14px' }}>
                      {msgConfig.tipo === 'ok' ? '✓ ' : '✗ '}{msgConfig.texto}
                    </div>
                  )}
                  <button onClick={guardarConfig} disabled={guardandoConfig} style={{ background: guardandoConfig ? '#9CA3AF' : '#1B3A6B', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: guardandoConfig ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    {guardandoConfig ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </>
              )}
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>Cuenta</h2>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Datos de acceso y contacto.</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email (no se puede cambiar)</label>
                <input type="email" value={config?.email || ''} disabled style={{ ...inputStyle, background: '#F9FAFB', color: '#9CA3AF', cursor: 'not-allowed' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Teléfono de contacto</label>
                <input type="text" value={formConfig.telefono} onChange={e => setFormConfig({ ...formConfig, telefono: e.target.value })} style={inputStyle} placeholder="+56 9 1234 5678" />
              </div>
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Cambiar contraseña</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div><label style={labelStyle}>Contraseña actual</label><input type="password" value={formPassword.password_actual} onChange={e => setFormPassword({ ...formPassword, password_actual: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Nueva contraseña</label><input type="password" value={formPassword.password_nuevo} onChange={e => setFormPassword({ ...formPassword, password_nuevo: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Confirmar nueva contraseña</label><input type="password" value={formPassword.password_confirmar} onChange={e => setFormPassword({ ...formPassword, password_confirmar: e.target.value })} style={inputStyle} /></div>
                </div>
                {msgPassword && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', margin: '16px 0 0', background: msgPassword.tipo === 'ok' ? '#ECFDF5' : '#FEE2E2', color: msgPassword.tipo === 'ok' ? '#065F46' : '#991B1B', fontSize: '14px' }}>
                    {msgPassword.tipo === 'ok' ? '✓ ' : '✗ '}{msgPassword.texto}
                  </div>
                )}
                <button onClick={cambiarPassword} disabled={guardandoPassword} style={{ marginTop: '16px', background: guardandoPassword ? '#9CA3AF' : '#1B3A6B', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: guardandoPassword ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {guardandoPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#991B1B', marginBottom: '4px' }}>Zona de peligro</h2>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Acciones irreversibles. Procede con cuidado.</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FFF5F5', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>Eliminar mi cuenta</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Se eliminarán permanentemente todos tus datos.</p>
                </div>
                <button onClick={() => setShowConfirmEliminar(true)} style={{ background: 'none', border: '1px solid #EF4444', color: '#EF4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}