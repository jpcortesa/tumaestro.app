from rest_framework import viewsets
from .models import Contratista
from .serializers import ContratistaSerializer

class ContratistaViewSet(viewsets.ModelViewSet):
    queryset = Contratista.objects.all()
    serializer_class = ContratistaSerializer