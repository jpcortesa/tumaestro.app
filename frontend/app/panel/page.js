'use client'

import { useEffect, useState } from 'react'

const trabajosDemo = [
  { id: 1, cliente: 'Maria Gonzalez', trabajo: 'Reparacion calefon', comuna: 'Las Condes', fecha: 'Hoy 14:30', estado: 'En progreso', monto: '$45.000' },
  { id: 2, cliente: 'Roberto Sanchez', trabajo: 'Instalacion ducha', comuna: 'Providencia', fecha: 'Manana 10:00', estado: 'Pendiente', monto: '$85.000' },
  { id: 3, cliente: 'Carmen Valdes', trabajo: 'Reparacion caneria', comuna: 'Nunoa', fecha: 'Ayer', estado: 'Completado', monto: '$35.000' },
  { id: 4, cliente: 'Jorge Perez', trabajo: 'Cambio llave paso', comuna: 'Las Condes', fecha: 'Ayer', estado: 'Completado', monto: '$25.000' },
  { id: 5, cliente: 'Ana Martinez', trabajo: 'Instalacion calefon', comuna: 'Vitacura', fecha: '03/06/2026', estado: 'Cotizacion', monto: '$120.000' },
]

const estadoColor = {
  'En progreso': { bg: '#FEF3C7', color: '#92400E' },
  'Pendiente': { bg: '#EEF2FF', color: '#3730A3' },
  'Completado': { bg: '#ECFDF5', color: '#065F46' },
  'Cotizacion': { bg: '#F3F4F6', color: '#374151' },
}

const estadoColorReal = {
  pendiente: { bg: '#EEF2FF', color: '#3730A3' },
  en_progreso: { bg: '#FEF3C7', color: '#92400E' },
  completado: { bg: '#ECFDF5', color: '#065F46' },
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

const menuItems = [
  { icon: '▣', label: 'Dashboard', key: 'dashboard' },
  { icon: '⚒', label: 'Trabajos', key: 'trabajos' },
  { icon: '📋', label: 'Cotizaciones', key: 'cotizaciones' },
  { icon: '👥', label: 'Clientes', key: 'clientes' },
  { icon: '★', label: 'Resenas', key: 'resenas' },
  { icon: '⚙', label: 'Configuracion', key: 'configuracion' },
]

const itemVacio = () => ({ descripcion: '', cantidad: 1, precio_unitario: '' })

const TIPOS_IMPUESTO = [
  { value: 'ninguno', label: 'Sin impuesto', tasa: 0 },
  { value: 'iva', label: 'IVA 19% (Factura)', tasa: 0.19 },
  { value: 'honorarios', label: 'Retención 15,25% (Boleta honorarios)', tasa: 0.1525 },
]

export default function Panel() {
  const [autorizado, setAutorizado] = useState(false)
  const [usuario, setUsuario] = useState({ nombre: '', email: '' })
  const [seccion, setSeccion] = useState('dashboard')

  // Trabajos
  const [trabajosReal, setTrabajosReal] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ cliente: '', descripcion: '', comuna: '', monto: '', fecha: '', estado: 'pendiente' })

  // Clientes
  const [clientesReal, setClientesReal] = useState([])
  const [showModalCliente, setShowModalCliente] = useState(false)
  const [formCliente, setFormCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' })
  const [clienteEditando, setClienteEditando] = useState(null)

  // Cotizaciones
  const [cotizacionesReal, setCotizacionesReal] = useState([])
  const [showModalCotizacion, setShowModalCotizacion] = useState(false)
  const [formCotizacion, setFormCotizacion] = useState({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' })
  const [items, setItems] = useState([itemVacio()])
  const [cotizacionEditando, setCotizacionEditando] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.replace('/login'); return }
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${API}/api/perfil/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if (!res.ok) { localStorage.removeItem('token'); window.location.replace('/login'); return } return res.json() })
      .then(data => { if (data) { setUsuario(data); setAutorizado(true) } })
      .catch(() => window.location.replace('/login'))
  }, [])

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const token = () => localStorage.getItem('token')
  const headers = () => ({ 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json' })

  async function fetchTrabajos() {
    const res = await fetch(`${API}/api/trabajos/`, { headers: { 'Authorization': `Bearer ${token()}` } })
    setTrabajosReal(await res.json())
  }

  async function crearTrabajo() {
    const res = await fetch(`${API}/api/trabajos/`, { method: 'POST', headers: headers(), body: JSON.stringify({ ...form, monto: parseInt(form.monto) }) })
    if (res.ok) { setShowModal(false); setForm({ cliente: '', descripcion: '', comuna: '', monto: '', fecha: '', estado: 'pendiente' }); fetchTrabajos() }
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
    if (res.ok) { setShowModalCliente(false); setClienteEditando(null); setFormCliente({ nombre: '', telefono: '', email: '', direccion: '', comuna: '' }); fetchClientes() }
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
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token'); localStorage.removeItem('refresh'); window.location.href = '/'
  }

  const subtotalItems = items.reduce((acc, i) => acc + (parseInt(i.cantidad) || 0) * (parseInt(i.precio_unitario) || 0), 0)
  const tasaImpuesto = TIPOS_IMPUESTO.find(t => t.value === formCotizacion.tipo_impuesto)?.tasa || 0
  const montoImpuesto = Math.round(subtotalItems * tasaImpuesto)
  const total = subtotalItems + montoImpuesto

  const agregarItem = () => setItems([...items, itemVacio()])
  const quitarItem = (idx) => setItems(items.filter((_, i) => i !== idx))
  const actualizarItem = (idx, campo, valor) => setItems(items.map((item, i) => i === idx ? { ...item, [campo]: valor } : item))

  if (!autorizado) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Verificando sesion...</p>
    </div>
  )

  const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', marginTop: '4px', boxSizing: 'border-box', fontSize: '14px' }
  const labelStyle = { fontSize: '13px', color: '#6B7280', fontWeight: 500 }
  const btnEditar = { background: 'none', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#1B3A6B' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>

      {/* SIDEBAR */}
      <div style={{ width: '240px', background: '#1B3A6B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        </div>
        <div style={{ padding: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>CM</div>
            <div>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', margin: 0 }}>{usuario.nombre || 'Mi cuenta'}</p>
              <p style={{ color: '#93C5FD', fontSize: '12px', margin: 0 }}>{usuario.email}</p>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map(item => (
              <div key={item.key} onClick={() => {
                setSeccion(item.key)
                if (item.key === 'trabajos') fetchTrabajos()
                if (item.key === 'clientes') fetchClientes()
                if (item.key === 'cotizaciones') { fetchCotizaciones(); fetchClientes() }
              }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: seccion === item.key ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ color: seccion === item.key ? '#fff' : '#93C5FD', fontSize: '14px', fontWeight: seccion === item.key ? '500' : '400' }}>{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div onClick={() => window.location.href = '/'} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', marginBottom: '4px' }}>
            <span style={{ color: '#93C5FD', fontSize: '14px' }}>← Ver mi perfil publico</span>
          </div>
          <div onClick={cerrarSesion} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px' }}>
            <span style={{ color: '#FCA5A5', fontSize: '14px' }}>✕ Cerrar sesion</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {seccion === 'dashboard' && `Bienvenido, ${usuario.nombre ? usuario.nombre.split(' ')[0] : 'Contratista'}`}
              {seccion === 'trabajos' && 'Mis Trabajos'}
              {seccion === 'cotizaciones' && 'Cotizaciones'}
              {seccion === 'clientes' && 'Clientes'}
              {seccion === 'resenas' && 'Reseñas'}
              {seccion === 'configuracion' && 'Configuración'}
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Viernes 13 de junio, 2026</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>CM</div>
          </div>
        </div>

        {/* SECCIÓN DASHBOARD */}
        {seccion === 'dashboard' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Trabajos activos', valor: '3', icono: '⚒', color: '#EEF2FF', texto: '#1B3A6B' },
                { label: 'Cotizaciones pendientes', valor: '2', icono: '📋', color: '#FEF3C7', texto: '#92400E' },
                { label: 'Ingresos del mes', valor: '$285.000', icono: '💰', color: '#ECFDF5', texto: '#065F46' },
                { label: 'Rating promedio', valor: '4.9★', icono: '★', color: '#FFF7ED', texto: '#C2410C' },
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
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Proximos trabajos</h2>
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
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Resenas recientes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { nombre: 'Maria G.', rating: 5, comentario: 'Excelente trabajo, muy puntual.', iniciales: 'MG', color: '#7C3AED' },
                    { nombre: 'Roberto S.', rating: 5, comentario: 'Segunda vez que lo contrato, siempre perfecto.', iniciales: 'RS', color: '#0F6E56' },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '12px', background: '#F8F9FA', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '600' }}>{r.iniciales}</div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '500', margin: 0 }}>{r.nombre}</p>
                          <span style={{ color: '#F97316', fontSize: '12px' }}>{'★'.repeat(r.rating)}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>{r.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN TRABAJOS */}
        {seccion === 'trabajos' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => setShowModal(true)} style={{ background: '#F97316', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                + Nuevo trabajo
              </button>
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
                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No hay trabajos aún</td></tr>
                  ) : trabajosReal.map(t => (
                    <tr key={t.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{t.cliente}</td>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '14px' }}>{t.descripcion}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.comuna}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{t.fecha}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {t.estado === 'completado' ? (
                          <span style={{ background: '#ECFDF5', color: '#065F46', padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                            ✓ Completado
                          </span>
                        ) : (
                          <select
                            value={t.estado}
                            onChange={e => cambiarEstadoDirecto(t.id, e.target.value)}
                            style={{
                              border: `1px solid ${t.estado === 'pendiente' ? '#C7D2FE' : '#FDE68A'}`,
                              background: t.estado === 'pendiente' ? '#EEF2FF' : '#FEF3C7',
                              color: t.estado === 'pendiente' ? '#3730A3' : '#92400E',
                              borderRadius: '999px', padding: '4px 10px', fontSize: '12px',
                              fontWeight: 500, cursor: 'pointer', outline: 'none'
                            }}
                          >
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
            {showModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h2 style={{ fontWeight: 700, color: '#1B3A6B', margin: 0 }}>Nuevo Trabajo</h2>
                  <div><label style={labelStyle}>Cliente</label><input type="text" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Descripción</label><input type="text" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Comuna</label>
                    <select value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })} style={{ ...inputStyle, background: '#fff' }}>
                      <option value="">Selecciona una comuna</option>
                      {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Monto</label><input type="number" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Fecha</label><input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} style={inputStyle} /></div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                    <button onClick={crearTrabajo} style={{ flex: 1, padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Guardar</button>
                  </div>
                </div>
              </div>
            )}
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
            {showModalCliente && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h2 style={{ fontWeight: 700, color: '#1B3A6B', margin: 0 }}>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
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
                    <button onClick={() => { setShowModalCliente(false); setClienteEditando(null) }} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                    <button onClick={clienteEditando ? editarCliente : crearCliente} style={{ flex: 1, padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                      {clienteEditando ? 'Guardar cambios' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN COTIZACIONES */}
        {seccion === 'cotizaciones' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button onClick={() => { setCotizacionEditando(null); setFormCotizacion({ cliente: '', descripcion: '', detalle: '', incluye_iva: false, tipo_impuesto: 'ninguno' }); setItems([itemVacio()]); setShowModalCotizacion(true) }}
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
                          {c.estado === 'enviada' && <>
                            <button onClick={() => cambiarEstadoCotizacion(c.id, 'aprobada')} style={{ background: '#ECFDF5', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>Aprobar</button>
                            <button onClick={() => cambiarEstadoCotizacion(c.id, 'rechazada')} style={{ background: '#FEE2E2', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#991B1B' }}>Rechazar</button>
                          </>}
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
                  <div><label style={labelStyle}>Cliente</label>
                    <select value={formCotizacion.cliente} onChange={e => setFormCotizacion({ ...formCotizacion, cliente: e.target.value })} style={{ ...inputStyle, background: '#fff' }}>
                      <option value="">Selecciona un cliente</option>
                      {clientesReal.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>Descripción general</label>
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
                    <button onClick={() => { setShowModalCotizacion(false); setCotizacionEditando(null); setItems([itemVacio()]) }} style={{ flex: 1, padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: 'white', fontSize: '14px' }}>Cancelar</button>
                    <button onClick={cotizacionEditando ? editarCotizacion : crearCotizacion} style={{ flex: 1, padding: '10px', background: '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                      {cotizacionEditando ? 'Guardar cambios' : 'Guardar cotización'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {['resenas', 'configuracion'].includes(seccion) && (
          <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>Sección en construcción 🚧</p>
          </div>
        )}

      </div>
    </div>
  )
}