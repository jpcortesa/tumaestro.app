'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function CotizacionPublica() {
  const { token } = useParams()
  const [cotizacion, setCotizacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [respondido, setRespondido] = useState(false)
  const [respuesta, setRespuesta] = useState(null)

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API}/api/cotizaciones/publica/${token}/`)
      .then(res => res.json())
      .then(data => { setCotizacion(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  async function responder(estado) {
    const res = await fetch(`${API}/api/cotizaciones/publica/${token}/responder/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })
    if (res.ok) {
      setRespondido(true)
      setRespuesta(estado)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#6B7280' }}>Cargando cotización...</p>
    </div>
  )

  if (!cotizacion || cotizacion.error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#EF4444' }}>Cotización no encontrada.</p>
    </div>
  )

  const subtotal = cotizacion.incluye_iva ? Math.round(cotizacion.monto / 1.19) : cotizacion.monto
  const iva = cotizacion.incluye_iva ? cotizacion.monto - subtotal : 0

  if (respondido) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{respuesta === 'aprobada' ? '✅' : '❌'}</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
          {respuesta === 'aprobada' ? '¡Cotización aprobada!' : 'Cotización rechazada'}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '15px' }}>
          {respuesta === 'aprobada'
            ? 'El maestro ha sido notificado y se pondrá en contacto contigo pronto.'
            : 'Has rechazado esta cotización. El maestro será notificado.'}
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: 'Inter, sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ background: '#1B3A6B', borderRadius: '16px 16px 0 0', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
          <span style={{ color: '#93C5FD', fontSize: '14px' }}>Cotización #{cotizacion.id}</span>
        </div>

        <div style={{ background: '#fff', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* ESTADO */}
          {cotizacion.estado !== 'enviada' && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '8px', background: cotizacion.estado === 'aprobada' ? '#ECFDF5' : '#FEE2E2', color: cotizacion.estado === 'aprobada' ? '#065F46' : '#991B1B', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>
              {cotizacion.estado === 'aprobada' ? '✓ Esta cotización ya fue aprobada' : '✗ Esta cotización fue rechazada'}
            </div>
          )}

          {/* PARTES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>De</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{cotizacion.contratista.nombre}</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{cotizacion.contratista.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Para</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{cotizacion.cliente.nombre}</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{cotizacion.cliente.comuna}</p>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Descripción</p>
            <p style={{ fontSize: '15px', color: '#111827', margin: 0 }}>{cotizacion.descripcion}</p>
            {cotizacion.detalle && <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{cotizacion.detalle}</p>}
          </div>

          {/* ITEMS */}
          {cotizacion.items?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Detalle</p>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px 110px', background: '#F9FAFB', padding: '10px 16px' }}>
                  {['Descripción', 'Cant.', 'Precio unit.', 'Subtotal'].map(h => (
                    <span key={h} style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {cotizacion.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px 110px', padding: '10px 16px', borderTop: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: '14px', color: '#111827' }}>{item.descripcion}</span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{item.cantidad}</span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>${item.precio_unitario?.toLocaleString('es-CL')}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>${item.subtotal?.toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOTALES */}
          <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            {cotizacion.incluye_iva && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#6B7280' }}>IVA 19%</span>
                <span style={{ color: '#92400E' }}>${iva.toLocaleString('es-CL')}</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '18px', color: '#1B3A6B' }}>${cotizacion.monto?.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* BOTONES */}
          {cotizacion.estado === 'enviada' && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => responder('rechazada')} style={{ flex: 1, padding: '14px', border: '2px solid #FCA5A5', borderRadius: '10px', background: '#FEF2F2', color: '#991B1B', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                ✗ Rechazar
              </button>
              <button onClick={() => responder('aprobada')} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '10px', background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                ✓ Aprobar cotización
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ background: '#F3F4F6', borderRadius: '0 0 16px 16px', padding: '16px 32px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Powered by tumaestro.app</span>
        </div>

      </div>
    </div>
  )
}