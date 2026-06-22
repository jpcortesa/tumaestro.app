from django.db import migrations, models

def update_empty_rut_to_null(apps, schema_editor):
    Contratista = apps.get_model('contratistas', 'Contratista')
    Contratista.objects.filter(rut='').update(rut=None)

def reverse_update(apps, schema_editor):
    # No hacemos nada en reverse
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('contratistas', '0017_contratista_certificacion'),
    ]

    operations = [
        # Paso 1: permitir NULL sin unique aún
        migrations.AlterField(
            model_name='contratista',
            name='rut',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
        # Paso 2: limpiar valores vacíos a NULL
        migrations.RunPython(update_empty_rut_to_null, reverse_update),
        # Paso 3: agregar unique=True
        migrations.AlterField(
            model_name='contratista',
            name='rut',
            field=models.CharField(blank=True, max_length=12, null=True, unique=True),
        ),
    ]