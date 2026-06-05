'use client'

import { useParams } from 'next/navigation'

const contratistas = [
  { id: 1, nombre: 'Carlos Muñoz', oficio: 'Gasfitero', exp: 8, rating: 4.9, resenas: 127, comuna: 'Las Condes', verificado: true, iniciales: 'CM', color: '#1B3A6B', descripcion: 'Gasfitero certificado con mas de 8 anos de experiencia en instalaciones residenciales y comerciales. Especializado en reparacion de canerias, instalacion de calefones, duchas y sistemas de agua caliente.', especialidades: ['Canerias', 'Calefones', 'Duchas', 'Agua caliente', 'Emergencias 24/7', 'Certificado SEC'] },
  { id: 2, nombre: 'Ana Rojas', oficio: 'Electricista', exp: 12, rating: 4.8, resenas: 89, comuna: 'Providencia', verificado: true, iniciales: 'AR', color: '#0F6E56', descripcion: 'Electricista con 12 anos de experiencia en instalaciones residenciales y comerciales. Certificada por la SEC para instalaciones electricas de baja tension.', especialidades: ['Instalaciones', 'Tableros', 'Enchufes', 'Iluminacion', 'Certificado SEC'] },
  { id: 3, nombre: 'Diego Perez', oficio: 'Pintor', exp: 5, rating: 4.7, resenas: 64, comuna: 'Nunoa', verificado: true, iniciales: 'DP', color: '#534AB7', descripcion: 'Pintor profesional con experiencia en proyectos residenciales y comerciales. Especializado en pintura interior y exterior con terminaciones de alta calidad.', especialidades: ['Pintura interior', 'Pintura exterior', 'Estuco', 'Barniz', 'Empapelado'] },
]

const resenas = [
  { nombre: 'Maria Gonzalez', fecha: 'Marzo 2024', rating: 5, comentario: 'Excelente trabajo, muy puntual y prolijo. Resolvio el problema en menos de una hora. Totalmente recomendado.', trabajo: 'Reparacion calefon', iniciales: 'MG', color: '#7C3AED' },
  { nombre: 'Roberto Sanchez', fecha: 'Febrero 2024', rating: 5, comentario: 'Segunda vez que lo contrato y siempre deja todo perfecto. Precios justos y excelente atencion.', trabajo: 'Instalacion ducha', iniciales: 'RS', color: '#0F6E56' },
  { nombre: 'Carmen Valdes', fecha: 'Enero 2024', rating: 4, comentario: 'Buen trabajo, llego a la hora acordada. El resultado fue muy bueno.', trabajo: 'Reparacion caneria', iniciales: 'CV', color: '#B45309' },
]

export default function PerfilContratista() {
  const params = useParams()
  const contratista = contratistas.find(c => c.id === parseInt(params.id)) || contratistas[0]

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span onClick={() => window.location.href = '/'} style={{ color: '#93C5FD', fontSize: '14px', cursor: 'pointer' }}>Volver al directorio</span>
          <button style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Soy contratista</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: contratista.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '28px', flexShrink: 0 }}>{contratista.iniciales}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>{contratista.nombre}</h1>
                    {contratista.verificado && <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '13px', padding: '4px 12px', borderRadius: '999px', fontWeight: '500' }}>Verificado</span>}
                  </div>
                  <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '12px' }}>{contratista.oficio} · {contratista.exp} anos de experiencia · {contratista.comuna}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#F97316' }}>{'★'.repeat(Math.floor(contratista.rating))}</span>
                    <span style={{ fontWeight: '600' }}>{contratista.rating}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>({contratista.resenas} resenas)</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                {[{ label: 'Trabajos realizados', valor: '243' }, { label: 'Tiempo de respuesta', valor: '< 1 hora' }, { label: 'Satisfaccion', valor: '98%' }].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', background: '#F8F9FA', borderRadius: '10px', padding: '16px' }}>
                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px' }}>{m.valor}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Sobre mi</h2>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', marginBottom: '20px' }}>{contratista.descripcion}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {contratista.especialidades.map(e => (
                  <span key={e} style={{ background: '#EEF2FF', color: '#1B3A6B', fontSize: '13px', padding: '6px 14px', borderRadius: '999px', fontWeight: '500' }}>{e}</span>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>Resenas verificadas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resenas.map((r, i) => (
                  <div key={i} style={{ borderBottom: i < resenas.length - 1 ? '1px solid #F3F4F6' : 'none', paddingBottom: i < resenas.length - 1 ? '16px' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>{r.iniciales}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>{r.nombre}</span>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{r.fecha}</span>
                        </div>
                        <span style={{ color: '#F97316', fontSize: '13px' }}>{'★'.repeat(r.rating)}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 8px' }}>{r.comentario}</p>
                    <span style={{ fontSize: '12px', color: '#059669' }}>Resena verificada por tumaestro.app</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>Solicitar cotizacion</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Gratis y sin compromiso</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <input placeholder="Tu nombre" style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%' }} />
                <input placeholder="Tu telefono" style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%' }} />
                <textarea placeholder="Describe el trabajo que necesitas..." rows={4} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '14px', outline: 'none', width: '100%', resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <button style={{ background: '#F97316', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>Enviar solicitud</button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Responde en menos de 1 hora', 'Cotizacion sin compromiso', 'Sin costo'].map(t => (
                  <span key={t} style={{ fontSize: '13px', color: '#6B7280' }}>✓ {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
