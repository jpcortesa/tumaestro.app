from django.contrib import admin
from .models import Contratista, Trabajo, Cliente, Cotizacion

admin.site.register(Contratista)
admin.site.register(Trabajo)
admin.site.register(Cliente)
admin.site.register(Cotizacion)