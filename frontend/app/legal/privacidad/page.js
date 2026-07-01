'use client'

export default function PrivacidadPage() {
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
          <h1 style={{ margin: '0 0 16px', fontSize: '2.5em', fontWeight: '700', color: '#111827' }}>Política de Privacidad</h1>
          <p style={{ margin: 0, fontSize: '1em', color: '#6B7280' }}>tumaestro.app | Última actualización: Junio 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ lineHeight: '1.8' }}>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>1. Introducción</h2>
            <p>En <strong>tumaestro.app</strong>, nos comprometemos a proteger tu privacidad y garantizar que comprendas cómo recopilamos, usamos y protegemos tus datos personales.</p>
            <p>Esta Política de Privacidad se aplica a:</p>
            <ul style={{ color: '#374151' }}>
              <li>Contratistas independientes</li>
              <li>Clientes que solicitan servicios</li>
              <li>Todos los usuarios de tumaestro.app</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>2. Información que recopilamos</h2>
            
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>2.1 Datos de Identidad</h3>
            <ul style={{ color: '#374151' }}>
              <li>Nombre completo</li>
              <li>RUT/Cédula de identidad</li>
              <li>Foto de perfil</li>
              <li>Email</li>
              <li>Teléfono</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>2.2 Datos Comerciales (Contratistas)</h3>
            <ul style={{ color: '#374151' }}>
              <li>Oficios/profesiones</li>
              <li>Años de experiencia</li>
              <li>Descripción de servicios</li>
              <li>Comunas donde prestas servicio</li>
            </ul>

            <h3 style={{ fontSize: '1.1em', fontWeight: '600', color: '#1F2937', marginTop: '24px', marginBottom: '12px' }}>2.3 Información recopilada automáticamente</h3>
            <ul style={{ color: '#374151' }}>
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas</li>
              <li>Fecha y hora de acceso</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>3. Cómo usamos tus datos</h2>
            <p>Usamos tus datos SOLO para:</p>
            <ul style={{ color: '#374151' }}>
              <li>Prestar el servicio (crear cuenta, procesar cotizaciones)</li>
              <li>Mejorar la plataforma</li>
              <li>Seguridad (prevenir fraude)</li>
              <li>Comunicación</li>
              <li>Marketing (solo con tu consentimiento)</li>
            </ul>
            <p style={{ background: '#F9FAFB', padding: '16px', borderRadius: '6px', borderLeft: '4px solid #6B7280' }}>
              <strong>Nunca vendemos tus datos a terceros.</strong>
            </p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>4. Protección de tus datos</h2>
            <p>Usamos encriptación de nivel empresarial:</p>
            <ul style={{ color: '#374151' }}>
              <li>SSL/TLS en tránsito (HTTPS)</li>
              <li>Encriptación AES-256 en reposo</li>
              <li>Bcrypt para contraseñas</li>
              <li>Acceso limitado a personal autorizado</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>5. Compartición de datos</h2>
            <p>Compartimos datos SOLO en estos casos:</p>
            <ul style={{ color: '#374151' }}>
              <li>Con otros usuarios (lo mínimo necesario)</li>
              <li>Con proveedores de servicios (email, hosting)</li>
              <li>Con autoridades (si lo requiere la ley)</li>
            </ul>
            <p style={{ marginTop: '20px' }}><strong>Nunca compartimos:</strong></p>
            <ul style={{ color: '#374151' }}>
              <li>Con terceros para marketing</li>
              <li>Datos vendidos a otros</li>
              <li>Información sin tu consentimiento</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>6. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul style={{ color: '#374151' }}>
              <li><strong>Acceder</strong> - Solicitar copia de tus datos (15 días hábiles)</li>
              <li><strong>Rectificar</strong> - Corregir datos inexactos</li>
              <li><strong>Eliminar</strong> - Solicitar borrado (excepto requisito legal)</li>
              <li><strong>Portabilidad</strong> - Obtener datos en formato estándar</li>
              <li><strong>Oposición</strong> - No recibir marketing</li>
            </ul>
            <p style={{ marginTop: '20px' }}><strong>Contacto para derechos:</strong></p>
            <p>privacidad@tumaestro.app</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>7. Eliminación de cuenta</h2>
            <p>Si eliminas tu cuenta:</p>
            <ul style={{ color: '#374151' }}>
              <li>Tu perfil se desactiva</li>
              <li>Datos personales se anonimizán</li>
              <li>Histórico de trabajos se mantiene (por ley, 3 años)</li>
              <li>Puedes solicitar eliminación completa (aplican excepciones legales)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>8. Cambios a esta política</h2>
            <p>Podemos actualizar esta política. Te avisaremos por email si hay cambios significativos. Tienes 30 días para aceptar o rechazar. Si rechazas, puedes eliminar tu cuenta sin penalidad.</p>
          </section>

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: '700', color: '#111827', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>9. Contacto</h2>
            <p><strong>Para preguntas sobre privacidad:</strong></p>
            <ul style={{ color: '#374151', listStyle: 'none', padding: 0 }}>
              <li>Email: privacidad@tumaestro.app</li>
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