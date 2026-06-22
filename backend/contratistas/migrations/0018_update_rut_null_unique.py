from django.db import migrations, models

def update_empty_rut_to_null(apps, schema_editor):
    Contratista = apps.get_model('contratistas', 'Contratista')
    Contratista.objects.filter(rut='').update(rut=None)

class Migration(migrations.Migration):
    dependencies = [
        ('contratistas', '0017_contratista_certificacion'),
    ]

    operations = [
        migrations.RunPython(update_empty_rut_to_null),
        migrations.AlterField(
            model_name='contratista',
            name='rut',
            field=models.CharField(blank=True, max_length=12, null=True, unique=True),
        ),
    ]