from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Contratista, Trabajo, Cliente, Cotizacion, ItemCotizacion
from .serializers import ContratistaSerializer, TrabajoSerializer, ClienteSerializer, CotizacionSerializer, ItemCotizacionSerializer


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

class ClientesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clientes = Cliente.objects.filter(usuario=request.user).order_by('-creado_en')
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClienteDetalleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cliente = Cliente.objects.get(pk=pk, usuario=request.user)
        except Cliente.DoesNotExist:
            return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ClienteSerializer(cliente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CotizacionesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cotizaciones = Cotizacion.objects.filter(usuario=request.user).order_by('-creado_en')
        serializer = CotizacionSerializer(cotizaciones, many=True)
        return Response(serializer.data)

    def post(self, request):
        items_data = request.data.get('items', [])
        incluye_iva = request.data.get('incluye_iva', False)

        subtotal = sum(int(i.get('cantidad', 1)) * int(i.get('precio_unitario', 0)) for i in items_data)
        monto = int(subtotal * 1.19) if incluye_iva else subtotal

        data = {
            'cliente': request.data.get('cliente'),
            'descripcion': request.data.get('descripcion'),
            'detalle': request.data.get('detalle', ''),
            'incluye_iva': incluye_iva,
            'monto': monto,
        }

        serializer = CotizacionSerializer(data=data)
        if serializer.is_valid():
            cotizacion = serializer.save(usuario=request.user)
            for item in items_data:
                ItemCotizacion.objects.create(
                    cotizacion=cotizacion,
                    descripcion=item.get('descripcion', ''),
                    cantidad=int(item.get('cantidad', 1)),
                    precio_unitario=int(item.get('precio_unitario', 0))
                )
            return Response(CotizacionSerializer(cotizacion).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CotizacionDetalleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            cotizacion = Cotizacion.objects.get(pk=pk, usuario=request.user)
        except Cotizacion.DoesNotExist:
            return Response({'error': 'No encontrada'}, status=status.HTTP_404_NOT_FOUND)

        nuevo_estado = request.data.get('estado')
        serializer = CotizacionSerializer(cotizacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if nuevo_estado == 'aprobada':
                cotizacion.aprobar()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ENDPOINTS PÚBLICOS — sin autenticación

@api_view(['GET'])
def cotizacion_publica(request, token):
    try:
        cotizacion = Cotizacion.objects.get(token=token)
    except Cotizacion.DoesNotExist:
        return Response({'error': 'No encontrada'}, status=status.HTTP_404_NOT_FOUND)

    cliente = cotizacion.cliente
    contratista = cotizacion.usuario
    items = cotizacion.items.all()

    return Response({
        'id': cotizacion.id,
        'descripcion': cotizacion.descripcion,
        'detalle': cotizacion.detalle,
        'monto': cotizacion.monto,
        'incluye_iva': cotizacion.incluye_iva,
        'estado': cotizacion.estado,
        'creado_en': cotizacion.creado_en,
        'cliente': {
            'nombre': cliente.nombre,
            'email': cliente.email,
            'comuna': cliente.comuna,
        },
        'contratista': {
            'nombre': f'{contratista.first_name} {contratista.last_name}'.strip(),
            'email': contratista.email,
        },
        'items': [
            {
                'descripcion': i.descripcion,
                'cantidad': i.cantidad,
                'precio_unitario': i.precio_unitario,
                'subtotal': i.subtotal,
            } for i in items
        ]
    })


@api_view(['POST'])
def cotizacion_responder(request, token):
    try:
        cotizacion = Cotizacion.objects.get(token=token)
    except Cotizacion.DoesNotExist:
        return Response({'error': 'No encontrada'}, status=status.HTTP_404_NOT_FOUND)

    if cotizacion.estado != 'enviada':
        return Response({'error': 'Esta cotización no puede ser respondida'}, status=status.HTTP_400_BAD_REQUEST)

    respuesta = request.data.get('estado')
    if respuesta not in ['aprobada', 'rechazada']:
        return Response({'error': 'Estado inválido'}, status=status.HTTP_400_BAD_REQUEST)

    if respuesta == 'aprobada':
        cotizacion.aprobar()
    else:
        cotizacion.estado = 'rechazada'
        cotizacion.save()

    return Response({'estado': cotizacion.estado})