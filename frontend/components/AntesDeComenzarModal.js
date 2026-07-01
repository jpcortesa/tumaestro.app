'use client'

import { useState } from 'react'

export default function AntesDeComenzarModal({ onClose, onContinue }) {
  const [aceptado, setAceptado] = useState(false)
  const [showTerminos, setShowTerminos] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '40px'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6B7280'
          }}>
          ✕
        </button>

        {!showTerminos ? (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ 
                margin: '0 0 16px', 
                fontSize: '1.8em', 
                fontWeight: '700', 
                color: '#111827' 
              }}>Antes de comenzar</h2>
              <p style={{ 
                margin: 0, 
                fontSize: '1em', 
                color: '#6B7280', 
                lineHeight: '1.6' 
              }}>
                Hay algunas cosas importantes que debes saber antes de crear tu perfil en tumaestro.app.
              </p>
            </div>

            {/* Card 1 - Datos */}
            <div style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.1em', 
                fontWeight: '600', 
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3em' }}>✏️</span>
                Ingresa tus datos con cuidado
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '0.95em', 
                color: '#6B7280', 
                lineHeight: '1.6' 
              }}>
                Tu nombre, oficios, comunas y descripción formarán parte de tu perfil público. Asegúrate de que estén bien escritos y representen bien tu trabajo — es lo primero que verán tus futuros clientes.
              </p>
            </div>

            {/* Card 2 - Foto de perfil */}
            <div style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.1em', 
                fontWeight: '600', 
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3em' }}>📸</span>
                Tu foto de perfil
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '0.95em', 
                color: '#6B7280', 
                lineHeight: '1.6' 
              }}>
                Una vez registrado, te recomendamos que subas tu foto de perfil desde tu panel. Esto es recomendado para activar tu perfil público, ya que brinda seguridad y transparencia a los clientes que te contactarán a través de la plataforma.
              </p>
            </div>

            {/* Términos y Condiciones Box */}
            <div style={{
              background: '#EEF2FF',
              border: '2px solid #1B3A6B',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ 
                margin: '0 0 12px', 
                fontSize: '1.1em', 
                fontWeight: '600', 
                color: '#1B3A6B'
              }}>
                Términos, Privacidad y Seguridad
              </h3>
              <p style={{ 
                margin: '0 0 16px', 
                fontSize: '0.95em', 
                color: '#374151', 
                lineHeight: '1.6' 
              }}>
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
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '24px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={aceptado}
                onChange={(e) => setAceptado(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                fontSize: '0.95em',
                color: '#374151',
                lineHeight: '1.5'
              }}>
                He leído y entendido la información anterior. Acepto los Términos y Condiciones y la Política de Privacidad de tumaestro.app.
              </span>
            </label>

            {/* Continue Button */}
            <button
              onClick={onContinue}
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
                width: '100%',
                transition: 'background 0.2s'
              }}
            >
              Entendido, continuar con el registro →
            </button>

            {!aceptado && (
              <p style={{
                margin: '12px 0 0',
                fontSize: '0.85em',
                color: '#6B7280',
                textAlign: 'center'
              }}>
                Debes aceptar los términos para continuar
              </p>
            )}
          </>
        ) : (
          <>
            {/* Términos View */}
            <button
              onClick={() => setShowTerminos(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1B3A6B',
                fontSize: '0.95em',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '24px'
              }}
            >
              ← Volver
            </button>

            <h2 style={{
              margin: '0 0 24px',
              fontSize: '1.5em',
              fontWeight: '700',
              color: '#111827'
            }}>
              Términos y Condiciones
            </h2>

            <div style={{ lineHeight: '1.8', color: '#374151' }}>
              
              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>1. Descripción del Servicio</h3>
                <p>tumaestro.app es una plataforma de conexión entre contratistas independientes y clientes. NO somos empleadores ni agencia. Solo facilitamos la conexión entre usuarios.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>2. Elegibilidad</h3>
                <p>Debes tener 18+ años, estar en Chile (Gran Santiago), y proporcionar información real y actual. Información falsa resulta en eliminación inmediata sin reembolso.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>3. Privacidad</h3>
                <p>Tu información personal (RUT, email, teléfono) está protegida y encriptada. Solo será visible lo que agregues a tu perfil público. Nunca vendemos tus datos.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>4. Período de Gracia - Desactivación de Cuenta</h3>
                <p>Si desactivas tu cuenta, tienes 30 días para reactivarla. Después de 30 días, tu cuenta se elimina permanentemente y tus datos se anonimizán según ley.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>5. Conducta Aceptable</h3>
                <p>Se prohíbe: acoso, discriminación, identidades falsas, abuso de menores, y actividades ilegales. Violaciones resultan en eliminación inmediata.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>6. Reseñas y Calificaciones</h3>
                <p>Las reseñas son permanentes. Permitimos comentarios honestos, pero prohibimos lenguaje abusivo, mentiras y publicidad.</p>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '12px' }}>7. Ley y Jurisdicción</h3>
                <p>Estos términos se rigen por leyes de Chile. Tribunales competentes: Santiago. Acuerdo de arbitraje (no litigio en cortes).</p>
              </section>

              <p style={{ 
                margin: '32px 0 0', 
                padding: '20px', 
                background: '#F9FAFB', 
                borderRadius: '8px',
                fontSize: '0.9em',
                color: '#6B7280'
              }}>
                Para ver la información completa, visita<br/>
                <a href="/legal/terminos" target="_blank" style={{ color: '#1B3A6B', textDecoration: 'none', fontWeight: '600' }}>
                  /legal/terminos
                </a>
              </p>

            </div>

            {/* Accept and Continue */}
            <div style={{ marginTop: '32px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '24px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={aceptado}
                  onChange={(e) => setAceptado(e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '0.95em',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  Acepto los Términos y Condiciones y la Política de Privacidad
                </span>
              </label>

              <button
                onClick={() => {
                  setShowTerminos(false)
                  onContinue()
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
          </>
        )}

      </div>
    </div>
  )
}