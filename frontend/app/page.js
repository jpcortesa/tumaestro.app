'use client'

import { useEffect, useState } from 'react'

const oficios = ['Todos', 'Gasfitero', 'Electricista', 'Pintor', 'Cerrajero', 'Jardinero', 'Carpintero']

const comunas = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
  'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
  'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
  'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
  'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal',
  'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón',
  'Santiago Centro', 'Vitacura', 'Puente Alto', 'San Bernardo'
]

const colores = ['#1B3A6B', '#0F6E56', '#534AB7', '#854F0B', '#B45309', '#065F46']

function iniciales(nombre) {
  return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function colorPorNombre(nombre) {
  let hash = 0
  for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i)
  return colores[hash % colores.length]
}

export default function Home() {
  const [contratistas, setContratistas] = useState([])
  const [filtroOficio, setFiltroOficio] = useState('Todos')
  const [filtroComuna, setFiltroComuna] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API}/api/publico/contratistas/`)
      .then(res => res.json())
      .then(data => { setContratistas(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtrados = contratistas.filter(c => {
    const coincideOficio = filtroOficio === 'Todos' || c.oficio?.toLowerCase() === filtroOficio.toLowerCase()

    const coincideComuna = filtroComuna === 'Todas' || (() => {
      if (c.comunas?.includes('Todas las comunas de Santiago')) return true
      if (c.comunas?.length > 0) return c.comunas.includes(filtroComuna)
      return c.comuna === filtroComuna
    })()

    const coincideBusqueda = busqueda.trim() === '' || (
      c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.oficio?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    )

    return coincideOficio && coincideComuna && coincideBusqueda
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>

      {/* NAV */}
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/como-funciona" style={{ color: '#93C5FD', fontSize: '14px', textDecoration: 'none' }}>¿Cómo funciona?</a>
          <button
            onClick={() => window.location.href = '/login'}
            style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Iniciar sesión contratista
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#EEF2FF', padding: '64px 48px 48px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '680px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', lineHeight: '1.15', marginBottom: '16px' }}>
            Encuentra al profesional<br />
            <span style={{ color: '#1B3A6B' }}>ideal para tu hogar</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Contratistas verificados, con reseñas reales de clientes como tú
          </p>

          {/* BUSCADOR */}
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px', borderRight: '1px solid #E5E7EB' }}>
              <span style={{ color: '#9CA3AF', fontSize: '18px' }}>🔍</span>
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && {}}
                placeholder="¿Qué servicio necesitas?"
                style={{ border: 'none', outline: 'none', fontSize: '15px', color: '#111827', width: '100%', padding: '18px 0', background: 'transparent' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px', borderRight: '1px solid #E5E7EB' }}>
              <span style={{ color: '#9CA3AF' }}>📍</span>
              <select
                value={filtroComuna}
                onChange={e => setFiltroComuna(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '15px', color: '#111827', background: 'transparent', padding: '18px 0', cursor: 'pointer' }}>
                <option value="Todas">Todas las comunas</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button style={{ background: '#F97316', border: 'none', color: '#fff', padding: '0 32px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Buscar
            </button>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['Perfiles verificados', 'Reseñas reales', 'Cotizaciones gratis'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#059669' }}>
                <span>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DIRECTORIO */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>

        {/* FILTROS OFICIO */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {oficios.map(o => (
            <button key={o} onClick={() => setFiltroOficio(o)}
              style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer', fontWeight: filtroOficio === o ? '500' : '400', background: filtroOficio === o ? '#1B3A6B' : '#fff', color: filtroOficio === o ? '#fff' : '#374151', border: filtroOficio === o ? 'none' : '1px solid #E5E7EB' }}>
              {o}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>Cargando profesionales...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6B7280' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No encontramos profesionales con esos criterios.</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Intenta con otra comuna u oficio.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {filtrados.map(c => {
              const color = colorPorNombre(c.nombre)
              const comunasTexto = c.comunas?.includes('Todas las comunas de Santiago')
                ? '🗺 Toda Santiago'
                : c.comunas?.length > 0
                  ? '📍 ' + c.comunas.slice(0, 2).join(', ') + (c.comunas.length > 2 ? ` +${c.comunas.length - 2}` : '')
                  : '📍 ' + (c.comuna || '')
              return (
                <div key={c.id} onClick={() => window.location.href = '/contratista/' + c.id}
                  style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '16px' }}>
                      {iniciales(c.nombre)}
                    </div>
                    {c.verificado && (
                      <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '12px', padding: '4px 10px', borderRadius: '999px', fontWeight: '500' }}>✓ Verificado</span>
                    )}
                  </div>
                  <p style={{ fontWeight: '600', fontSize: '16px', color: '#111827', marginBottom: '4px' }}>{c.nombre}</p>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>{c.oficio} · {c.experiencia} años exp.</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{comunasTexto}</p>
                    {c.promedio_resenas ? (
                      <span style={{ fontSize: '13px', color: '#F97316', fontWeight: 600 }}>⭐ {c.promedio_resenas} ({c.total_resenas})</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Sin reseñas aún</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA CONTRATISTAS */}
        <div style={{ background: '#1B3A6B', borderRadius: '16px', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Para profesionales</p>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>¿Eres contratista?<br />Haz crecer tu negocio.</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Sin costo de registro', 'Sin comisiones', 'Contratistas verificados'].map(t => (
                <span key={t} style={{ fontSize: '14px', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#34D399' }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => window.location.href = '/registro'}
              style={{ background: '#F97316', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
              Comenzar gratis →
            </button>
            <span style={{ fontSize: '13px', color: '#93C5FD' }}>No se requiere ningún tipo de pago</span>
          </div>
        </div>
      </div>
    </div>
  )
}