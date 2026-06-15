'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const colores = ['#1B3A6B', '#0F6E56', '#534AB7', '#854F0B', '#B45309', '#065F46']

function iniciales(nombre) {
  return nombre?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function colorPorNombre(nombre) {
  let hash = 0
  for (let i = 0; i < (nombre?.length || 0); i++) hash += nombre.charCodeAt(i)
  return colores[hash % colores.length]
}

export default function PerfilContratista() {
  const params = useParams()
  const [contratista, setContratista] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formSolicitud, setFormSolicitud] = useState({ nombre_cliente: '', telefono_cliente: '', email_cliente: '', descripcion: '' })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API}/api/publico/contratistas/${params.id}/`)
      .then(res => res.json())
      .then(data => { setContratista(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  async function enviarSolicitud() {
    if (!formSolicitud.nombre_cliente || !formSolicitud.telefono_cliente || !formSolicitud.descripcion) {
      alert('Por favor completa nombre, teléfono y descripción')
      return
    }
    setEnviando(true)
    const res = await fetch(`${API}/api/publico/contratistas/${params.id}/solicitud/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formSolicitud)
    })
    setEnviando(false)
    if (res.ok) setEnviado(true)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#6B7280' }}>Cargando perfil...</p>
    </div>
  )

  if (!contratista || contratista.error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#EF4444' }}>Contratista no encontrado.</p>
    </div>
  )

  const color = colorPorNombre(contratista.nombre)

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span onClick={() => window.location.href = '/'} style={{ color: '#93C5FD', fontSize: '14px', cursor: 'pointer' }}>Volver al directorio</span>
          <button onClick={() => window.location.href = '/registro'} style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Soy contratista</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>

          {/* COLUMNA IZQUIERDA */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '28px', flexShrink: 0 }}>
                  {iniciales(contratista.nombre)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>{contratista.nombre}</h1>
                    {contratista.verificado && (
                      <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '13px', padding: '4px 12px', borderRadius: '999px', fontWeight: '500' }}>Verificado</span>
                    )}
                  </div>
                  <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '12px' }}>
                    {contratista.oficio} · {contratista.experiencia} años de experiencia · {contratista.comuna}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                {[
                  { label: 'Trabajos realizados', valor: '—' },
                  { label: 'Tiempo de respuesta', valor: '< 1 hora' },
                  { label: 'Satisfaccion', valor: '—' }
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', background: '#F8F9FA', borderRadius: '10px', padding: '16px' }}>
                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px' }}>{m.valor}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Sobre mi</h2>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7' }}>
                {contratista.descripcion || 'Este profesional aún no ha completado su descripción.'}
              </p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Reseñas verificadas</h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Aún no hay reseñas para este profesional.</p>
            </div>
          </div>

          {/* COLUMNA DERECHA — FORMULARIO */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', position: 'sticky', top: '24px' }}>
              {enviado ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  <h3 style={{ fontWeight: 700, color: '#1B3A6B', marginBottom: '8px' }}>¡Solicitud enviada!</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                    {contratista.nombre} recibirá tu solicitud y se pondrá en contacto contigo pronto.
                  </p>
                  <button onClick={() => { setEnviado(false); setFormSolicitud({ nombre_cliente: '', telefono_cliente: '', email_cliente: '', descripcion: '' }) }}
                    style={{ marginTop: '16px', background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}>
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>Solicitar cotización</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Gratis y sin compromiso</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <input
                      placeholder="Tu nombre *"
                      value={formSolicitud.nombre_cliente}
                      onChange={e => setFormSolicitud({ ...formSolicitud, nombre_cliente: e.target.value })}
                      style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="Tu teléfono *"
                      value={formSolicitud.telefono_cliente}
                      onChange={e => setFormSolicitud({ ...formSolicitud, telefono_cliente: e.target.value })}
                      style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                    <input
                      placeholder="Tu email (opcional)"
                      type="email"
                      value={formSolicitud.email_cliente}
                      onChange={e => setFormSolicitud({ ...formSolicitud, email_cliente: e.target.value })}
                      style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                    />
                    <textarea
                      placeholder="Describe el trabajo que necesitas... *"
                      rows={4}
                      value={formSolicitud.descripcion}
                      onChange={e => setFormSolicitud({ ...formSolicitud, descripcion: e.target.value })}
                      style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>* Campos obligatorios</p>
                  </div>
                  <button
                    onClick={enviarSolicitud}
                    disabled={enviando}
                    style={{ background: enviando ? '#9CA3AF' : '#F97316', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
                    {enviando ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Responde en menos de 1 hora', 'Cotización sin compromiso', 'Sin costo'].map(t => (
                      <span key={t} style={{ fontSize: '13px', color: '#6B7280' }}>✓ {t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}