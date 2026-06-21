'use client'
import { useState } from 'react'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function enviar() {
    if (!email.trim()) { setError('Ingresa tu email'); return }
    setCargando(true); setError('')
    try {
      await fetch(`${API}/api/solicitar-reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      setEnviado(true)
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span onClick={() => window.location.href = '/'} style={{ fontSize: '22px', fontWeight: 700, cursor: 'pointer', color: '#1B3A6B' }}>
            tumaestro<span style={{ color: '#F97316' }}>.app</span>
          </span>
        </div>

        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Revisa tu correo</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
              Si ese email está registrado, recibirás un link para restablecer tu contraseña. El link es válido por 2 horas.
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '24px' }}>¿No llegó? Revisa tu carpeta de spam.</p>
            <button onClick={() => window.location.href = '/login'}
              style={{ width: '100%', padding: '12px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>¿Olvidaste tu contraseña?</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px', lineHeight: '1.5' }}>
              Ingresa tu email y te enviaremos un link para crear una nueva contraseña.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && enviar()}
                placeholder="tu@email.com"
                style={{ width: '100%', border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`, borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              {error && <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0' }}>{error}</p>}
            </div>
            <button onClick={enviar} disabled={cargando}
              style={{ width: '100%', padding: '12px', background: cargando ? '#9CA3AF' : '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: cargando ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
              {cargando ? 'Enviando...' : 'Enviar link de recuperación'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <span onClick={() => window.location.href = '/login'} style={{ fontSize: '13px', color: '#1B3A6B', cursor: 'pointer', textDecoration: 'underline' }}>
                Volver al inicio de sesión
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
