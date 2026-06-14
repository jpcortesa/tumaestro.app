import uuid
from django.db import models
from django.contrib.auth.models import User

class Contratista(models.Model):
    nombre = models.CharField(max_length=100)
    oficio = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.oficio}"

class Cliente(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
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
    descripcion = models.CharField(max_length=200)
    detalle = models.TextField(blank=True)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='borrador')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cotización {self.id} - {self.cliente.nombre}"

    def aprobar(self):
        self.estado = 'aprobada'
        self.save()
        Trabajo.objects.create(
            usuario=self.usuario,
            cliente=self.cliente.nombre,
            descripcion=self.descripcion,
            comuna=self.cliente.comuna,
            monto=self.monto,
            estado='pendiente',
            fecha=self.creado_en.date(),
        )

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
    descripcion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=100)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateField(auto_now_add=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente} - {self.descripcion}"