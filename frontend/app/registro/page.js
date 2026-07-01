'use client'

import { useState } from 'react'

const LISTA_OFICIOS = [
  'Gasfíter', 'Electricista', 'Pintor', 'Cerrajero', 'Carpintero',
  'Jardinero', 'Albañil', 'Instalador de pisos', 'Climatización',
  'Refrigeración', 'Vidriería', 'Mecánica automotriz', 'Otro'
]

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
const MAX_OFICIOS = 5

const inputStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }

function ErrorMsg({ msg }) {
  if (!msg) return null
  return <p style={{ fontSize: '12px', color: '#EF4444', margin: '4px 0 0' }}>{msg}</p>
}

function validarTelefonoChile(num) {
  return /^9\d{8}$/.test(num.replace(/\s/g, ''))
}

function validarRutChileno(rut) {
  const limpio = rut.replace(/[\.\-]/g, '').toUpperCase()
  if (limpio.length < 2) return false
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  if (!/^\d+$/.test(cuerpo)) return false
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const dvEsperado = 11 - (suma % 11)
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado)
  return dv === dvCalculado
}

function formatearRut(rut) {
  const limpio = rut.replace(/[\.\-]/g, '').toUpperCase()
  if (limpio.length < 2) return rut
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
}

function ModalAntesDeComenzar({ onAceptar, onCerrar, showTerminos, setShowTerminos, aceptado, setAceptado }) {
  if (!showTerminos) {
    // Vista principal
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
          
          {/* Close Button */}
          <button onClick={onCerrar} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}>×</button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '1.8em', fontWeight: '700', color: '#111827' }}>Antes de comenzar</h2>
            <p style={{ margin: 0, fontSize: '1em', color: '#6B7280', lineHeight: '1.6' }}>
              Hay algunas cosas importantes que debes saber antes de crear tu perfil en tumaestro.app.
            </p>
          </div>

          {/* Card 1 - Datos */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1em', fontWeight: '600', color: '#111827' }}>
              ✏️ Ingresa tus datos con cuidado
            </h3>
            <p style={{ margin: 0, fontSize: '0.95em', color: '#6B7280', lineHeight: '1.6' }}>
              Tu nombre, oficios, comunas y descripción formarán parte de tu perfil público. Asegúrate de que estén bien escritos y representen bien tu trabajo — es lo primero que verán tus futuros clientes.
            </p>
          </div>

          {/* Card 2 - Foto de perfil */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1em', fontWeight: '600', color: '#111827' }}>
              📸 Tu foto de perfil
            </h3>
            <p style={{ margin: 0, fontSize: '0.95em', color: '#6B7280', lineHeight: '1.6' }}>
              Una vez registrado, te sugerimos que subas tu foto de perfil desde tu panel. Esto es recomendado para activar tu perfil público, brindará seguridad y transparencia a los clientes que te conacten a través de la plataforma.
            </p>
          </div>

          {/* Términos y Condiciones Box */}
          <div style={{ background: '#EEF2FF', border: '2px solid #1B3A6B', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1em', fontWeight: '600', color: '#1B3A6B' }}>
              Legal & Seguridad
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.95em', color: '#374151', lineHeight: '1.6' }}>
              Antes de continuar, debes aceptar nuestros términos y entender cómo protegemos tu privacidad.
            </p>
            <button
              onClick={() => setShowTerminos(true)}
              style={{
                background: '#1B3A6B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95em',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Leer Términos y Condiciones →
            </button>
          </div>

          {/* Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={aceptado}
              onChange={(e) => setAceptado(e.target.checked)}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95em', color: '#374151', lineHeight: '1.5' }}>
              He leído y entiendo la información anterior. Acepto los Términos y Condiciones y la Política de Privacidad de tumaestro.app.
            </span>
          </label>

          {/* Continue Button */}
          <button
            onClick={onAceptar}
            disabled={!aceptado}
            style={{
              background: aceptado ? '#F97316' : '#D1D5DB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: aceptado ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
          >
            Entendido, continuar con el registro →
          </button>

          {!aceptado && (
            <p style={{ margin: '12px 0 0', fontSize: '0.85em', color: '#6B7280', textAlign: 'center' }}>
              Debes aceptar los términos para continuar
            </p>
          )}
        </div>
      </div>
    )
  }

  // Vista de Términos
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <button
          onClick={() => setShowTerminos(false)}
          style={{ background: 'none', border: 'none', color: '#1B3A6B', fontSize: '0.95em', fontWeight: '600', cursor: 'pointer', marginBottom: '24px' }}
        >
          ← Volver
        </button>

        <h2 style={{ margin: '0 0 24px', fontSize: '1.5em', fontWeight: '700', color: '#111827' }}>
          Términos y Condiciones
        </h2>

        <div style={{ lineHeight: '1.8', color: '#374151' }}>
          
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>1. Descripción del Servicio</h3>
            <p>tumaestro.app es una plataforma de conexión entre contratistas independientes y clientes. NO somos empleadores ni agencia. Solo facilitamos la conexión entre usuarios.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>2. Elegibilidad</h3>
            <p>Debes tener 18+ años, estar en Chile (Gran Santiago), y proporcionar información real y actual. Información falsa resulta en eliminación inmediata sin reembolso.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>3. Privacidad</h3>
            <p>Tu información personal (RUT, email, teléfono) está protegida y encriptada. Solo será visible lo que agregues a tu perfil público. Nunca vendemos tus datos.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>4. Período de Gracia - Desactivación de Cuenta</h3>
            <p>Si desactivas tu cuenta, tienes 30 días para reactivarla. Después de 30 días, tu cuenta se elimina permanentemente y tus datos se anonimizán según ley.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>5. Conducta Aceptable</h3>
            <p>Se prohíbe: acoso, discriminación, identidades falsas, abuso de menores, y actividades ilegales. Violaciones resultan en eliminación inmediata.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>6. Reseñas y Calificaciones</h3>
            <p>Las reseñas son permanentes. Permitimos comentarios honestos, pero prohibimos lenguaje abusivo, mentiras y publicidad.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>7. Ley y Jurisdicción</h3>
            <p>Estos términos se rigen por leyes de Chile. Tribunales competentes: Santiago. Acuerdo de arbitraje (no litigio en cortes).</p>
          </section>

          <p style={{ margin: '32px 0 0', padding: '20px', background: '#F9FAFB', borderRadius: '8px', fontSize: '0.9em', color: '#6B7280' }}>
            Para ver la información completa, visita<br/>
            <a href="/legal/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#1B3A6B', textDecoration: 'none', fontWeight: '600' }}>
              /legal/terminos
            </a>
          </p>

        </div>

        {/* Accept and Continue */}
        <div style={{ marginTop: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={aceptado}
              onChange={(e) => setAceptado(e.target.checked)}
              style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.95em', color: '#374151', lineHeight: '1.5' }}>
              Acepto los Términos y Condiciones y la Política de Privacidad
            </span>
          </label>

          <button
            onClick={() => {
              setShowTerminos(false)
              onAceptar()
            }}
            disabled={!aceptado}
            style={{
              background: aceptado ? '#F97316' : '#D1D5DB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: aceptado ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
          >
            Continuar con el registro →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Registro() {
  const [mostrarModal, setMostrarModal] = useState(true)
  const [showTerminos, setShowTerminos] = useState(false)
  const [aceptado, setAceptado] = useState(false)
  const [paso, setPaso] = useState(1)
  const [emailRegistrado, setEmailRegistrado] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', rut: '', email: '', email_confirmar: '', telefono: '',
    oficios: [], oficio_otro: '', comunas_seleccionadas: [], todas_comunas: false, experiencia: '', descripcion: '', certificacion: '',
    password: '', confirmar: ''
  })
  const [enviado, setEnviado] = useState(false)
  const [errores, setErrores] = useState({})

  const actualizar = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: null }))
  }

  const todasSeleccionadas = form.todas_comunas

  function toggleTodosComunas() {
    if (form.todas_comunas) {
      actualizar('todas_comunas', false)
    } else {
      actualizar('todas_comunas', true)
      actualizar('comunas_seleccionadas', [])
    }
  }

  function toggleComunaIndividual(comuna) {
    let nuevas = [...form.comunas_seleccionadas]
    if (nuevas.includes(comuna)) {
      nuevas = nuevas.filter(c => c !== comuna)
    } else {
      nuevas.push(comuna)
    }
    actualizar('comunas_seleccionadas', nuevas)
    if (nuevas.length > 0 && form.todas_comunas) {
      actualizar('todas_comunas', false)
    }
  }

  function agregarOficio(oficio) {
    if (!oficio || form.oficios.includes(oficio)) return
    if (form.oficios.length >= MAX_OFICIOS) return
    actualizar('oficios', [...form.oficios, oficio])
    setErrores(prev => ({ ...prev, oficios: null }))
  }

  function quitarOficio(oficio) {
    actualizar('oficios', form.oficios.filter(o => o !== oficio))
    if (oficio === 'Otro') actualizar('oficio_otro', '')
  }

  const tieneOtro = form.oficios.includes('Otro')
  const oficiosDisponibles = LISTA_OFICIOS.filter(o => !form.oficios.includes(o))

  function validarPaso1() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.apellido.trim()) e.apellido = 'El apellido es requerido'
    if (!form.rut.trim()) { e.rut = 'El RUT es requerido' }
    else if (!validarRutChileno(form.rut)) { e.rut = 'RUT inválido. Verifica el dígito verificador' }
    if (!form.email.trim()) { e.email = 'El email es requerido' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { e.email = 'Email inválido' }
    if (!form.email_confirmar.trim()) { e.email_confirmar = 'Confirma tu email' }
    else if (form.email !== form.email_confirmar) { e.email_confirmar = 'Los emails no coinciden' }
    if (!form.telefono.trim()) { e.telefono = 'El teléfono es requerido' }
    else if (!validarTelefonoChile(form.telefono)) { e.telefono = 'Debe ser un número chileno válido: 9 XXXX XXXX' }
    return e
  }

  function validarPaso2() {
    const e = {}
    if (form.oficios.length === 0) e.oficios = 'Selecciona al menos un oficio'
    if (tieneOtro && !form.oficio_otro.trim()) e.oficio_otro = 'Escribe el nombre de tu oficio'
    if (!form.todas_comunas && form.comunas_seleccionadas.length === 0) e.comunas = 'Selecciona al menos una comuna'
    if (!form.experiencia || parseInt(form.experiencia) < 0) e.experiencia = 'Ingresa tus años de experiencia'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida'
    return e
  }

  const siguiente = () => {
    if (paso === 1) { const e = validarPaso1(); if (Object.keys(e).length > 0) { setErrores(e); return } }
    if (paso === 2) { const e = validarPaso2(); if (Object.keys(e).length > 0) { setErrores(e); return } }
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
      const oficiosFinales = form.oficios.map(o => o === 'Otro' ? form.oficio_otro.trim() : o)
      const telefonoFinal = '+56 ' + form.telefono.trim()
      const comunasFinal = form.todas_comunas ? [TODAS_COMUNAS] : form.comunas_seleccionadas
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL + '/api/registro/'
          : 'http://localhost:8000/api/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          rut: form.rut,
          email: form.email,
          password: form.password,
          telefono: telefonoFinal,
          oficios: oficiosFinales,
          oficio: oficiosFinales[0] || '',
          comunas: comunasFinal,
          comuna: comunasFinal[0] || '',
          experiencia: form.experiencia,
          descripcion: form.descripcion,
          certificacion: form.certificacion.trim(),
        })
      })
      const data = await res.json()
      if (res.ok) {
        setEmailRegistrado(form.email)
        setEnviado(true)
      } else {
        setErrores({ submit: data.error || 'Error al registrarse' })
      }
    } catch {
      setErrores({ submit: 'Error de conexión con el servidor' })
    }
  }

  if (enviado) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>📧</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Revisa tu correo</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '8px', lineHeight: '1.6' }}>Enviamos un link de verificación a:</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#1B3A6B', marginBottom: '20px' }}>{emailRegistrado}</p>
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '13px', color: '#92400E', margin: '0 0 6px', fontWeight: 600 }}>Debes verificar tu email para activar tu cuenta</p>
            <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: '1.5' }}>
              Haz click en el link que te enviamos. El link es válido por 24 horas. Si no lo encuentras, revisa tu carpeta de spam.
            </p>
          </div>
          <button onClick={() => window.location.href = '/login'}
            style={{ background: '#1B3A6B', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      {mostrarModal && (
        <ModalAntesDeComenzar 
          onAceptar={() => setMostrarModal(false)} 
          onCerrar={() => window.location.href = '/'}
          showTerminos={showTerminos}
          setShowTerminos={setShowTerminos}
          aceptado={aceptado}
          setAceptado={setAceptado}
        />
      )}

      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>
          tumaestro<span style={{ color: '#F97316' }}>.app</span>
        </span>
        <span style={{ color: '#93C5FD', fontSize: '14px' }}>
          ¿Ya tienes cuenta? <span onClick={() => window.location.href = '/login'} style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}>Inicia sesión</span>
        </span>
      </nav>

      <div style={{ maxWidth: '560px', margin: '48px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Crea tu cuenta gratis</h1>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Empieza a recibir clientes en menos de 5 minutos</p>
        </div>

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

          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Datos personales o Comerciales</h2>
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
                <label style={labelStyle}>RUT *</label>
                <input
                  value={form.rut}
                  onChange={e => actualizar('rut', e.target.value.replace(/[^0-9kK\.\-]/g, ''))}
                  onBlur={() => { if (form.rut.length > 1) actualizar('rut', formatearRut(form.rut)) }}
                  placeholder="Ej: 12.345.678-9"
                  maxLength={12}
                  style={{ ...inputStyle, borderColor: errores.rut ? '#EF4444' : (form.rut && validarRutChileno(form.rut)) ? '#059669' : '#E5E7EB' }}
                />
                <ErrorMsg msg={errores.rut} />
                {!errores.rut && form.rut && validarRutChileno(form.rut) && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ RUT válido</p>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email *</label>
                <input value={form.email} onChange={e => actualizar('email', e.target.value)} placeholder="carlos@ejemplo.com" type="email" style={{ ...inputStyle, borderColor: errores.email ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.email} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Confirmar email *</label>
                <input value={form.email_confirmar} onChange={e => actualizar('email_confirmar', e.target.value)} placeholder="Repite tu email" type="email"
                  style={{ ...inputStyle, borderColor: errores.email_confirmar ? '#EF4444' : (form.email_confirmar && form.email === form.email_confirmar) ? '#059669' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.email_confirmar} />
                {!errores.email_confirmar && form.email_confirmar && form.email === form.email_confirmar && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Los emails coinciden</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Teléfono *</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid ' + (errores.telefono ? '#EF4444' : '#E5E7EB'), borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 12px', background: '#F3F4F6', borderRight: '1px solid #E5E7EB', fontSize: '14px', color: '#374151', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>+56</div>
                  <input value={form.telefono} onChange={e => actualizar('telefono', e.target.value.replace(/[^\d\s]/g, ''))} placeholder="9 1234 5678" maxLength={11}
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 14px', fontSize: '14px', background: 'transparent' }} />
                </div>
                <ErrorMsg msg={errores.telefono} />
                {!errores.telefono && form.telefono && validarTelefonoChile(form.telefono) && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Número válido</p>
                )}
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>Ej: 9 1234 5678</p>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>Tu oficio</h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Oficios * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(máximo {MAX_OFICIOS})</span></label>
                {form.oficios.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {form.oficios.map(o => (
                      <span key={o} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EEF2FF', color: '#1B3A6B', fontSize: '13px', padding: '5px 12px', borderRadius: '999px', fontWeight: 500 }}>
                        {o === 'Otro' && form.oficio_otro ? form.oficio_otro : o}
                        <span onClick={() => quitarOficio(o)} style={{ cursor: 'pointer', color: '#6B7280', fontWeight: 700, lineHeight: 1, fontSize: '14px' }}>×</span>
                      </span>
                    ))}
                  </div>
                )}
                {form.oficios.length < MAX_OFICIOS && (
                  <select value="" onChange={e => agregarOficio(e.target.value)} style={{ ...inputStyle, background: '#fff', borderColor: errores.oficios ? '#EF4444' : '#E5E7EB' }}>
                    <option value="">{form.oficios.length === 0 ? 'Selecciona tu oficio principal...' : '+ Agregar otro oficio...'}</option>
                    {oficiosDisponibles.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                )}
                <ErrorMsg msg={errores.oficios} />
                {form.oficios.length > 0 && form.oficios.length < MAX_OFICIOS && (
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '6px 0 0' }}>Puedes agregar hasta {MAX_OFICIOS - form.oficios.length} oficio{MAX_OFICIOS - form.oficios.length !== 1 ? 's' : ''} más.</p>
                )}
                {form.oficios.length === MAX_OFICIOS && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '6px 0 0' }}>✓ Máximo de oficios alcanzado.</p>
                )}
              </div>
              {tieneOtro && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>¿Cuál es ese oficio? *</label>
                  <input value={form.oficio_otro} onChange={e => actualizar('oficio_otro', e.target.value)} placeholder="Ej: Instalador de alarmas, Soldador..." autoFocus
                    style={{ ...inputStyle, borderColor: errores.oficio_otro ? '#EF4444' : '#E5E7EB' }} />
                  <ErrorMsg msg={errores.oficio_otro} />
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>¿Dónde trabajas? *</label>
                
                {/* Checkbox "Todas las comunas" */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', border: '1px solid ' + (todasSeleccionadas ? '#1B3A6B' : '#E5E7EB'), background: todasSeleccionadas ? '#EEF2FF' : '#fff', marginBottom: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={todasSeleccionadas} 
                    onChange={toggleTodosComunas}
                    style={{ accentColor: '#1B3A6B', width: '16px', height: '16px' }} 
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1B3A6B' }}>Todas las comunas de Santiago</span>
                </label>

                {/* Checkboxes de comunas individuales */}
                {!todasSeleccionadas && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    {comunas.map(c => (
                      <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={form.comunas_seleccionadas.includes(c)}
                          onChange={() => toggleComunaIndividual(c)}
                          style={{ accentColor: '#1B3A6B', width: '14px', height: '14px' }}
                        />
                        <span style={{ fontSize: '13px', color: '#374151' }}>{c}</span>
                      </label>
                    ))}
                  </div>
                )}

                {errores.comunas && (
                  <p style={{ fontSize: '12px', color: '#EF4444', margin: '6px 0 0' }}>{errores.comunas}</p>
                )}

                {form.todas_comunas && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '6px 0 0' }}>✓ Trabajarás en toda Santiago</p>
                )}
                {!form.todas_comunas && form.comunas_seleccionadas.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '6px 0 0' }}>✓ {form.comunas_seleccionadas.length} comuna{form.comunas_seleccionadas.length !== 1 ? 's' : ''} seleccionada{form.comunas_seleccionadas.length !== 1 ? 's' : ''}</p>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Años de experiencia *</label>
                <input value={form.experiencia} onChange={e => actualizar('experiencia', e.target.value)} placeholder="Ej: 8" type="number" min="0" max="60"
                  style={{ ...inputStyle, borderColor: errores.experiencia ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.experiencia} />
              </div>
              <div>
                <label style={labelStyle}>Descripción breve *</label>
                <textarea value={form.descripcion} onChange={e => actualizar('descripcion', e.target.value)} placeholder="Describe tu experiencia, especialidades y tipo de trabajos que realizas..." rows={4}
                  style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', borderColor: errores.descripcion ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.descripcion} />
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', padding: '14px', borderRadius: '10px', border: '1px solid ' + (form.certificacion !== '' ? '#1B3A6B' : '#E5E7EB'), background: form.certificacion !== '' ? '#EEF2FF' : '#F8F9FA' }}>
                  <input
                    type="checkbox"
                    checked={form.certificacion !== ''}
                    onChange={e => actualizar('certificacion', e.target.checked ? ' ' : '')}
                    style={{ accentColor: '#1B3A6B', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 2px' }}>Cuento con certificaciones o títulos</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Ej: título técnico, certificación de empresa, curso especializado</p>
                  </div>
                </label>
                {form.certificacion !== '' && (
                  <textarea
                    value={form.certificacion.trim() === '' ? '' : form.certificacion}
                    onChange={e => actualizar('certificacion', e.target.value)}
                    placeholder="Describe tus certificaciones o títulos... Ej: Técnico en instalaciones eléctricas SEC, certificado por Siemens Chile"
                    rows={3}
                    autoFocus
                    style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', marginTop: '10px' }}
                  />
                )}
              </div>
            </div>
          )}

          {paso === 3 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Crea tu contraseña</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Último paso — ya casi terminas</p>
              {errores.submit && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>⚠ {errores.submit}</p>
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Contraseña *</label>
                <input value={form.password} onChange={e => actualizar('password', e.target.value)} type="password" placeholder="Mínimo 8 caracteres"
                  style={{ ...inputStyle, borderColor: errores.password ? '#EF4444' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.password} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirmar contraseña *</label>
                <input value={form.confirmar} onChange={e => actualizar('confirmar', e.target.value)} type="password" placeholder="Repite tu contraseña"
                  style={{ ...inputStyle, borderColor: errores.confirmar ? '#EF4444' : (form.confirmar && form.password === form.confirmar) ? '#059669' : '#E5E7EB' }} />
                <ErrorMsg msg={errores.confirmar} />
                {!errores.confirmar && form.confirmar && form.password === form.confirmar && (
                  <p style={{ fontSize: '12px', color: '#059669', margin: '4px 0 0' }}>✓ Las contraseñas coinciden</p>
                )}
              </div>
              <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '16px' }}>
                <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>Resumen de tu registro:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Nombre: <strong style={{ color: '#111827' }}>{form.nombre} {form.apellido}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>RUT: <strong style={{ color: '#111827' }}>{form.rut}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Email: <strong style={{ color: '#111827' }}>{form.email}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Teléfono: <strong style={{ color: '#111827' }}>+56 {form.telefono}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Oficios: <strong style={{ color: '#111827' }}>{form.oficios.map(o => o === 'Otro' ? form.oficio_otro : o).join(', ')}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Zonas: <strong style={{ color: '#111827' }}>{form.todas_comunas ? 'Toda Santiago' : form.comunas_seleccionadas.join(', ')}</strong></span>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Experiencia: <strong style={{ color: '#111827' }}>{form.experiencia} años</strong></span>
                </div>
              </div>
            </div>
          )}

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