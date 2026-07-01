'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function ReactivarCuentaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [estado, setEstado] = useState('cargando'); // cargando, listo, procesando, exito, error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('Link inválido o expirado');
      return;
    }

    // Validar que el token sea válido (GET para verificar)
    const verificarToken = async () => {
      try {
        // Intentamos hacer POST directamente para no añadir complejidad
        // El backend validará el token
        setEstado('listo');
      } catch (err) {
        setEstado('error');
        setMensaje('Error al procesar el link');
      }
    };

    verificarToken();
  }, [token]);

  const handleReactivar = async () => {
    if (!token) return;

    setEstado('procesando');
    setMensaje('');

    try {
      const response = await fetch(`${API}/api/configuracion/reactivar-con-token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEstado('error');
        setMensaje(data.error || 'Error al reactivar la cuenta');
        return;
      }

      setEstado('exito');
      setMensaje('¡Tu cuenta ha sido reactivada exitosamente!');

      // Redirigir al login en 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setEstado('error');
      setMensaje('Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        {estado === 'cargando' && (
          <>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                animation: 'spin 1s linear infinite',
              }}
            >
              ⏳
            </div>
            <h1
              style={{
                fontSize: '24px',
                color: '#1B3A6B',
                marginBottom: '10px',
              }}
            >
              Verificando link...
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              Espera un momento mientras validamos tu solicitud
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {estado === 'listo' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
            <h1
              style={{
                fontSize: '24px',
                color: '#1B3A6B',
                marginBottom: '10px',
              }}
            >
              ¿Deseas reactivar tu cuenta?
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '30px' }}>
              Podrás volver a acceder a tu panel y recibir nuevas solicitudes de clientes.
            </p>

            <button
              onClick={handleReactivar}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '12px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#047857')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#059669')}
            >
              Sí, reactivar mi cuenta
            </button>

            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: '#E5E7EB',
                color: '#374151',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#D1D5DB')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#E5E7EB')}
            >
              Cancelar
            </button>
          </>
        )}

        {estado === 'procesando' && (
          <>
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
                animation: 'spin 1s linear infinite',
              }}
            >
              ⏳
            </div>
            <h1
              style={{
                fontSize: '24px',
                color: '#1B3A6B',
                marginBottom: '10px',
              }}
            >
              Reactivando tu cuenta...
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              Esto solo toma un momento
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {estado === 'exito' && (
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h1
              style={{
                fontSize: '24px',
                color: '#059669',
                marginBottom: '10px',
              }}
            >
              ¡Bienvenido de vuelta!
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '20px' }}>
              Tu cuenta ha sido reactivada exitosamente. Redirigiendo al login...
            </p>
            <div
              style={{
                display: 'inline-block',
                width: '30px',
                height: '30px',
                border: '3px solid #059669',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {estado === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h1
              style={{
                fontSize: '24px',
                color: '#DC2626',
                marginBottom: '10px',
              }}
            >
              {mensaje}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '30px' }}>
              El link puede estar expirado o ya fue utilizado.
            </p>

            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: '#1B3A6B',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#1e40af')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#1B3A6B')}
            >
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}