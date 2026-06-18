from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0009_resena'),
    ]

    operations = [
        migrations.AddField(
            model_name='trabajo',
            name='cliente_email',
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='trabajo',
            name='token_resena',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=False),
        ),
    ]