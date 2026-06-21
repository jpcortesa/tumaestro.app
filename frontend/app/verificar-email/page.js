'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function VerificarEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [estado, setEstado] = useState('verificando') // verificando | ok | error
  const [mensaje, setMensaje] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!token) {
      setEstado('error')
      setMensaje('Link inválido. No se encontró el token de verificación.')
      return
    }
    verificar()
  }, [token])

  async function verificar() {
    try {
      const res = await fetch(`${API}/api/verificar-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (res.ok) {
        setEstado('ok')
      } else {
        setEstado('error')
        setMensaje(data.error || 'Error al verificar el email.')
      }
    } catch {
      setEstado('error')
      setMensaje('Error de conexión. Intenta nuevamente.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>

        <div style={{ marginBottom: '24px' }}>
          <span onClick={() => window.location.href = '/'} style={{ fontSize: '22px', fontWeight: 700, cursor: 'pointer', color: '#1B3A6B' }}>
            tumaestro<span style={{ color: '#F97316' }}>.app</span>
          </span>
        </div>

        {estado === 'verificando' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Verificando tu email...</h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Un momento, estamos activando tu cuenta.</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <div style={{ width: '64px', height: '64px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✓</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>¡Email verificado!</h2>
            <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '8px', lineHeight: '1.6' }}>
              Tu cuenta está activa. Ya puedes iniciar sesión y comenzar a recibir clientes.
            </p>
            <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px 16px', marginBottom: '28px' }}>
              <p style={{ fontSize: '13px', color: '#065F46', margin: 0 }}>
                📸 Recuerda subir tu foto de perfil desde Configuración para activar tu perfil público.
              </p>
            </div>
            <button onClick={() => window.location.href = '/login'}
              style={{ width: '100%', padding: '14px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Iniciar sesión →
            </button>
          </>
        )}

        {estado === 'error' && (
          <>
            <div style={{ width: '64px', height: '64px', background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>✗</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#991B1B', marginBottom: '12px' }}>No se pudo verificar</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', lineHeight: '1.6' }}>{mensaje}</p>
            <button onClick={() => window.location.href = '/login'}
              style={{ width: '100%', padding: '14px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px' }}>
              Ir al inicio de sesión
            </button>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              Desde el inicio de sesión puedes solicitar un nuevo link de verificación.
            </p>
          </>
        )}

      </div>
    </div>
  )
}

export default function VerificarEmail() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6B7280' }}>Cargando...</p>
      </div>
    }>
      <VerificarEmailForm />
    </Suspense>
  )
}