from django.db import migrations


def alter_cliente_rut(apps, schema_editor):
    """Solo ejecuta en PostgreSQL"""
    if schema_editor.connection.vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut SET DEFAULT '';")
            cursor.execute("ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut DROP NOT NULL;")


def reverse_alter_cliente_rut(apps, schema_editor):
    """Solo ejecuta en PostgreSQL"""
    if schema_editor.connection.vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut DROP DEFAULT;")
            cursor.execute("ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut SET NOT NULL;")


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0006_alter_trabajo_cliente_rut'),
    ]

    operations = [
        migrations.RunPython(alter_cliente_rut, reverse_alter_cliente_rut),
    ]