from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0005_alter_trabajo_cliente_rut'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trabajo',
            name='cliente_rut',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
    ]