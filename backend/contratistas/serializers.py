from rest_framework import serializers
from .models import Contratista, Trabajo, Cliente, Cotizacion, ItemCotizacion, SolicitudCotizacion, Resena


class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contratista
        fields = [
            'id', 'usuario', 'nombre', 'oficio', 'oficios', 'telefono', 'rut',
            'descripcion', 'certificacion', 'comuna', 'comunas', 'experiencia',
            'activo', 'email_verificado', 'verificado', 'creado_en'
        ]


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            'id', 'usuario', 'nombre', 'rut', 'telefono', 'email',
            'direccion', 'comuna', 'creado_en'
        ]
        read_only_fields = ['id', 'usuario', 'creado_en']


class ItemCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCotizacion
        fields = ['id', 'cotizacion', 'descripcion', 'cantidad', 'precio_unitario', 'subtotal']
        read_only_fields = ['id', 'subtotal']


class CotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    contratista_nombre = serializers.SerializerMethodField()
    items = ItemCotizacionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'usuario',
            'cliente',
            'cliente_nombre',
            'cliente_rut',
            'descripcion',
            'detalle',
            'monto',
            'incluye_iva',
            'tipo_impuesto',
            'estado',
            'token',
            'creado_en',
            'contratista_nombre',
            'items'
        ]
        read_only_fields = ['id', 'usuario', 'token', 'creado_en', 'contratista_nombre', 'items']
    
    def get_contratista_nombre(self, obj):
        if obj.usuario:
            return f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
        return ""


class TrabajoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Trabajo
        fields = [
            'id',
            'usuario',
            'usuario_nombre',
            'cliente',
            'cliente_email',
            'cliente_rut',
            'descripcion',
            'comuna',
            'monto',
            'incluye_iva',
            'tipo_impuesto',
            'estado',
            'fecha',
            'creado_en',
            'token_resena'
        ]
        read_only_fields = ['id', 'usuario', 'usuario_nombre', 'fecha', 'creado_en', 'token_resena']
    
    def get_usuario_nombre(self, obj):
        if obj.usuario:
            return f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
        return ""


class SolicitudCotizacionSerializer(serializers.ModelSerializer):
    contratista_nombre = serializers.CharField(source='contratista.nombre', read_only=True)
    
    class Meta:
        model = SolicitudCotizacion
        fields = [
            'id',
            'contratista',
            'contratista_nombre',
            'nombre_cliente',
            'rut_cliente',
            'telefono_cliente',
            'email_cliente',
            'descripcion',
            'leida',
            'descartada',
            'creado_en'
        ]
        read_only_fields = ['id', 'contratista_nombre', 'creado_en']


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = [
            'id',
            'trabajo',
            'contratista',
            'nombre_cliente',
            'rating',
            'comentario',
            'creado_en'
        ]
        read_only_fields = ['id', 'creado_en']