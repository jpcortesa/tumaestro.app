from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('contratistas', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='contratista',
            name='oficios',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='contratista',
            name='rut',
            field=models.CharField(blank=True, max_length=12, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='contratista',
            name='descripcion',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='contratista',
            name='certificacion',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='contratista',
            name='comuna',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='contratista',
            name='comunas',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='contratista',
            name='experiencia',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='contratista',
            name='email_verificado',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contratista',
            name='verificado',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('telefono', models.CharField(blank=True, max_length=20)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('direccion', models.CharField(blank=True, max_length=200)),
                ('comuna', models.CharField(blank=True, max_length=100)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Cotizacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=200)),
                ('detalle', models.TextField(blank=True)),
                ('monto', models.IntegerField(default=0)),
                ('incluye_iva', models.BooleanField(default=False)),
                ('estado', models.CharField(choices=[('borrador', 'Borrador'), ('enviada', 'Enviada'), ('aprobada', 'Aprobada'), ('rechazada', 'Rechazada')], default='borrador', max_length=20)),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contratistas.cliente')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Trabajo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cliente', models.CharField(max_length=100)),
                ('cliente_email', models.EmailField(blank=True, max_length=254)),
                ('descripcion', models.CharField(max_length=200)),
                ('comuna', models.CharField(max_length=100)),
                ('monto', models.IntegerField(default=0)),
                ('incluye_iva', models.BooleanField(default=False)),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('en_progreso', 'En progreso'), ('completado', 'Completado'), ('cotizacion', 'Cotizacion')], default='pendiente', max_length=20)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('token_resena', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trabajos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SolicitudCotizacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_cliente', models.CharField(max_length=100)),
                ('telefono_cliente', models.CharField(max_length=20)),
                ('email_cliente', models.EmailField(blank=True, max_length=254)),
                ('descripcion', models.TextField()),
                ('leida', models.BooleanField(default=False)),
                ('descartada', models.BooleanField(default=False)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('contratista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='solicitudes', to='contratistas.contratista')),
            ],
        ),
        migrations.CreateModel(
            name='Resena',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_cliente', models.CharField(max_length=100)),
                ('rating', models.IntegerField(default=5)),
                ('comentario', models.TextField(blank=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('contratista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resenas', to='contratistas.contratista')),
                ('trabajo', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='resena', to='contratistas.trabajo')),
            ],
        ),
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('usado', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ItemCotizacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=200)),
                ('cantidad', models.IntegerField(default=1)),
                ('precio_unitario', models.IntegerField(default=0)),
                ('cotizacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='contratistas.cotizacion')),
            ],
        ),
        migrations.CreateModel(
            name='EmailVerificationToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('usado', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
