#!/usr/bin/env python
"""
Script para conectarse a la BD de Render y hacer cliente_rut nullable.
Ejecutar desde: python fix_render_db.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

print("=" * 60)
print("FIX: Hacer cliente_rut nullable en Render BD")
print("=" * 60)

try:
    with connection.cursor() as cursor:
        # Ver estado ACTUAL
        print("\n[1] Consultando estado actual...")
        cursor.execute("""
            SELECT column_name, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'contratistas_trabajo' 
            AND column_name = 'cliente_rut';
        """)
        result = cursor.fetchone()
        if result:
            print(f"    ✓ Estado actual: nullable = {result[1]}")
        else:
            print(f"    ✗ Campo no encontrado")
            exit(1)
        
        # Hacer nullable
        print("\n[2] Ejecutando ALTER TABLE...")
        cursor.execute("""
            ALTER TABLE contratistas_trabajo 
            ALTER COLUMN cliente_rut DROP NOT NULL;
        """)
        print("    ✓ ALTER ejecutado")
        
        # Verificar cambio
        print("\n[3] Verificando cambio...")
        cursor.execute("""
            SELECT column_name, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'contratistas_trabajo' 
            AND column_name = 'cliente_rut';
        """)
        result = cursor.fetchone()
        if result:
            print(f"    ✓ Estado final: nullable = {result[1]}")
            
            if result[1] == 'YES':
                print("\n" + "=" * 60)
                print("✅ ÉXITO: cliente_rut ahora es NULLABLE en Render")
                print("=" * 60)
            else:
                print("\n⚠️ ADVERTENCIA: Campo sigue siendo NOT NULL")
        
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
    exit(1)
