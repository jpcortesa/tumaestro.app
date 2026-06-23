from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0002_create_missing_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='rut',
            field=models.CharField(blank=True, max_length=12),
        ),
        migrations.AddField(
            model_name='solicitudcotizacion',
            name='rut_cliente',
            field=models.CharField(blank=True, max_length=12),
        ),
        migrations.AddField(
            model_name='trabajo',
            name='rut_cliente',
            field=models.CharField(blank=True, max_length=12),
        ),
        migrations.AddField(
            model_name='cotizacion',
            name='cliente_nombre',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='cotizacion',
            name='cliente_rut',
            field=models.CharField(blank=True, max_length=12),
        ),
    ]
