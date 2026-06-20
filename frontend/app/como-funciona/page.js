'use client'

export default function ComoFunciona() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>

      {/* NAV */}
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="/como-funciona" style={{ color: '#93C5FD', fontSize: '14px', textDecoration: 'none' }}>¿Cómo funciona?</a>
          <button onClick={() => window.location.href = '/registro'} style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Soy contratista</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#EEF2FF', padding: '56px 48px', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>¿Cómo funciona tumaestro.app?</h1>
        <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
          Una plataforma simple que conecta a personas que necesitan trabajo en el hogar con maestros verificados de su comuna.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 48px' }}>

        {/* PARA CONTRATISTAS */}
        <div style={{ marginBottom: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚒</div>
            <div>
              <p style={{ fontSize: '12px', color: '#F97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Para contratistas</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>Haz crecer tu negocio</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {[
              { num: '1', icono: '📝', titulo: 'Crea tu perfil gratis', texto: 'Regístrate en menos de 5 minutos. Ingresa tu oficio, comunas donde trabajas, tu experiencia y una descripción que te represente bien. Sube tu foto de perfil para generar confianza.' },
              { num: '2', icono: '📩', titulo: 'Recibe solicitudes', texto: 'Los clientes ven tu perfil en el directorio y te envían solicitudes de cotización directamente. Tú recibes una notificación por email con los datos del cliente.' },
              { num: '3', icono: '📋', titulo: 'Cotiza y trabaja', texto: 'Desde tu panel puedes crear cotizaciones profesionales y enviárselas al cliente con un link. El cliente las aprueba o rechaza en línea, y tú coordinas el trabajo.' },
            ].map(p => (
              <div key={p.num} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#1B3A6B', flexShrink: 0 }}>{p.num}</div>
                  <span style={{ fontSize: '20px' }}>{p.icono}</span>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{p.titulo}</p>
                </div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>{p.texto}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '24px' }}>⭐</span>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px' }}>Construye tu reputación</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Cuando completes un trabajo, el cliente recibe un link para calificarte. Las reseñas son verificadas y aparecen en tu perfil público, ayudándote a conseguir más clientes.</p>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button onClick={() => window.location.href = '/registro'} style={{ background: '#1B3A6B', border: 'none', color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Crear mi perfil gratis →
            </button>
          </div>
        </div>

        {/* DIVISOR */}
        <div style={{ borderTop: '2px dashed #E5E7EB', marginBottom: '72px' }} />

        {/* PARA CLIENTES */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏠</div>
            <div>
              <p style={{ fontSize: '12px', color: '#1B3A6B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Para clientes</p>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>Encuentra al profesional ideal</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {[
              { num: '1', icono: '🔍', titulo: 'Busca y elige', texto: 'Busca por tipo de servicio y tu comuna. Revisa los perfiles, lee las reseñas reales de otros clientes y elige al profesional que más te convenza.' },
              { num: '2', icono: '📤', titulo: 'Solicita una cotización', texto: 'Envía tu solicitud directamente desde el perfil del contratista. Es gratis y sin compromiso. El profesional recibirá tu consulta y se pondrá en contacto contigo.' },
              { num: '3', icono: '✅', titulo: 'Aprueba y califica', texto: 'El contratista te enviará una cotización por email. La puedes aprobar o rechazar en línea. Una vez completado el trabajo, deja tu reseña para ayudar a otros clientes.' },
            ].map(p => (
              <div key={p.num} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#F97316', flexShrink: 0 }}>{p.num}</div>
                  <span style={{ fontSize: '20px' }}>{p.icono}</span>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>{p.titulo}</p>
                </div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>{p.texto}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '24px' }}>🔒</span>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px' }}>Tu privacidad está protegida</p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Tu email y teléfono solo son visibles para el contratista al que contactes. No se muestran públicamente en ningún lugar de la plataforma.</p>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button onClick={() => window.location.href = '/'} style={{ background: '#F97316', border: 'none', color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Buscar un profesional →
            </button>
          </div>
        </div>

        {/* PREGUNTAS FRECUENTES */}
        <div style={{ background: '#1B3A6B', borderRadius: '16px', padding: '40px 48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>Preguntas frecuentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: '¿Cuánto cuesta usar tumaestro.app?', a: 'Para los clientes es completamente gratis. Para los contratistas, el registro y uso de la plataforma también es gratuito. No cobramos comisiones por los trabajos.' },
              { q: '¿Cómo sé que el contratista es confiable?', a: 'Cada contratista tiene un perfil con foto, descripción de su experiencia y reseñas verificadas de clientes reales que han contratado sus servicios a través de tumaestro.app.' },
              { q: '¿Puedo solicitar cotizaciones a varios contratistas?', a: 'Sí, puedes contactar a tantos profesionales como quieras. Cada cotización es independiente y sin compromiso.' },
              { q: '¿El contratista ve mi teléfono y email?', a: 'Sí, cuando envías una solicitud de cotización el contratista recibe tus datos de contacto para poder comunicarse contigo. Sin embargo, tus datos no son visibles para el público general.' },
            ].map((faq, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px 20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', margin: '0 0 6px' }}>❓ {faq.q}</p>
                <p style={{ fontSize: '13px', color: '#93C5FD', margin: 0, lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}