'use client'

import { useState } from 'react'

const oficios = ['Gasfitero', 'Electricista', 'Pintor', 'Cerrajero', 'Maestro chasquilla', 'Carpintero', 'Jardinero', 'Otro']

const comunas = ['Las Condes', 'Providencia', 'Nunoa', 'Maipu', 'La Florida', 'Vitacura', 'Santiago Centro', 'Pudahuel', 'Macul', 'La Reina', 'Penaranda', 'San Miguel']

export default function Registro() {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', oficio: '', comuna: '', experiencia: '', descripcion: '', password: '', confirmar: '' })
  const [enviado, setEnviado] = useState(false)

  const actualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }))

  const siguiente = () => { if (paso < 3) setPaso(paso + 1) }
  const anterior = () => { if (paso > 1) setPaso(paso - 1) }
  const enviar = () => setEnviado(true)

  if (enviado) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Registro exitoso</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.6' }}>Bienvenido a tumaestro.app. Tu perfil esta siendo revisado y estara activo en menos de 24 horas.</p>
          <button onClick={() => window.location.href = '/panel'} style={{ background: '#1B3A6B', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>
            Ir a mi panel
          </button>
          <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: '1px solid #E5E7EB', color: '#374151', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>
            Ver directorio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>

      {/* Navbar */}
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>
          tumaestro<span style={{ color: '#F97316' }}>.app</span>
        </span>
        <span style={{ color: '#93C5FD', fontSize: '14px' }}>
          Ya tienes cuenta? <span onClick={() => window.location.href = '/login'} style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesion</span>
        </span>
      </nav>

      <div style={{ maxWidth: '560px', margin: '48px auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Crea tu cuenta gratis</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Empieza a recibir clientes en menos de 5 minutos</p>
        </div>

        {/* Pasos */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {[1, 2, 3].map((p, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: paso >= p ? '#1B3A6B' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paso >= p ? '#fff' : '#9CA3AF', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
                  {paso > p ? '✓' : p}
                </div>
                <span style={{ fontSize: '13px', color: paso >= p ? '#111827' : '#9CA3AF', fontWeight: paso === p ? '500' : '400', whiteSpace: 'nowrap' }}>
                  {p === 1 ? 'Datos personales' : p === 2 ? 'Tu oficio' : 'Contrasena'}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: paso > p ? '#1B3A6B' : '#E5E7EB', margin: '0 12px' }}></div>}
            </div>
          ))}
        </div>

        {/* Card formulario */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px' }}>

          {/* Paso 1 — Datos personales */}
          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Datos personales</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Nombre</label>
                  <input value={form.nombre} onChange={e => actualizar('nombre', e.target.value)} placeholder="Carlos" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Apellido</label>
                  <input value={form.apellido} onChange={e => actualizar('apellido', e.target.value)} placeholder="Munoz" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
                <input value={form.email} onChange={e => actualizar('email', e.target.value)} placeholder="carlos@ejemplo.com" type="email" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Telefono</label>
                <input value={form.telefono} onChange={e => actualizar('telefono', e.target.value)} placeholder="+56 9 1234 5678" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* Paso 2 — Tu oficio */}
          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Tu oficio</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Oficio principal</label>
                <select value={form.oficio} onChange={e => actualizar('oficio', e.target.value)} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">Selecciona tu oficio</option>
                  {oficios.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Comuna donde trabajas</label>
                <select value={form.comuna} onChange={e => actualizar('comuna', e.target.value)} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                  <option value="">Selecciona tu comuna</option>
                  {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Anos de experiencia</label>
                <input value={form.experiencia} onChange={e => actualizar('experiencia', e.target.value)} placeholder="Ej: 8" type="number" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Descripcion breve</label>
                <textarea value={form.descripcion} onChange={e => actualizar('descripcion', e.target.value)} placeholder="Describe tu experiencia y especialidades..." rows={4} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* Paso 3 — Contrasena */}
          {paso === 3 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Crea tu contrasena</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Ultimo paso — ya casi terminas</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Contrasena</label>
                <input value={form.password} onChange={e => actualizar('password', e.target.value)} type="password" placeholder="Minimo 8 caracteres" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Confirmar contrasena</label>
                <input value={form.confirmar} onChange={e => actualizar('confirmar', e.target.value)} type="password" placeholder="Repite tu contrasena" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>Resumen de tu registro:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Nombre: <strong style={{ color: '#111827' }}>{form.nombre} {form.apellido}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Email: <strong style={{ color: '#111827' }}>{form.email}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Oficio: <strong style={{ color: '#111827' }}>{form.oficio}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Comuna: <strong style={{ color: '#111827' }}>{form.comuna}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Botones navegacion */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {paso > 1 && (
              <button onClick={anterior} style={{ flex: 1, background: 'transparent', border: '1px solid #E5E7EB', color: '#374151', padding: '12px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                Atras
              </button>
            )}
            {paso < 3 ? (
              <button onClick={siguiente} style={{ flex: 1, background: '#1B3A6B', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Continuar
              </button>
            ) : (
              <button onClick={enviar} style={{ flex: 1, background: '#F97316', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Crear mi cuenta gratis
              </button>
            )}
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
          {['Sin costo de registro', 'Sin comisiones', 'Cancela cuando quieras'].map(t => (
            <span key={t} style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#059669' }}>✓</span> {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}
