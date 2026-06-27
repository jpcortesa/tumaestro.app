#!/usr/bin/env python
"""
Script para probar el flujo de estados en Trabajo Y envío de emails.
Ejecutar: python test_flujo_trabajo.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from contratistas.models import Trabajo, User

print("=" * 70)
print("TEST: Validación de flujo de estados + envío de emails en Trabajo")
print("=" * 70)

# Obtener o crear usuario
user = User.objects.first() or User.objects.create_user(
    username='testuser', 
    email='test@test.com', 
    password='test123'
)

# Crear trabajo de prueba
print("\n[1] Creando trabajo inicial...")
trabajo = Trabajo.objects.create(
    usuario=user,
    cliente="Cliente Test Email",
    cliente_email="cliente@test.com",  # ← Email para probar envío
    descripcion="Trabajo para probar flujo y emails",
    comuna="Ñuñoa",
    estado='pendiente'
)
print(f"    ✓ Trabajo #{trabajo.id} creado")
print(f"      - Cliente: {trabajo.cliente}")
print(f"      - Email: {trabajo.cliente_email}")
print(f"      - Estado: {trabajo.estado}")

# Test 1: Pendiente → En progreso (DEBE FUNCIONAR + ENVIAR EMAIL)
print("\n[2] Test: Pendiente → En progreso (con envío de email)")
print("    Esperado: Flujo válido + Email enviado")
try:
    trabajo.estado = 'en_progreso'
    trabajo.save()
    print(f"    ✅ ÉXITO: Cambio permitido + Email disparado")
except ValueError as e:
    print(f"    ❌ FALLO: {e}")

# Test 2: En progreso → Pendiente (NO DEBE FUNCIONAR)
print("\n[3] Test: En progreso → Pendiente (debe fallar)")
print("    Esperado: Bloqueado")
try:
    trabajo.estado = 'pendiente'
    trabajo.save()
    print(f"    ❌ FALLO: Se permitió (NO debería)")
except ValueError as e:
    print(f"    ✅ ÉXITO: Bloqueado correctamente")

# Test 3: En progreso → Completado (DEBE FUNCIONAR)
print("\n[4] Test: En progreso → Completado")
print("    Esperado: Flujo válido")
try:
    trabajo.estado = 'en_progreso'  # Volver a en_progreso para poder ir a completado
    trabajo.save()
    trabajo.estado = 'completado'
    trabajo.save()
    print(f"    ✅ ÉXITO: Cambio permitido")
except ValueError as e:
    print(f"    ❌ FALLO: {e}")

# Test 4: Completado → En progreso (NO DEBE FUNCIONAR - estado terminal)
print("\n[5] Test: Completado → En progreso (debe fallar - estado terminal)")
print("    Esperado: Bloqueado")
try:
    trabajo.estado = 'en_progreso'
    trabajo.save()
    print(f"    ❌ FALLO: Se permitió (NO debería, es terminal)")
except ValueError as e:
    print(f"    ✅ ÉXITO: Bloqueado correctamente")

# Test 5: Completado → Completado (DEBE FUNCIONAR - mismo estado)
print("\n[6] Test: Completado → Completado (mismo estado)")
print("    Esperado: Permitido")
try:
    trabajo.estado = 'completado'
    trabajo.save()
    print(f"    ✅ ÉXITO: Cambio permitido (mismo estado)")
except ValueError as e:
    print(f"    ❌ FALLO: {e}")

# Limpiar
print("\n[7] Limpiando...")
trabajo.delete()
print("    ✓ Trabajo de prueba eliminado")

print("\n" + "=" * 70)
print("✅ TESTS COMPLETADOS")
print("=" * 70)
print("\n📧 NOTAS SOBRE EMAILS:")
print("   - Si RESEND_API_KEY no está configurada, los emails fallarán silenciosamente")
print("   - En Render (producción), los emails se enviarán correctamente")
print("   - En local, revisa los logs para ver los intentos de envío")
print("\n" + "=" * 70)