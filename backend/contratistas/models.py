import uuid
from django.db import models
from django.contrib.auth.models import User

class Contratista(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    oficio = models.CharField(max_length=100)
    oficios = models.JSONField(default=list, blank=True)
    telefono = models.CharField(max_length=20)
    rut = models.CharField(max_length=12, blank=True, null=True, unique=True)
    descripcion = models.TextField(blank=True)
    certificacion = models.TextField(blank=True)
    comuna = models.CharField(max_length=100, blank=True)
    comunas = models.JSONField(default=list, blank=True)
    experiencia = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    email_verificado = models.BooleanField(default=False)
    verificado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.oficio}"


class Cliente(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    comuna = models.CharField(max_length=100, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.usuario}"


class Cotizacion(models.Model):
    ESTADOS = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    cliente_nombre = models.CharField(max_length=100, blank=True)
    cliente_rut = models.CharField(max_length=12, blank=True)
    descripcion = models.CharField(max_length=200)
    detalle = models.TextField(blank=True)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='borrador')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cotización {self.id} - {self.cliente.nombre}"

    def save(self, *args, **kwargs):
        # Si cambia a aprobada y no hay trabajo, crear uno
        if self.estado == 'aprobada' and not Trabajo.objects.filter(
            usuario=self.usuario,
            cliente=self.cliente.nombre,
            descripcion=self.descripcion
        ).exists():
            try:
                print(f"[TRABAJO] Creando trabajo para cotización {self.id}...")
                print(f"[TRABAJO] Cliente RUT: {self.cliente.rut or '(vacío)'}")
                Trabajo.objects.create(
                    usuario=self.usuario,
                    cliente=self.cliente.nombre,
                    cliente_email=self.cliente.email,
                    cliente_rut=self.cliente.rut or None,  # Pasar None si está vacío
                    descripcion=self.descripcion,
                    comuna=self.cliente.comuna,
                    monto=self.monto,
                    incluye_iva=self.incluye_iva,
                    estado='pendiente',
                    fecha=self.creado_en.date(),
                )
                print(f"[TRABAJO] ✓ Trabajo creado exitosamente")
            except Exception as e:
                print(f"[ERROR TRABAJO] {type(e).__name__}: {str(e)}")
                import traceback
                traceback.print_exc()
        super().save(*args, **kwargs)

    def aprobar(self):
        self.estado = 'aprobada'
        self.save()


class ItemCotizacion(models.Model):
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name='items')
    descripcion = models.CharField(max_length=200)
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.IntegerField(default=0)

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.descripcion} x{self.cantidad}"


class Trabajo(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En progreso'),
        ('completado', 'Completado'),
        ('cotizacion', 'Cotizacion'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trabajos')
    cliente = models.CharField(max_length=100)
    cliente_email = models.EmailField(blank=True)
    cliente_rut = models.CharField(max_length=12, blank=True, null=True)
    descripcion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=100)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateField(auto_now_add=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    token_resena = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    def __str__(self):
        return f"{self.cliente} - {self.descripcion}"


class SolicitudCotizacion(models.Model):
    contratista = models.ForeignKey(Contratista, on_delete=models.CASCADE, related_name='solicitudes')
    nombre_cliente = models.CharField(max_length=100)
    rut_cliente = models.CharField(max_length=12, blank=True)
    telefono_cliente = models.CharField(max_length=20)
    email_cliente = models.EmailField(blank=True)
    descripcion = models.TextField()
    leida = models.BooleanField(default=False)
    descartada = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Solicitud de {self.nombre_cliente} para {self.contratista.nombre}"


class Resena(models.Model):
    trabajo = models.OneToOneField(Trabajo, on_delete=models.CASCADE, related_name='resena')
    contratista = models.ForeignKey(Contratista, on_delete=models.CASCADE, related_name='resenas')
    nombre_cliente = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comentario = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reseña de {self.nombre_cliente} para {self.contratista.nombre} — {self.rating}★"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)

    def is_valid(self):
        from django.utils import timezone
        from datetime import timedelta
        return not self.usado and (timezone.now() - self.creado_en) < timedelta(hours=2)

    def __str__(self):
        return f"Reset token para {self.user.email}"


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)

    def __str__(self):
        return f"Verificación email para {self.user.email}"