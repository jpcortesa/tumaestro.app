'use client'

export default function Footer() {
  return (
    <footer style={{
      background: '#1B3A6B',
      color: 'white',
      padding: '60px 20px 20px',
      marginTop: '80px',
      borderTop: '1px solid #2D5A8C'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Main Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand */}
          <div>
            <h3 style={{ margin: '0 0 15px', fontSize: '1.5em', fontWeight: '600' }}>tumaestro.app</h3>
            <p style={{ margin: '0 0 10px', opacity: 0.8, fontSize: '0.95em' }}>La plataforma para contratistas independientes en Santiago</p>
            <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.6 }}>Conecta con clientes en Gran Santiago</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ margin: '0 0 15px', fontSize: '1.1em', fontWeight: '600' }}>Acceso Rápido</h4>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.95em' }}>Inicio</a>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <a href="/registro" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.95em' }}>Registrarse</a>
              </li>
              <li>
                <a href="/login" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.95em' }}>Iniciar Sesión</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ margin: '0 0 15px', fontSize: '1.1em', fontWeight: '600' }}>Contacto</h4>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: '10px' }}>
                <a href="mailto:help@tumaestro.app" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.95em' }}>
                  help@tumaestro.app
                </a>
              </li>
              <li>
                <a href="mailto:seguridad@tumaestro.app" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.95em' }}>
                  seguridad@tumaestro.app
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid #2D5A8C', 
          paddingTop: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>
            © 2026 tumaestro.app. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/legal/privacidad" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9em' }}>Privacidad</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="/legal/terminos" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9em' }}>Términos</a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a href="/legal/seguridad" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9em' }}>Seguridad</a>
          </div>
        </div>

      </div>
    </footer>
  )
}