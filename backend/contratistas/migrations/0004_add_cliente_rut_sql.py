from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0003_add_missing_fields_to_trabajo'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE contratistas_trabajo ADD COLUMN IF NOT EXISTS cliente_rut VARCHAR(12) DEFAULT '';",
            reverse_sql="ALTER TABLE contratistas_trabajo DROP COLUMN IF EXISTS cliente_rut;",
        ),
    ]
