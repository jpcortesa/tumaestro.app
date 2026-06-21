'use client'

import { useState } from 'react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [emailNoVerificado, setEmailNoVerificado] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [reenviado, setReenviado] = useState(false)

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const actualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

  const iniciarSesion = async () => {
    setError(''); setEmailNoVerificado(false); setReenviado(false)
    setCargando(true)
    try {
      const res = await fetch(`${API}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.email, password: form.password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.access)
        localStorage.setItem('refresh', data.refresh)
        window.location.href = '/panel'
      } else {
        // Detectar error de email no verificado
        const msg = data.detail || data.error || ''
        if (msg.includes('EMAIL_NO_VERIFICADO') || msg.includes('No active account')) {
          // Intentar determinar si es por no verificado
          setEmailNoVerificado(true)
        } else {
          setError('Email o contraseña incorrectos')
        }
      }
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setCargando(false)
    }
  }

  const reenviarVerificacion = async () => {
    setReenviando(true)
    try {
      await fetch(`${API}/api/reenviar-verificacion/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      })
      setReenviado(true)
    } catch {
      setError('Error al reenviar. Intenta nuevamente.')
    }
    setReenviando(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>

      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>
          tumaestro<span style={{ color: '#F97316' }}>.app</span>
        </span>
        <span style={{ color: '#93C5FD', fontSize: '14px' }}>
          ¿No tienes cuenta? <span onClick={() => window.location.href = '/registro'} style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>Regístrate gratis</span>
        </span>
      </nav>

      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Bienvenido de vuelta</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Inicia sesión en tu cuenta</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px' }}>

          {/* Error genérico */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#DC2626', margin: 0 }}>⚠ {error}</p>
            </div>
          )}

          {/* Email no verificado */}
          {emailNoVerificado && (
            <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E', margin: '0 0 6px' }}>📧 Debes verificar tu email</p>
              <p style={{ fontSize: '13px', color: '#92400E', margin: '0 0 12px', lineHeight: '1.5' }}>
                Tu cuenta aún no está activada. Revisa tu correo y haz click en el link de verificación que te enviamos.
              </p>
              {reenviado ? (
                <p style={{ fontSize: '13px', color: '#059669', fontWeight: 600, margin: 0 }}>✓ Nuevo link enviado — revisa tu correo</p>
              ) : (
                <button onClick={reenviarVerificacion} disabled={reenviando}
                  style={{ background: reenviando ? '#9CA3AF' : '#F97316', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: reenviando ? 'not-allowed' : 'pointer' }}>
                  {reenviando ? 'Enviando...' : 'Reenviar link de verificación'}
                </button>
              )}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              value={form.email}
              onChange={e => actualizar('email', e.target.value)}
              placeholder="tu@email.com"
              type="email"
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Contraseña</label>
              <span onClick={() => window.location.href = '/recuperar-password'}
                style={{ fontSize: '12px', color: '#1B3A6B', cursor: 'pointer', textDecoration: 'underline' }}>
                ¿Olvidaste tu contraseña?
              </span>
            </div>
            <input
              value={form.password}
              onChange={e => actualizar('password', e.target.value)}
              placeholder="Tu contraseña"
              type="password"
              onKeyDown={e => e.key === 'Enter' && iniciarSesion()}
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={iniciarSesion} disabled={cargando}
            style={{ background: cargando ? '#9CA3AF' : '#1B3A6B', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: cargando ? 'not-allowed' : 'pointer', marginBottom: '16px' }}>
            {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              ¿No tienes cuenta? <span onClick={() => window.location.href = '/registro'} style={{ color: '#1B3A6B', fontWeight: '500', cursor: 'pointer' }}>Regístrate gratis</span>
            </span>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
          {['Datos seguros', 'Sin spam', 'Cancela cuando quieras'].map(t => (
            <span key={t} style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#059669' }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}