#!/usr/bin/env python
"""
Script para probar el flujo de estados en Trabajo.
Ejecutar: python test_flujo_trabajo.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from contratistas.models import Trabajo, User

print("=" * 70)
print("TEST: Validación de flujo de estados en Trabajo")
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
    cliente="Cliente Test",
    descripcion="Trabajo para probar flujo",
    comuna="Ñuñoa",
    estado='pendiente'
)
print(f"    ✓ Trabajo #{trabajo.id} creado con estado: PENDIENTE")

# Test 1: Pendiente → En progreso (DEBE FUNCIONAR)
print("\n[2] Test: Pendiente → En progreso")
try:
    trabajo.estado = 'en_progreso'
    trabajo.save()
    print(f"    ✅ ÉXITO: Cambio permitido")
except ValueError as e:
    print(f"    ❌ FALLO: {e}")

# Test 2: En progreso → Pendiente (NO DEBE FUNCIONAR)
print("\n[3] Test: En progreso → Pendiente (debe fallar)")
try:
    trabajo.estado = 'pendiente'
    trabajo.save()
    print(f"    ❌ FALLO: Se permitió (NO debería)")
except ValueError as e:
    print(f"    ✅ ÉXITO: Bloqueado correctamente")
    print(f"       Razón: {e}")

# Test 3: En progreso → Completado (DEBE FUNCIONAR)
print("\n[4] Test: En progreso → Completado")
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
try:
    trabajo.estado = 'en_progreso'
    trabajo.save()
    print(f"    ❌ FALLO: Se permitió (NO debería, es terminal)")
except ValueError as e:
    print(f"    ✅ ÉXITO: Bloqueado correctamente")
    print(f"       Razón: {e}")

# Test 5: Completado → Completado (DEBE FUNCIONAR - mismo estado)
print("\n[6] Test: Completado → Completado (mismo estado)")
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
