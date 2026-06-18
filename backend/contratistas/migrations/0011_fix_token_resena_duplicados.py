from django.db import migrations, models
import uuid


def asignar_tokens_unicos(apps, schema_editor):
    Trabajo = apps.get_model('contratistas', 'Trabajo')
    for t in Trabajo.objects.all():
        t.token_resena = uuid.uuid4()
        t.save()


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0010_trabajo_cliente_email_trabajo_token_resena'),
    ]

    operations = [
        migrations.RunPython(asignar_tokens_unicos, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='trabajo',
            name='token_resena',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]