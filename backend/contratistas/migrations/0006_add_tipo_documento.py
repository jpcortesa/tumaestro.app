# En backend/contratistas/migrations/
# Nombre: 0006_add_tipo_documento.py

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0005_remove_phantom_columns'),  # O cual sea la última migración
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacion',
            name='tipo_documento',
            field=models.CharField(
                choices=[
                    ('factura', 'Factura con IVA'),
                    ('boleta_honorario', 'Boleta de Honorario')
                ],
                default='factura',
                max_length=20
            ),
        ),
        migrations.AddField(
            model_name='trabajo',
            name='tipo_documento',
            field=models.CharField(
                choices=[
                    ('factura', 'Factura con IVA'),
                    ('boleta_honorario', 'Boleta de Honorario')
                ],
                default='factura',
                max_length=20
            ),
        ),
    ]