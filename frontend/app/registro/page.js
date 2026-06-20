'use client'

import { useState } from 'react'

const oficios = ['Gasfitero', 'Electricista', 'Pintor', 'Cerrajero', 'Maestro chasquilla', 'Carpintero', 'Jardinero', 'Albanil', 'Tecnico en climatizacion', 'Técnico en refrigeración', 'Instalador de pisos', 'Techador', 'Plomero', 'Otro']

const comunas = [
  'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
  'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
  'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
  'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
  'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal',
  'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón',
  'Santiago Centro', 'Vitacura', 'Puente Alto', 'San Bernardo'
]

const TODAS_COMUNAS = 'Todas las comunas de Santiago'

const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }

function ErrorMsg({ msg }) {
  if (!msg) return null
  return <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0' }}>{msg}</p>
}

function validarTelefonoChile(num) {
  // Después del +56, debe ser 9 seguido de 8 dígitos (ej: 9 1234 5678)
  return /^9\d{8}$/.test(num.replace(/\s/g, ''))
}

export default function Registro() {
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', email_confirmar: '', telefono: '',
    oficio: '', oficio_otro: '', comuna: '', experiencia: '', descripcion: '',
    password: '', confirmar: ''
  })
  const [enviado, setEnviado] = useState(false)
  const [errores, setErrores] = useState({})

  const actualizar = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: null }))
  }

  const todasSeleccionadas = form.comuna === TODAS_COMUNAS

  function validarPaso1() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.apellido.trim()) e.apellido = 'El apellido es requerido'
    if (!form.email.trim()) {
      e.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email inválido'
    }
    if (!form.email_confirmar.trim()) {
      e.email_confirmar = 'Confirma tu email'
    } else if (form.email !== form.email_confirmar) {
      e.email_confirmar = 'Los emails no coinciden'
    }
    if (!form.telefono.trim()) {
      e.telefono = 'El teléfono es requerido'
    } else if (!validarTelefonoChile(form.telefono)) {
      e.telefono = 'Debe ser un número chileno válido: 9 XXXX XXXX'
    }
    return e
  }

  function validarPaso2() {
    const e = {}
    if (!form.oficio) e.oficio = 'Selecciona tu oficio'
    if (form.oficio === 'Otro' && !form.oficio_otro.trim()) e.oficio_otro = 'Escribe tu oficio'
    if (!form.comuna) e.comuna = 'Selecciona una zona de trabajo'
    if (!form.experiencia || parseInt(form.experiencia) < 0) e.experiencia = 'Ingresa tus años de experiencia'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida'
    return e
  }

  const siguiente = () => {
    if (paso === 1) {
      const e = validarPaso1()
      if (Object.keys(e).length > 0) { setErrores(e); return }
    }
    if (paso === 2) {
      const e = validarPaso2()
      if (Object.keys(e).length > 0) { setErrores(e); return }
    }
    if (paso < 3) setPaso(paso + 1)
  }

  const anterior = () => { if (paso > 1) setPaso(paso - 1) }

  const enviar = async () => {
    const e = {}
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (!form.confirmar) e.confirmar = 'Confirma tu contraseña'
    else if (form.password !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden'
    if (Object.keys(e).length > 0) { setErrores(e); return }

    try {
      const oficioFinal = form.oficio === 'Otro' ? form.oficio_otro : form.oficio
      const telefonoFinal = `+56 ${form.telefono.trim()}`
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/registro/`
          : 'http://localhost:8000/api/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, oficio: oficioFinal, telefono: telefonoFinal })
      })
      const data = await res.json()
      if (res.ok) setEnviado(true)
      else alert(data.error || 'Error al registrarse')
    } catch {
      alert('Error de conexión con el servidor')
    }
  }

  if (enviado) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>✓</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Registro exitoso</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.6' }}>Bienvenido a tumaestro.app. Tu perfil está siendo revisado y estará activo en menos de 24 horas.</p>
          <button onClick={() => window.location.href = '/panel'} style={{ background: '#1B3A6B', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' }}>Ir a mi panel</button>
          <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: '1px solid #E5E7EB', color: '#374151', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}>Ver directorio</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <span style={{ color: '#93C5FD', fontSize: '14px' }}>Ya tienes cuenta? <span onClick={() => window.location.href = '/login'} style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesion</span></span>
      </nav>

      <div style={{ maxWidth: '560px', margin: '48px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Crea tu cuenta gratis</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Empieza a recibir clientes en menos de 5 minutos</p>
        </div>

        {/* STEPPER */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {[1, 2, 3].map((p, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: paso >= p ? '#1B3A6B' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paso >= p ? '#fff' : '#9CA3AF', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
                  {paso > p ? '✓' : p}
                </div>
                <span style={{ fontSize: '13px', color: paso >= p ? '#111827' : '#9CA3AF', fontWeight: paso === p ? '500' : '400', whiteSpace: 'nowrap' }}>
                  {p === 1 ? 'Datos personales' : p === 2 ? 'Tu oficio' : 'Contraseña'}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '1px', background: paso > p ? '#1B3A6B' : '#E5E7EB', margin: '0 12px' }}></div>}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px' }}>

          {/* PASO 1 — DATOS PERSONALES */}
          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Datos personales</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input value={form.nombre} onChange={e => actualizar('nombre', e.target.value)} placeholder="Carlos" style={{ ...inputStyle, borderColor: errores.nombre ? '#EF4444' : '#E5E7EB' }} />
                  <ErrorMsg msg={errores.nombre} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido *</label>
                  <input value={form.apellido} onChange={e => actualizar('apellido', e.target.value)} placeholder="Muñoz" style={{ ...inputStyle, borderColor: errores.apellido ? '#EF4444' : '#E5E7EB' }} />
                  <ErrorMsg msg={errores.apellido} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email *</label>
                <input value={form.email} onChange={e => actualizar('email', e.target.value)} placeholder="carlos@ejemplo.com" type="email" style={{ ...inputStyle, borderColor: errores.email ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.email} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Confirmar email *</label>
                <input
                  value={form.email_confirmar}
                  onChange={e => actualizar('email_confirmar', e.target.value)}
                  placeholder="Repite tu email"
                  type="email"
                  style={{ ...inputStyle, borderColor: errores.email_confirmar ? '#EF4444' : (form.email_confirmar && form.email === form.email_confirmar) ? '#059669' : '#E5E7EB' }}
                />
                <ErrorMsg msg={errores.email_confirmar} />
                {!errores.email_confirmar && form.email_confirmar && form.email === form.email_confirmar && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Los emails coinciden</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Teléfono *</label>
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errores.telefono ? '#EF4444' : '#E5E7EB'}`, borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 12px', background: '#F3F4F6', borderRight: '1px solid #E5E7EB', fontSize: '14px', color: '#374151', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    +56
                  </div>
                  <input
                    value={form.telefono}
                    onChange={e => {
                      const val = e.target.value.replace(/[^\d\s]/g, '')
                      actualizar('telefono', val)
                    }}
                    placeholder="9 1234 5678"
                    maxLength={11}
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 14px', fontSize: '14px', background: 'transparent' }}
                  />
                </div>
                <ErrorMsg msg={errores.telefono} />
                {!errores.telefono && form.telefono && validarTelefonoChile(form.telefono) && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Número válido</p>
                )}
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>Ej: 9 1234 5678</p>
              </div>
            </div>
          )}

          {/* PASO 2 — OFICIO */}
          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Tu oficio</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Oficio principal *</label>
                <select value={form.oficio} onChange={e => actualizar('oficio', e.target.value)} style={{ ...inputStyle, background: '#fff', borderColor: errores.oficio ? '#EF4444' : '#E5E7EB' }}>
                  <option value="">Selecciona tu oficio</option>
                  {oficios.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ErrorMsg msg={errores.oficio} />
              </div>

              {form.oficio === 'Otro' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>¿Cuál es tu oficio? *</label>
                  <input
                    value={form.oficio_otro}
                    onChange={e => actualizar('oficio_otro', e.target.value)}
                    placeholder="Ej: Instalador de alarmas, Soldador..."
                    style={{ ...inputStyle, borderColor: errores.oficio_otro ? '#EF4444' : '#E5E7EB' }}
                    autoFocus
                  />
                  <ErrorMsg msg={errores.oficio_otro} />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>¿Dónde trabajas? *</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${todasSeleccionadas ? '#1B3A6B' : '#E5E7EB'}`, background: todasSeleccionadas ? '#EEF2FF' : '#fff', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={todasSeleccionadas}
                    onChange={e => actualizar('comuna', e.target.checked ? TODAS_COMUNAS : '')}
                    style={{ accentColor: '#1B3A6B', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B3A6B' }}>🗺 Todas las comunas de Santiago</span>
                </label>
                {!todasSeleccionadas && (
                  <select value={form.comuna} onChange={e => actualizar('comuna', e.target.value)} style={{ ...inputStyle, background: '#fff', borderColor: errores.comuna ? '#EF4444' : '#E5E7EB' }}>
                    <option value="">Selecciona una comuna</option>
                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
                <ErrorMsg msg={errores.comuna} />
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0' }}>Puedes agregar más comunas desde tu perfil una vez registrado.</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Años de experiencia *</label>
                <input value={form.experiencia} onChange={e => actualizar('experiencia', e.target.value)} placeholder="Ej: 8" type="number" min="0" max="60" style={{ ...inputStyle, borderColor: errores.experiencia ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.experiencia} />
              </div>

              <div>
                <label style={labelStyle}>Descripción breve *</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => actualizar('descripcion', e.target.value)}
                  placeholder="Describe tu experiencia, especialidades y tipo de trabajos que realizas..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', borderColor: errores.descripcion ? '#EF4444' : '#E5E7EB' }}
                />
                <ErrorMsg msg={errores.descripcion} />
              </div>
            </div>
          )}

          {/* PASO 3 — CONTRASEÑA */}
          {paso === 3 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Crea tu contraseña</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Último paso — ya casi terminas</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Contraseña *</label>
                <input value={form.password} onChange={e => actualizar('password', e.target.value)} type="password" placeholder="Mínimo 8 caracteres" style={{ ...inputStyle, borderColor: errores.password ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.password} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirmar contraseña *</label>
                <input
                  value={form.confirmar}
                  onChange={e => actualizar('confirmar', e.target.value)}
                  type="password"
                  placeholder="Repite tu contraseña"
                  style={{ ...inputStyle, borderColor: errores.confirmar ? '#EF4444' : (form.confirmar && form.password === form.confirmar) ? '#059669' : '#E5E7EB' }}
                />
                <ErrorMsg msg={errores.confirmar} />
                {!errores.confirmar && form.confirmar && form.password === form.confirmar && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Las contraseñas coinciden</p>
                )}
              </div>

              <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px' }}>
                <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>Resumen de tu registro:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Nombre: <strong style={{ color: '#111827' }}>{form.nombre} {form.apellido}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Email: <strong style={{ color: '#111827' }}>{form.email}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Teléfono: <strong style={{ color: '#111827' }}>+56 {form.telefono}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Oficio: <strong style={{ color: '#111827' }}>{form.oficio === 'Otro' ? form.oficio_otro : form.oficio}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Zona: <strong style={{ color: '#111827' }}>{form.comuna === TODAS_COMUNAS ? '🗺 Toda Santiago' : form.comuna}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Experiencia: <strong style={{ color: '#111827' }}>{form.experiencia} años</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {paso > 1 && (
              <button onClick={anterior} style={{ flex: 1, background: 'transparent', border: '1px solid #E5E7EB', color: '#374151', padding: '12px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>Atrás</button>
            )}
            {paso < 3 ? (
              <button onClick={siguiente} style={{ flex: 1, background: '#1B3A6B', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Continuar</button>
            ) : (
              <button onClick={enviar} style={{ flex: 1, background: '#F97316', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Crear mi cuenta gratis</button>
            )}
          </div>
        </div>

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