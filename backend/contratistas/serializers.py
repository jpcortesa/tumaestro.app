from rest_framework import serializers
from .models import Contratista

class ContratistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contratista
        fields = '__all__'