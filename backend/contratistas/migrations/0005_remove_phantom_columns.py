"""
Migración 0005: Limpiar columnas fantasma de contratistas_trabajo
- Elimina rut_cliente (redundante con cliente_rut)
- Elimina updated_at (no usada en modelo Django)

Nota: Estas columnas fueron creadas por migraciones antiguas que conflictúan.
"""

from django.db import migrations


def remove_phantom_columns(apps, schema_editor):
    """Elimina columnas que no están en el modelo Django"""
    vendor = schema_editor.connection.vendor
    
    if vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            # Verificar que existen antes de eliminar
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'contratistas_trabajo'
                AND column_name IN ('rut_cliente', 'updated_at');
            """)
            existing = [row[0] for row in cursor.fetchall()]
            
            if 'rut_cliente' in existing:
                cursor.execute("ALTER TABLE contratistas_trabajo DROP COLUMN rut_cliente;")
                print("  ✓ Eliminada columna: rut_cliente")
            
            if 'updated_at' in existing:
                cursor.execute("ALTER TABLE contratistas_trabajo DROP COLUMN updated_at;")
                print("  ✓ Eliminada columna: updated_at")
            
            print("\n✅ Columnas fantasma eliminadas - BD alineada con modelo Django")
    else:
        # SQLite no tiene estas columnas
        print("  [NOOP] SQLite - no hay columnas fantasma")


def reverse_remove_phantom_columns(apps, schema_editor):
    """Rollback - no restauramos, era limpieza"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0004_fix_cliente_rut_nullable'),
    ]

    operations = [
        migrations.RunPython(
            remove_phantom_columns,
            reverse_remove_phantom_columns
        ),
    ]