'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!token) setError('Link inválido. Solicita uno nuevo.')
  }, [token])

  async function enviar() {
    if (!password || password.length < 8) { setError('Mínimo 8 caracteres'); return }
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return }
    setCargando(true); setError('')
    try {
      const res = await fetch(`${API}/api/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if (res.ok) setExito(true)
      else setError(data.error || 'Error al restablecer la contraseña')
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

        {exito ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>¡Contraseña actualizada!</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <button onClick={() => window.location.href = '/login'}
              style={{ width: '100%', padding: '12px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Ir al inicio de sesión
            </button>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Nueva contraseña</h1>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px' }}>Elige una contraseña segura de al menos 8 caracteres.</p>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#991B1B', margin: 0 }}>✗ {error}</p>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Nueva contraseña</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Mínimo 8 caracteres"
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Confirmar contraseña</label>
              <input type="password" value={confirmar} onChange={e => { setConfirmar(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && enviar()} placeholder="Repite tu contraseña"
                style={{ width: '100%', border: `1px solid ${confirmar && password !== confirmar ? '#EF4444' : confirmar && password === confirmar ? '#059669' : '#E5E7EB'}`, borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              {confirmar && password === confirmar && <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Las contraseñas coinciden</p>}
            </div>

            <button onClick={enviar} disabled={cargando || !token}
              style={{ width: '100%', padding: '12px', background: cargando ? '#9CA3AF' : '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: cargando ? 'not-allowed' : 'pointer' }}>
              {cargando ? 'Actualizando...' : 'Guardar nueva contraseña'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6B7280' }}>Cargando...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
