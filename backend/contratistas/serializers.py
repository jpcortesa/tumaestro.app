from rest_framework import serializers
from .models import Contratista, Trabajo

class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contratista
        fields = '__all__'

class TrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajo
        fields = '__all__'
        read_only_fields = ['usuario', 'creado_en']