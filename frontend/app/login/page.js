'use client'

import { useState } from 'react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const actualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

  const iniciarSesion = async () => {
    setError('')
    setCargando(true)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
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
        setError('Email o contrasena incorrectos')
      }
    } catch (err) {
      setError('Error de conexion con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>

      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>
          tumaestro<span style={{ color: '#F97316' }}>.app</span>
        </span>
        <span style={{ color: '#93C5FD', fontSize: '14px' }}>
          No tienes cuenta? <span onClick={() => window.location.href = '/registro'} style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>Registrate gratis</span>
        </span>
      </nav>

      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Bienvenido de vuelta</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Inicia sesion en tu cuenta</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px' }}>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#DC2626', margin: 0 }}>⚠ {error}</p>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Contrasena</label>
              <span style={{ fontSize: '13px', color: '#1B3A6B', cursor: 'pointer' }}>Olvide mi contrasena</span>
            </div>
            <input
              value={form.password}
              onChange={e => actualizar('password', e.target.value)}
              placeholder="Tu contrasena"
              type="password"
              onKeyDown={e => e.key === 'Enter' && iniciarSesion()}
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={iniciarSesion}
            disabled={cargando}
            style={{ background: cargando ? '#9CA3AF' : '#1B3A6B', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: cargando ? 'not-allowed' : 'pointer', marginBottom: '16px' }}
          >
            {cargando ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              No tienes cuenta? <span onClick={() => window.location.href = '/registro'} style={{ color: '#1B3A6B', fontWeight: '500', cursor: 'pointer' }}>Registrate gratis</span>
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
