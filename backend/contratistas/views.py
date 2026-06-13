from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Contratista
from .serializers import ContratistaSerializer


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('username')
        password = attrs.get('password')
        try:
            user = User.objects.get(email=email)
            attrs['username'] = user.username
        except User.DoesNotExist:
            pass
        return super().validate(attrs)

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class ContratistaViewSet(viewsets.ModelViewSet):
    queryset = Contratista.objects.all()
    serializer_class = ContratistaSerializer

class RegistroView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', '')
        password = data.get('password', '')
        nombre = data.get('nombre', '')
        apellido = data.get('apellido', '')
        oficio = data.get('oficio', '')
        comuna = data.get('comuna', '')
        telefono = data.get('telefono', '')
        experiencia = data.get('experiencia', 0)
        descripcion = data.get('descripcion', '')

        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            return Response({'error': 'Este email ya esta registrado'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=nombre,
            last_name=apellido
        )

        Contratista.objects.create(
            nombre=f'{nombre} {apellido}',
            oficio=oficio,
            telefono=telefono,
            activo=True
        )

        return Response({'mensaje': 'Registro exitoso', 'email': email}, status=status.HTTP_201_CREATED)

class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'nombre': f'{user.first_name} {user.last_name}'.strip(),
            'email': user.email,
            'username': user.username,
        })

from .models import Contratista, Trabajo
from .serializers import ContratistaSerializer, TrabajoSerializer

class TrabajosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        trabajos = Trabajo.objects.filter(usuario=request.user).order_by('-creado_en')
        serializer = TrabajoSerializer(trabajos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TrabajoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrabajoDetalleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            trabajo = Trabajo.objects.get(pk=pk, usuario=request.user)
        except Trabajo.DoesNotExist:
            return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TrabajoSerializer(trabajo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)