'use client'

export default function SeguridadPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', color: '#1F2937' }}>
      {/* NAV */}
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ color: '#fff', fontSize: '20px', fontWeight: '600', textDecoration: 'none' }}>
          tumaestro<span style={{ color: '#F97316' }}>.app</span>
        </a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/como-funciona" style={{ color: '#93C5FD', fontSize: '14px', textDecoration: 'none' }}>¿Cómo funciona?</a>
          <button
            onClick={() => window.location.href = '/login'}
            style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            Iniciar sesión contratista
          </button>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '64px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 16px', fontSize: '2.5em', fontWeight: '700', color: '#111827' }}>Centro de Seguridad</h1>
          <p style={{ margin: 0, fontSize: '1em', color: '#6B7280' }}>tumaestro.app | Última actualización: Junio 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ lineHeight: '1.8' }}>

          <section style={{ marginBottom: '48px', padding: '24px', background: '#FEE2E2', borderRadius: '6px', borderLeft: '4px solid #DC2626' }}>
            <h3 style={{ margin: '0 0 12px', color: '#7F1D1D', fontWeight: '600' }}>Emergencia: Violencia o peligro inmediato</h3>
            <p style={{ margin: '8px 0', color: '#7F1D1D' }}>Llama inmediatamente a:</p>
            <p style={{ margin: '8px 0', fontSize: '1.3em', fontWeight: '700', color: '#7F1D1D' }}>133 (Carabineros)</p>
            <p style={{ margin: '8px 0', color: '#7F1D1D', fontSize: '0.95em' }}>Luego notificanos a seguridad@tumaestro.app</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>1. Cómo reportar un problema</h2>
            
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>1.1 Tipos de reportes que aceptamos</h3>
            <ul style={{ color: '#374151' }}>
              <li>Fraude o estafa</li>
              <li>Acoso o abuso</li>
              <li>Problema con pago</li>
              <li>Contenido inapropiado</li>
              <li>Acceso no autorizado</li>
              <li>Identidad falsa</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>1.2 Cómo reportar</h3>
            <ol style={{ color: '#374151' }}>
              <li>Opción 1: Botón "Reportar" en cotización/trabajo</li>
              <li>Opción 2: Email a seguridad@tumaestro.app</li>
              <li>Opción 3: Formulario en https://tumaestro.app/contacto</li>
              <li>Opción 4: Emergencia - Llama 133</li>
            </ol>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>1.3 Información que necesitamos</h3>
            <ul style={{ color: '#374151' }}>
              <li>Tipo de problema</li>
              <li>Nombre/email del usuario reportado</li>
              <li>Fecha y hora del incidente</li>
              <li>Descripción detallada</li>
              <li>Capturas o evidencia (si tienes)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>2. Verificación de usuarios</h2>
            
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>2.1 Verificación para Contratistas</h3>
            <ul style={{ color: '#374151' }}>
              <li>Email verificado (obligatorio)</li>
              <li>Teléfono verificado (obligatorio)</li>
              <li>RUT verificado (recomendado para facturación)</li>
              <li>Revisión de perfil por fraude</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>2.2 Verificación para Clientes</h3>
            <ul style={{ color: '#374151' }}>
              <li>Email verificado (obligatorio)</li>
              <li>Teléfono validado</li>
              <li>Historial visible a contratistas</li>
            </ul>

            <p style={{ marginTop: '20px', background: '#F9FAFB', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #6B7280' }}>
              <strong>Nota:</strong> Información falsa resulta en eliminación inmediata sin reembolso.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>3. Sistemas anti-fraude</h2>
            <p>Usamos tecnología avanzada para protegerte:</p>
            <ul style={{ color: '#374151' }}>
              <li>Detección de patrones sospechosos (24/7)</li>
              <li>Análisis de transacciones inusuales</li>
              <li>Verificación de identidad</li>
              <li>Reporte de usuarios por otros usuarios</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>¿Qué pasa si detectamos fraude?</h3>
            <ol style={{ color: '#374151' }}>
              <li>Se congela la cuenta inmediatamente</li>
              <li>Investigación (24-48h)</li>
              <li>Resultado comunicado al usuario</li>
              <li>Posible eliminación sin reembolso</li>
            </ol>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>4. Protección de pagos</h2>
            <p><strong>Tu dinero está seguro.</strong></p>
            
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>4.1 Sistema de Escrow (depósito seguro)</h3>
            <ol style={{ color: '#374151' }}>
              <li>Cliente paga a tumaestro (dinero seguro)</li>
              <li>Contratista realiza trabajo</li>
              <li>Cliente verifica y aprueba</li>
              <li>Dinero se libera al contratista</li>
            </ol>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>4.2 Si hay disputa</h3>
            <ol style={{ color: '#374151' }}>
              <li>Usuarios intentan resolver (7 días)</li>
              <li>tumaestro investiga (5 días)</li>
              <li>tumaestro decide (7 días)</li>
              <li>Se devuelve según decisión</li>
            </ol>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>5. Protección de menores</h2>
            <p><strong>tumaestro.app tiene CERO tolerancia con abuso de menores.</strong></p>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>5.1 Política</h3>
            <ul style={{ color: '#374151' }}>
              <li>NO permitimos usuarios menores de 18 años</li>
              <li>NO permitimos contenido sexual de menores</li>
              <li>NO permitimos explotación infantil</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>5.2 Si detectamos</h3>
            <ol style={{ color: '#374151' }}>
              <li>Eliminación inmediata de la cuenta</li>
              <li>Datos reportados a autoridades (PDI, Fiscalía)</li>
              <li>Posible denuncia criminal</li>
            </ol>

            <p style={{ marginTop: '20px', background: '#FEE2E2', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #DC2626', color: '#7F1D1D' }}>
              Si conoces de un menor siendo explotado, llama a ABOFAM: 1410 o PDI: 135
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>6. Contacto</h2>
            <p><strong>Para reportes de seguridad:</strong></p>
            <ul style={{ color: '#374151', listStyle: 'none', padding: 0 }}>
              <li>Email: seguridad@tumaestro.app</li>
              <li>Formulario: https://tumaestro.app/contacto</li>
              <li>Respuesta: 24 horas</li>
            </ul>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '0.9em', color: '#6B7280' }}>
          © 2026 tumaestro.app | 
          <a href="/legal/privacidad" style={{ color: '#1F2937', textDecoration: 'none', fontWeight: '500' }}> Privacidad</a> |
          <a href="/legal/terminos" style={{ color: '#1F2937', textDecoration: 'none', fontWeight: '500' }}> Términos</a> |
          <a href="/legal/seguridad" style={{ color: '#1F2937', textDecoration: 'none', fontWeight: '500' }}> Seguridad</a>
        </p>
      </div>
    </div>
  )
}