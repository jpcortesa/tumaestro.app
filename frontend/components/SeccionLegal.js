'use client'

export default function SeccionLegal() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1B3A6B 0%, #2D5A8C 100%)',
      color: 'white',
      padding: '60px 20px',
      marginBottom: '40px',
      borderRadius: '12px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ margin: '0 0 15px', fontSize: '2em' }}>🛡️ Protección y Transparencia</h2>
          <p style={{ margin: '0', fontSize: '1.1em', opacity: 0.9 }}>
            Tu privacidad y seguridad son nuestra prioridad
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          
          {/* Card 1 - Privacidad */}
          <a 
            href="/legal/privacidad"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.5em' }}>📋 Privacidad</h3>
            <p style={{ margin: '0 0 15px', opacity: 0.9, lineHeight: '1.5' }}>
              Cómo protegemos tus datos personales, RUT, email y teléfono.
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.95em',
              fontWeight: 'bold',
              opacity: 0.8
            }}>
              Leer más →
            </div>
          </a>

          {/* Card 2 - Términos */}
          <a 
            href="/legal/terminos"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.5em' }}>⚖️ Términos</h3>
            <p style={{ margin: '0 0 15px', opacity: 0.9, lineHeight: '1.5' }}>
              Reglas de uso, pagos seguros, y período de gracia de 30 días.
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.95em',
              fontWeight: 'bold',
              opacity: 0.8
            }}>
              Leer más →
            </div>
          </a>

          {/* Card 3 - Seguridad */}
          <a 
            href="/legal/seguridad"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '30px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.5em' }}>🛡️ Seguridad</h3>
            <p style={{ margin: '0 0 15px', opacity: 0.9, lineHeight: '1.5' }}>
              Anti-fraude, verificación de usuarios, y soporte 24/7.
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.95em',
              fontWeight: 'bold',
              opacity: 0.8
            }}>
              Leer más →
            </div>
          </a>

        </div>

        {/* Bottom Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.95em', opacity: 0.85 }}>
            📞 <strong>¿Preguntas sobre privacidad o seguridad?</strong> Contáctanos a{' '}
            <a href="mailto:privacidad@tumaestro.app" style={{ color: '#87CEEB', textDecoration: 'none', fontWeight: 'bold' }}>
              privacidad@tumaestro.app
            </a>
            {' '}o{' '}
            <a href="mailto:seguridad@tumaestro.app" style={{ color: '#87CEEB', textDecoration: 'none', fontWeight: 'bold' }}>
              seguridad@tumaestro.app
            </a>
          </p>
        </div>

      </div>
    </section>
  )
}