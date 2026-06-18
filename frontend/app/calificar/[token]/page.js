'use client'

import { useEffect, useState, use } from 'react'

export default function CalificarTrabajo({ params }) {
  const { token } = use(params)
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [yaCalificado, setYaCalificado] = useState(false)
  const [datos, setDatos] = useState(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    if (!token) return
    fetch(`${API}/api/trabajos/${token}/calificar/`)
      .then(res => res.json())
      .then(data => {
        if (data.error) { setError(data.error); setCargando(false); return }
        setDatos(data)
        setYaCalificado(data.ya_calificado)
        setCargando(false)
      })
      .catch(() => { setError('No se pudo cargar la información'); setCargando(false) })
  }, [token])

  async function enviarCalificacion() {
    if (rating === 0) { alert('Por favor selecciona una calificación'); return }
    setEnviando(true)
    const res = await fetch(`${API}/api/trabajos/${token}/calificar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comentario })
    })
    const data = await res.json()
    if (res.ok) {
      setEnviado(true)
    } else {
      alert(data.error || 'Error al enviar la reseña')
    }
    setEnviando(false)
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Cargando...</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
        <h2 style={{ color: '#1B3A6B', marginBottom: '8px' }}>Link no válido</h2>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>{error}</p>
      </div>
    </div>
  )

  if (yaCalificado) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#1B3A6B', marginBottom: '8px' }}>¡Ya calificaste este trabajo!</h2>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Tu reseña ya fue registrada. Gracias por tu opinión.</p>
      </div>
    </div>
  )

  if (enviado) return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', maxWidth: '440px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ color: '#1B3A6B', fontSize: '22px', marginBottom: '8px' }}>¡Gracias por tu reseña!</h2>
        <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '24px' }}>
          Tu opinión ayuda a otros clientes a encontrar buenos profesionales.
        </p>
        <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ fontSize: '28px', margin: '0 0 4px' }}>{'⭐'.repeat(rating)}</p>
          {comentario && <p style={{ fontSize: '14px', color: '#374151', margin: 0, fontStyle: 'italic' }}>"{comentario}"</p>}
        </div>
        <a href="/" style={{ display: 'inline-block', background: '#1B3A6B', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Ver más contratistas →
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#1B3A6B', fontSize: '20px', fontWeight: '700' }}>
            tumaestro<span style={{ color: '#F97316' }}>.app</span>
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '16px 0 6px' }}>
            ¿Cómo te fue con {datos?.contratista}?
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            {datos?.contratista_oficio} · {datos?.trabajo}
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, display: 'block', marginBottom: '10px' }}>
            Calificación *
          </label>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                style={{ fontSize: '40px', cursor: 'pointer', transition: 'transform 0.1s', transform: (hover || rating) >= n ? 'scale(1.15)' : 'scale(1)', filter: (hover || rating) >= n ? 'none' : 'grayscale(1) opacity(0.4)' }}
              >
                ⭐
              </span>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#F97316', fontWeight: 600, marginTop: '8px' }}>
              {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!'][rating]}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
            Comentario <span style={{ fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Cuéntanos cómo fue tu experiencia..."
            rows={3}
            style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <button
          onClick={enviarCalificacion}
          disabled={enviando}
          style={{ width: '100%', padding: '14px', background: enviando ? '#9CA3AF' : '#F97316', color: 'white', border: 'none', borderRadius: '8px', cursor: enviando ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '16px' }}
        >
          {enviando ? 'Enviando...' : '⭐ Enviar calificación'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '16px' }}>
          tumaestro.app — La plataforma para contratistas independientes en Chile
        </p>
      </div>
    </div>
  )
}