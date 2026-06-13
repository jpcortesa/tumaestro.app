'use client'

import { useEffect, useState } from 'react'

const trabajos = [
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

const menuItems = [
  { icon: '▣', label: 'Dashboard', active: true },
  { icon: '⚒', label: 'Trabajos', active: false },
  { icon: '📋', label: 'Cotizaciones', active: false },
  { icon: '👥', label: 'Clientes', active: false },
  { icon: '★', label: 'Resenas', active: false },
  { icon: '⚙', label: 'Configuracion', active: false },
]

export default function Panel() {
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.replace('/login')
    } else {
      setAutorizado(true)
    }
  }, [])

  if (!autorizado) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Verificando sesion...</p>
    </div>
  )

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    window.location.href = '/'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <div style={{ width: '240px', background: '#1B3A6B', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        </div>
        <div style={{ padding: '16px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>CM</div>
            <div>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '500', margin: 0 }}>Carlos Munoz</p>
              <p style={{ color: '#93C5FD', fontSize: '12px', margin: 0 }}>Gasfitero</p>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: item.active ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ color: item.active ? '#fff' : '#93C5FD', fontSize: '14px', fontWeight: item.active ? '500' : '400' }}>{item.label}</span>
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

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>Bienvenido, Carlos</h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Viernes 13 de junio, 2026</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>CM</div>
          </div>
        </div>

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
              <button style={{ background: 'transparent', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>Ver todos</button>
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
                {trabajos.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{t.cliente}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{t.trabajo}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{t.comuna}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{t.fecha}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: estadoColor[t.estado].bg, color: estadoColor[t.estado].color, fontSize: '12px', padding: '4px 10px', borderRadius: '999px', fontWeight: '500' }}>{t.estado}</span>
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
                {trabajos.filter(t => t.estado === 'Pendiente' || t.estado === 'En progreso').map(t => (
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
      </div>
    </div>
  )
}
