# Generated migration for account deactivation feature
# Fecha: Junio 2026

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0010_contratista_foto_url'),
    ]

    operations = [
        # Agregar campos para desactivación de cuenta
        migrations.AddField(
            model_name='contratista',
            name='is_deleted',
            field=models.BooleanField(
                default=False,
                help_text='True = cuenta desactivada permanentemente, False = activa o en período de gracia'
            ),
        ),
        migrations.AddField(
            model_name='contratista',
            name='deleted_at',
            field=models.DateTimeField(
                null=True,
                blank=True,
                help_text='Fecha en que usuario solicitó desactivación (período de gracia 30 días)'
            ),
        ),
        migrations.AddField(
            model_name='contratista',
            name='anonymized_at',
            field=models.DateTimeField(
                null=True,
                blank=True,
                help_text='Fecha en que datos se anonimizaron permanentemente'
            ),
        ),
    ]