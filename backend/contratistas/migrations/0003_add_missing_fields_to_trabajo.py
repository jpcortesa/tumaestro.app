from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0002_create_missing_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='trabajo',
            name='cliente_rut',
            field=models.CharField(blank=True, max_length=12),
        ),
        migrations.AddField(
            model_name='trabajo',
            name='incluye_iva',
            field=models.BooleanField(default=False),
        ),
    ]