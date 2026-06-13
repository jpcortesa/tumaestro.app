'use client'

const contratistas = [
  { id: 1, nombre: 'Carlos Muñoz', oficio: 'Gasfitero', exp: 8, rating: 4.9, resenas: 127, comuna: 'Las Condes', verificado: true, iniciales: 'CM', color: '#1B3A6B' },
  { id: 2, nombre: 'Ana Rojas', oficio: 'Electricista', exp: 12, rating: 4.8, resenas: 89, comuna: 'Providencia', verificado: true, iniciales: 'AR', color: '#0F6E56' },
  { id: 3, nombre: 'Diego Pérez', oficio: 'Pintor', exp: 5, rating: 4.7, resenas: 64, comuna: 'Ñuñoa', verificado: true, iniciales: 'DP', color: '#534AB7' },
  { id: 4, nombre: 'Sofía Vargas', oficio: 'Cerrajera', exp: 6, rating: 5.0, resenas: 43, comuna: 'Vitacura', verificado: true, iniciales: 'SV', color: '#854F0B' },
  { id: 5, nombre: 'Marco Torres', oficio: 'Gasfitero', exp: 15, rating: 4.6, resenas: 211, comuna: 'Maipú', verificado: false, iniciales: 'MT', color: '#1B3A6B' },
  { id: 6, nombre: 'Valentina Cruz', oficio: 'Electricista', exp: 9, rating: 4.9, resenas: 76, comuna: 'La Florida', verificado: true, iniciales: 'VC', color: '#0F6E56' },
]

const oficios = ['Todos', 'Gasfiteros', 'Electricistas', 'Pintores', 'Cerrajeros']

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#" style={{ color: '#93C5FD', fontSize: '14px', textDecoration: 'none' }}>Directorio</a>
          <a href="#" style={{ color: '#93C5FD', fontSize: '14px', textDecoration: 'none' }}>Como funciona</a>
          <button onClick={() => window.location.href = '/login'} style={{ background: 'transparent', border: '1px solid #93C5FD', color: '#93C5FD', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>Iniciar sesion</button>
          <button onClick={() => window.location.href = '/registro'} style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Soy contratista</button>
        </div>
      </nav>

      <div style={{ background: '#EEF2FF', padding: '64px 48px 48px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '6px 14px', fontSize: '13px', color: '#1B3A6B', marginBottom: '24px' }}>
            <span style={{ color: '#F97316' }}>✓</span> Mas de 2.400 profesionales verificados en Chile
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', lineHeight: '1.15', marginBottom: '16px' }}>
            Encuentra al profesional<br />
            <span style={{ color: '#1B3A6B' }}>ideal para tu hogar</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Contratistas verificados, con resenas reales de clientes como tu
          </p>
          <div style={{ display: 'flex', gap: '0', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px', borderRight: '1px solid #E5E7EB' }}>
              <span style={{ color: '#9CA3AF', fontSize: '18px' }}>🔍</span>
              <input placeholder="Que servicio necesitas?" style={{ border: 'none', outline: 'none', fontSize: '15px', color: '#111827', width: '100%', padding: '18px 0', background: 'transparent' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px', borderRight: '1px solid #E5E7EB' }}>
              <span style={{ color: '#9CA3AF' }}>📍</span>
              <select style={{ border: 'none', outline: 'none', fontSize: '15px', color: '#111827', background: 'transparent', padding: '18px 0', cursor: 'pointer' }}>
                <option>Todas las comunas</option>
                <option>Las Condes</option>
                <option>Providencia</option>
                <option>Nunoa</option>
                <option>Maipu</option>
                <option>La Florida</option>
              </select>
            </div>
            <button style={{ background: '#F97316', border: 'none', color: '#fff', padding: '0 32px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Buscar
            </button>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Perfiles verificados', 'Resenas reales', 'Cotizaciones gratis'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#059669' }}>
                <span>✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {oficios.map((o, i) => (
              <button key={o} style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '14px', cursor: 'pointer', fontWeight: i === 0 ? '500' : '400', background: i === 0 ? '#1B3A6B' : '#fff', color: i === 0 ? '#fff' : '#374151', border: i === 0 ? 'none' : '1px solid #E5E7EB' }}>{o}</button>
            ))}
          </div>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>{contratistas.length} profesionales disponibles</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {contratistas.map(c => (
            <div key={c.id} onClick={() => window.location.href = '/contratista/' + c.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '16px' }}>
                  {c.iniciales}
                </div>
                {c.verificado && (
                  <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '12px', padding: '4px 10px', borderRadius: '999px', fontWeight: '500' }}>✓ Verificado</span>
                )}
              </div>
              <p style={{ fontWeight: '600', fontSize: '16px', color: '#111827', marginBottom: '4px' }}>{c.nombre}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>{c.oficio} · {c.exp} anos exp.</p>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#F97316' }}>{'★'.repeat(Math.floor(c.rating))}</span>
                <span style={{ fontSize: '13px', color: '#374151', marginLeft: '6px' }}>{c.rating}</span>
                <span style={{ fontSize: '13px', color: '#9CA3AF', marginLeft: '4px' }}>({c.resenas})</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>📍 {c.comuna}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#1B3A6B', borderRadius: '16px', padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Para profesionales</p>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Eres contratista?<br />Haz crecer tu negocio.</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Sin costo de registro', 'Sin comisiones', 'Clientes verificados'].map(t => (
                <span key={t} style={{ fontSize: '14px', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#34D399' }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => window.location.href = '/registro'} style={{ background: '#F97316', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px', display: 'block' }}>
              Comenzar gratis →
            </button>
            <span style={{ fontSize: '13px', color: '#93C5FD' }}>No se requiere tarjeta de credito</span>
          </div>
        </div>
      </div>
    </div>
  )
}
