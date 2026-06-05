from django.db import models

class Contratista(models.Model):
    nombre = models.CharField(max_length=100)
    oficio = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.oficio}"