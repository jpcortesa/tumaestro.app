from rest_framework import serializers
from .models import Contratista, Trabajo, Cliente, Cotizacion, ItemCotizacion, SolicitudCotizacion

class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contratista
        fields = '__all__'

class TrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajo
        fields = '__all__'
        read_only_fields = ['usuario', 'creado_en']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['usuario', 'creado_en']

class ItemCotizacionSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()
    class Meta:
        model = ItemCotizacion
        fields = ['id', 'descripcion', 'cantidad', 'precio_unitario', 'subtotal']

class CotizacionSerializer(serializers.ModelSerializer):
    items = ItemCotizacionSerializer(many=True, read_only=True)
    class Meta:
        model = Cotizacion
        fields = '__all__'
        read_only_fields = ['usuario', 'creado_en', 'token']

class SolicitudCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudCotizacion
        fields = ['id', 'nombre_cliente', 'telefono_cliente', 'email_cliente', 'rut_cliente', 'descripcion', 'leida', 'descartada', 'creado_en']
        read_only_fields = ['id', 'creado_en']