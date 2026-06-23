'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const colores = ['#1B3A6B', '#0F6E56', '#534AB7', '#854F0B', '#B45309', '#065F46']

function iniciales(nombre) {
  return nombre?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function colorPorNombre(nombre) {
  let hash = 0
  for (let i = 0; i < (nombre?.length || 0); i++) hash += nombre.charCodeAt(i)
  return colores[hash % colores.length]
}

function mostrarComunas(contratista) {
  if (!contratista) return ''
  if (contratista.comunas?.includes('Todas las comunas de Santiago')) return '🗺 Toda Santiago'
  if (contratista.comunas?.length > 0) return '📍 ' + contratista.comunas.join(', ')
  return '📍 ' + (contratista.comuna || '')
}

function validarTelefono(num) {
  return /^9\d{8}$/.test(num.replace(/\s/g, ''))
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validarRUT(rut) {
  if (!rut || rut.trim() === '') return { valido: false, error: 'RUT es obligatorio' }
  
  // Limpiar formato
  const rutLimpio = rut.toUpperCase().replace(/[^0-9K]/g, '')
  if (rutLimpio.length < 8) return { valido: false, error: 'RUT inválido' }
  
  const numero = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1)
  
  // Calcular dígito verificador
  let suma = 0
  let multiplicador = 2
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador
    multiplicador++
    if (multiplicador > 7) multiplicador = 2
  }
  
  const resto = suma % 11
  const dvEsperado = resto === 0 ? '0' : resto === 1 ? 'K' : String(11 - resto)
  
  if (dv !== dvEsperado) {
    return { valido: false, error: 'RUT inválido' }
  }
  
  return { valido: true }
}

function ErrorMsg({ msg }) {
  if (!msg) return null
  return <p style={{ fontSize: '11px', color: '#EF4444', margin: '3px 0 0' }}>{msg}</p>
}

function SuccessMsg({ msg }) {
  if (!msg) return null
  return <p style={{ fontSize: '11px', color: '#059669', margin: '3px 0 0' }}>✓ {msg}</p>
}

export default function PerfilContratista() {
  const params = useParams()
  const [contratista, setContratista] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resenas, setResenas] = useState({ promedio: null, total: 0, resenas: [] })

  const [form, setForm] = useState({
    nombre_cliente: '',
    telefono_cliente: '+56 ',
    email_cliente: '',
    email_confirmar: '',
    rut_cliente: '',
    descripcion: '',
  })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${API}/api/publico/contratistas/${params.id}/`)
      .then(res => res.json())
      .then(data => { setContratista(data); setLoading(false) })
      .catch(() => setLoading(false))

    fetch(`${API}/api/publico/contratistas/${params.id}/resenas/`)
      .then(res => res.json())
      .then(data => setResenas(data))
      .catch(() => {})
  }, [params.id])

  const actualizar = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: null }))
  }

  function validar() {
    const e = {}
    if (!form.nombre_cliente.trim()) e.nombre_cliente = 'Tu nombre es requerido'
    if (!form.telefono_cliente.trim() || form.telefono_cliente === '+56 ') {
      e.telefono_cliente = 'Tu teléfono es requerido'
    } else {
      const soloNumeros = form.telefono_cliente.replace(/\D/g, '')
      if (soloNumeros.length !== 11 || !soloNumeros.startsWith('56')) {
        e.telefono_cliente = 'Debe ser un número chileno válido: +56 9 XXXX XXXX'
      }
    }
    if (!form.email_cliente.trim()) {
      e.email_cliente = 'Tu email es requerido'
    } else if (!validarEmail(form.email_cliente)) {
      e.email_cliente = 'Email inválido'
    }
    if (!form.email_confirmar.trim()) {
      e.email_confirmar = 'Confirma tu email'
    } else if (form.email_cliente !== form.email_confirmar) {
      e.email_confirmar = 'Los emails no coinciden'
    }
    const validRut = validarRUT(form.rut_cliente)
    if (!validRut.valido) {
      e.rut_cliente = validRut.error
    }
    if (!form.descripcion.trim()) e.descripcion = 'Describe el trabajo que necesitas'
    return e
  }

  async function enviarSolicitud() {
    const e = validar()
    if (Object.keys(e).length > 0) { setErrores(e); return }

    setEnviando(true)
    const res = await fetch(`${API}/api/publico/contratistas/${params.id}/solicitud/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_cliente: form.nombre_cliente,
        telefono_cliente: form.telefono_cliente,
        email_cliente: form.email_cliente,
        rut_cliente: form.rut_cliente,
        descripcion: form.descripcion,
      })
    })
    setEnviando(false)
    if (res.ok) setEnviado(true)
  }

  const resetForm = () => {
    setForm({ nombre_cliente: '', telefono_cliente: '+56 ', email_cliente: '', email_confirmar: '', rut_cliente: '', descripcion: '' })
    setErrores({})
    setEnviado(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B7280' }}>Cargando perfil...</p>
    </div>
  )

  if (!contratista || contratista.error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#EF4444' }}>Contratista no encontrado.</p>
    </div>
  )

  const color = colorPorNombre(contratista.nombre)
  const inputBase = { border: '1px solid #E5E7EB', borderRadius: '8px', padding: '11px 12px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA' }}>
      <nav style={{ background: '#1B3A6B', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span onClick={() => window.location.href = '/'} style={{ color: '#fff', fontSize: '20px', fontWeight: '600', cursor: 'pointer' }}>tumaestro<span style={{ color: '#F97316' }}>.app</span></span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span onClick={() => window.location.href = '/'} style={{ color: '#93C5FD', fontSize: '14px', cursor: 'pointer' }}>Volver al directorio</span>
          <button onClick={() => window.location.href = '/registro'} style={{ background: '#F97316', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Soy contratista</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>

          {/* COLUMNA IZQUIERDA */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '28px', flexShrink: 0 }}>
                  {iniciales(contratista.nombre)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>{contratista.nombre}</h1>
                    {contratista.verificado && (
                      <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '13px', padding: '4px 12px', borderRadius: '999px', fontWeight: '500' }}>Verificado</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                    {(contratista.oficios?.length > 0 ? contratista.oficios : [contratista.oficio]).map((o, i) => (
                      <span key={i} style={{ background: '#EEF2FF', color: '#1B3A6B', fontSize: '13px', padding: '3px 12px', borderRadius: '999px', fontWeight: 500 }}>
                        {o}
                      </span>
                    ))}
                    <span style={{ fontSize: '14px', color: '#9CA3AF' }}>· {contratista.experiencia} años de experiencia</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    {mostrarComunas(contratista)}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                {[
                  { label: 'Trabajos realizados', valor: resenas.total > 0 ? String(resenas.total) : '—' },
                  { label: 'Tiempo de respuesta', valor: '< 1 hora' },
                  { label: 'Satisfacción', valor: resenas.promedio ? `${resenas.promedio}★` : '—' }
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center', background: '#F8F9FA', borderRadius: '10px', padding: '16px' }}>
                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#1B3A6B', margin: '0 0 4px' }}>{m.valor}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Sobre mí</h2>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7' }}>
                {contratista.descripcion || 'Este profesional aún no ha completado su descripción.'}
              </p>
            </div>

            {contratista.certificacion && contratista.certificacion.trim() && (
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>🎓 Certificaciones y títulos</h2>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
                  {contratista.certificacion}
                </p>
              </div>
            )}

            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Reseñas verificadas</h2>
                {resenas.promedio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#F97316' }}>{resenas.promedio}★</span>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>({resenas.total} reseñas)</span>
                  </div>
                )}
              </div>
              {resenas.total === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Aún no hay reseñas para este profesional.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {resenas.resenas?.map((r, idx) => (
                    <div key={idx} style={{ borderBottom: idx < resenas.resenas.length - 1 ? '1px solid #F3F4F6' : 'none', paddingBottom: idx < resenas.resenas.length - 1 ? '20px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{r.nombre_cliente}</span>
                          <span style={{ fontSize: '18px', marginLeft: '10px' }}>{'⭐'.repeat(r.rating)}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          {new Date(r.creado_en).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      {r.comentario && (
                        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                          "{r.comentario}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA — FORMULARIO */}
          <div>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', position: 'sticky', top: '24px' }}>
              {enviado ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  <h3 style={{ fontWeight: 700, color: '#1B3A6B', marginBottom: '8px' }}>¡Solicitud enviada!</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                    {contratista.nombre} recibirá tu solicitud y se pondrá en contacto contigo pronto.
                  </p>
                  <button onClick={resetForm} style={{ marginTop: '16px', background: 'none', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', color: '#6B7280' }}>
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Solicitar cotización</h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>Gratis y sin compromiso</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>

                    {/* NOMBRE */}
                    <div>
                      <input
                        placeholder="Tu nombre completo *"
                        value={form.nombre_cliente}
                        onChange={e => actualizar('nombre_cliente', e.target.value)}
                        style={{ ...inputBase, borderColor: errores.nombre_cliente ? '#EF4444' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.nombre_cliente} />
                    </div>

                    {/* TELÉFONO */}
                    <div>
                      <input
                        placeholder="+56 9 1234 5678 *"
                        value={form.telefono_cliente}
                        onChange={e => actualizar('telefono_cliente', e.target.value)}
                        style={{ ...inputBase, borderColor: errores.telefono_cliente ? '#EF4444' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.telefono_cliente} />
                      {!errores.telefono_cliente && form.telefono_cliente && form.telefono_cliente.replace(/[^\d]/g, '').length === 11 && validarTelefono(form.telefono_cliente.replace('+56 ', '')) && (
                        <SuccessMsg msg="Número válido" />
                      )}
                    </div>

                    {/* EMAIL */}
                    <div>
                      <input
                        placeholder="Tu email *"
                        type="email"
                        value={form.email_cliente}
                        onChange={e => actualizar('email_cliente', e.target.value)}
                        style={{ ...inputBase, borderColor: errores.email_cliente ? '#EF4444' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.email_cliente} />
                    </div>

                    {/* CONFIRMAR EMAIL */}
                    <div>
                      <input
                        placeholder="Confirma tu email *"
                        type="email"
                        value={form.email_confirmar}
                        onChange={e => actualizar('email_confirmar', e.target.value)}
                        style={{ ...inputBase, borderColor: errores.email_confirmar ? '#EF4444' : (form.email_confirmar && form.email_cliente === form.email_confirmar) ? '#059669' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.email_confirmar} />
                      {!errores.email_confirmar && form.email_confirmar && form.email_cliente === form.email_confirmar && (
                        <SuccessMsg msg="Los emails coinciden" />
                      )}
                    </div>

                    {/* RUT */}
                    <div>
                      <input
                        placeholder="Tu RUT (ej: 12.345.678-9) *"
                        value={form.rut_cliente}
                        onChange={e => actualizar('rut_cliente', e.target.value)}
                        style={{ ...inputBase, borderColor: errores.rut_cliente ? '#EF4444' : (form.rut_cliente && validarRUT(form.rut_cliente).valido) ? '#059669' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.rut_cliente} />
                      {!errores.rut_cliente && form.rut_cliente && validarRUT(form.rut_cliente).valido && (
                        <SuccessMsg msg="RUT válido" />
                      )}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>
                      <textarea
                        placeholder="Describe el trabajo que necesitas... *"
                        rows={4}
                        value={form.descripcion}
                        onChange={e => actualizar('descripcion', e.target.value)}
                        style={{ ...inputBase, resize: 'none', fontFamily: 'inherit', borderColor: errores.descripcion ? '#EF4444' : '#E5E7EB' }}
                      />
                      <ErrorMsg msg={errores.descripcion} />
                    </div>

                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>* Todos los campos son obligatorios</p>
                  </div>

                  <button
                    onClick={enviarSolicitud}
                    disabled={enviando}
                    style={{ background: enviando ? '#9CA3AF' : '#F97316', border: 'none', color: '#fff', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: enviando ? 'not-allowed' : 'pointer', marginBottom: '14px' }}>
                    {enviando ? 'Enviando...' : 'Enviar solicitud'}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['Responde en menos de 1 hora', 'Cotización sin compromiso', 'Sin costo'].map(t => (
                      <span key={t} style={{ fontSize: '13px', color: '#6B7280' }}>✓ {t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}