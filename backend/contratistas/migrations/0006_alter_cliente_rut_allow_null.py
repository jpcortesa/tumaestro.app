from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0005_alter_trabajo_cliente_rut'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut DROP NOT NULL;",
            reverse_sql="ALTER TABLE contratistas_trabajo ALTER COLUMN cliente_rut SET NOT NULL;",
        ),
    ]