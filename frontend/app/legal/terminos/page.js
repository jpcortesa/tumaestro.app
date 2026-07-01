'use client'

export default function TerminosPage() {
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
          <h1 style={{ margin: '0 0 16px', fontSize: '2.5em', fontWeight: '700', color: '#111827' }}>Términos y Condiciones</h1>
          <p style={{ margin: 0, fontSize: '1em', color: '#6B7280' }}>tumaestro.app | Última actualización: Junio 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ lineHeight: '1.8' }}>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>1. Aceptación de términos</h2>
            <p>Al acceder y usar tumaestro.app, aceptas estar legalmente vinculado por estos Términos y Condiciones.</p>
            <p style={{ background: '#FEE2E2', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #DC2626', color: '#7F1D1D' }}>
              Si no aceptas, NO puedes usar la plataforma.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>2. Descripción del servicio</h2>
            <p>tumaestro.app es una plataforma de conexión que:</p>
            <ul style={{ color: '#374151' }}>
              <li>Conecta contratistas independientes con clientes</li>
              <li>Facilita cotizaciones y presupuestos</li>
              <li>Permite gestión de trabajos</li>
              <li>Habilita reseñas y calificaciones</li>
            </ul>
            <p style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #6B7280', marginTop: '20px' }}>
              <strong>Lo importante:</strong> NO somos empleadores ni agencia. Solo facilitamos la conexión entre usuarios.
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>3. Elegibilidad y registro</h2>
            <p>Debes:</p>
            <ul style={{ color: '#374151' }}>
              <li>Tener 18+ años</li>
              <li>Estar en Chile (Gran Santiago)</li>
              <li>Tener email válido</li>
              <li>Tener teléfono válido</li>
              <li>Proporcionar información real y actual</li>
            </ul>
            <p><strong>Consecuencia de información falsa:</strong> Eliminación inmediata sin reembolso.</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>4. Cotizaciones y pagos</h2>
            <p><strong>Sistema de pagos:</strong></p>
            <ul style={{ color: '#374151' }}>
              <li>Cliente paga a tumaestro</li>
              <li>tumaestro retiene % pequeño (plataforma, seguridad)</li>
              <li>Contratista recibe el resto después del trabajo completado</li>
            </ul>
            <p style={{ marginTop: '20px' }}><strong>Reembolsos:</strong> Se aceptan solo en caso de problema técnico, fraude detectado, o disputa resuelta.</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>5. Desactivación y eliminación de cuenta</h2>
            
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>5.1 Desactivación (Solicitud del usuario)</h3>
            <p>Si quieres desactivar tu cuenta voluntariamente:</p>
            <ol style={{ color: '#374151' }}>
              <li>Solicitas desactivación desde tu panel</li>
              <li>Recibes email de confirmación con link de reactivación</li>
              <li>Tu cuenta entra en Período de Gracia de 30 días</li>
              <li>Durante 30 días: puedes reactivarla con 1 click</li>
            </ol>
            
            <p style={{ marginTop: '20px' }}>Durante los 30 días:</p>
            <ul style={{ color: '#374151' }}>
              <li>Tu perfil se oculta (no aparece en búsquedas)</li>
              <li>No puedes iniciar sesión</li>
              <li>Tus datos se protegen (no se borran)</li>
              <li>Puedes reactivar con el link de email</li>
            </ul>

            <p style={{ marginTop: '20px' }}>Después de 30 días:</p>
            <ul style={{ color: '#374151' }}>
              <li>Tu cuenta se elimina permanentemente</li>
              <li>Tus datos se anonimizán según LSIC</li>
              <li>Histórico legal se mantiene (3 años mínimo)</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>5.2 Reactivación</h3>
            <p>Si desactivaste tu cuenta, puedes reactivarla:</p>
            <ul style={{ color: '#374151' }}>
              <li>Dentro de 30 días: Click en link del email → Tu cuenta vuelve a funcionar</li>
              <li>Después de 30 días: Ya no puedes reactivar. Debes crear una nueva cuenta.</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>5.3 Suspensión (Por violaciones)</h3>
            <p>tumaestro.app puede suspender tu cuenta por violaciones graves:</p>
            <ul style={{ color: '#374151' }}>
              <li>Temporal (14-30 días): Reseña falsa, comunicación inapropiada</li>
              <li>Permanente (sin período de gracia): Violaciones graves, fraude, abuso</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>6. Conducta aceptable</h2>
            <p>Los siguientes actos resultan en eliminación inmediata sin reembolso:</p>
            <ul style={{ color: '#374151' }}>
              <li>Acoso, abuso o amenazas</li>
              <li>Discriminación por raza, género, religión</li>
              <li>Identidades falsas o documentos falsificados</li>
              <li>Abuso de menores</li>
              <li>Venta de drogas o servicios ilegales</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>7. Reseñas y calificaciones</h2>
            <p>Después de cada trabajo, los usuarios pueden calificar y comentar. Las reseñas son permanentes.</p>
            <p><strong>Permitido:</strong> Comentarios honestos, crítica constructiva, detalles específicos</p>
            <p><strong>NO permitido:</strong> Lenguaje abusivo, mentiras, publicidad, información personal ajena</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>8. Responsabilidad legal</h2>
            <p>tumaestro NO es responsable por:</p>
            <ul style={{ color: '#374151' }}>
              <li>Accidentes o lesiones</li>
              <li>Daño a propiedad</li>
              <li>Incumplimiento contractual entre usuarios</li>
              <li>Problemas de calidad del trabajo</li>
            </ul>
            <p style={{ marginTop: '20px' }}><strong>Máximo a pagar:</strong> El monto de la transacción en disputa (o $100.000 CLP, lo que sea menor)</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>9. Ley y jurisdicción</h2>
            <p>Estos términos se rigen por leyes de Chile. Tribunales competentes: Santiago, Chile. Acuerdo de arbitraje (no litigio en cortes).</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>10. Contacto</h2>
            <p><strong>Para preguntas sobre Términos:</strong></p>
            <ul style={{ color: '#374151', listStyle: 'none', padding: 0 }}>
              <li>Email: legal@tumaestro.app</li>
              <li>Formulario: https://tumaestro.app/contacto</li>
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