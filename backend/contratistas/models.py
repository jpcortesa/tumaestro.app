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
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateField(auto_now_add=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente} - {self.descripcion}"