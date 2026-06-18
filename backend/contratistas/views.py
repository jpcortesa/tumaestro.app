import os
import resend
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Contratista, Trabajo, Cliente, Cotizacion, ItemCotizacion, SolicitudCotizacion, Resena
from .serializers import ContratistaSerializer, TrabajoSerializer, ClienteSerializer, CotizacionSerializer, ItemCotizacionSerializer

resend.api_key = os.environ.get('RESEND_API_KEY', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://tumaestro.app')


# HELPERS DE EMAIL

def enviar_email_solicitud_maestro(contratista, solicitud):
    if not contratista.usuario or not contratista.usuario.email:
        return
    try:
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": contratista.usuario.email,
            "subject": f"📩 Nueva solicitud de {solicitud.nombre_cliente}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">Nueva solicitud de cotización</h2>
                <p>Hola <strong>{contratista.nombre}</strong>,</p>
                <p>Tienes una nueva solicitud de cotización en tumaestro.app:</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #F97316;">
                    <p style="margin: 4px 0;"><strong>Cliente:</strong> {solicitud.nombre_cliente}</p>
                    <p style="margin: 4px 0;"><strong>Teléfono:</strong> {solicitud.telefono_cliente}</p>
                    {"<p style='margin: 4px 0;'><strong>Email:</strong> " + solicitud.email_cliente + "</p>" if solicitud.email_cliente else ""}
                    <p style="margin: 8px 0 4px;"><strong>Descripción:</strong></p>
                    <p style="margin: 0; color: #374151;">{solicitud.descripcion}</p>
                </div>
                <a href="{FRONTEND_URL}/panel" style="display: inline-block; background: #F97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                    Ver en mi panel →
                </a>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email al maestro: {e}")


def enviar_email_confirmacion_cliente(solicitud):
    if not solicitud.email_cliente:
        return
    try:
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": solicitud.email_cliente,
            "subject": "✅ Tu solicitud fue enviada - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">¡Solicitud enviada con éxito!</h2>
                <p>Hola <strong>{solicitud.nombre_cliente}</strong>,</p>
                <p>Tu solicitud fue recibida por <strong>{solicitud.contratista.nombre}</strong> y se pondrá en contacto contigo a la brevedad.</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #F97316;">
                    <p style="margin: 4px 0;"><strong>Tu solicitud:</strong></p>
                    <p style="margin: 4px 0; color: #374151;">{solicitud.descripcion}</p>
                </div>
                <p style="color: #6B7280; font-size: 14px;">El contratista puede contactarte por teléfono al <strong>{solicitud.telefono_cliente}</strong>.</p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando confirmación al cliente: {e}")


def enviar_email_cotizacion_cliente(cotizacion, link):
    if not cotizacion.cliente.email:
        return
    try:
        cliente = cotizacion.cliente
        contratista_nombre = f'{cotizacion.usuario.first_name} {cotizacion.usuario.last_name}'.strip()
        monto_formateado = f"{cotizacion.monto:,}".replace(",", ".")
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": cliente.email,
            "subject": f"📋 Cotización de {contratista_nombre} lista para revisar",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">Tienes una cotización lista</h2>
                <p>Hola <strong>{cliente.nombre}</strong>,</p>
                <p><strong>{contratista_nombre}</strong> te ha enviado una cotización por el trabajo solicitado.</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #1B3A6B;">
                    <p style="margin: 4px 0;"><strong>Descripción:</strong> {cotizacion.descripcion}</p>
                    <p style="margin: 4px 0; font-size: 18px;"><strong>Total: ${monto_formateado}</strong></p>
                </div>
                <a href="{link}" style="display: inline-block; background: #1B3A6B; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px; font-size: 15px;">
                    Ver y responder cotización →
                </a>
                <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">
                    Desde el link puedes aprobar o rechazar esta cotización.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email al cliente: {e}")


def enviar_email_trabajo_iniciado(cotizacion):
    if not cotizacion.cliente.email:
        return
    try:
        cliente = cotizacion.cliente
        contratista_nombre = f'{cotizacion.usuario.first_name} {cotizacion.usuario.last_name}'.strip()
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": cliente.email,
            "subject": "🔨 ¡Tu trabajo está en camino! - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">¡Cotización aceptada con éxito!</h2>
                <p>Hola <strong>{cliente.nombre}</strong>,</p>
                <p>Hemos registrado tu aprobación. <strong>{contratista_nombre}</strong> se pondrá en contacto contigo a la brevedad para coordinar el inicio de los trabajos.</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #059669;">
                    <p style="margin: 4px 0;"><strong>Trabajo:</strong> {cotizacion.descripcion}</p>
                    <p style="margin: 4px 0;"><strong>Contratista:</strong> {contratista_nombre}</p>
                </div>
                <p style="color: #6B7280; font-size: 14px;">
                    En breve recibirás una llamada o mensaje para coordinar los detalles y fecha de inicio.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email trabajo iniciado: {e}")


def enviar_email_trabajo_completado(trabajo):
    try:
        cliente_email = trabajo.cliente_email
        if not cliente_email:
            return

        cliente_nombre = trabajo.cliente
        contratista_nombre = f'{trabajo.usuario.first_name} {trabajo.usuario.last_name}'.strip()
        link = f"{FRONTEND_URL}/calificar/{trabajo.token_resena}"

        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": cliente_email,
            "subject": f"⭐ ¿Cómo te fue con {contratista_nombre}? - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">¡Tu trabajo ha sido completado!</h2>
                <p>Hola <strong>{cliente_nombre}</strong>,</p>
                <p><strong>{contratista_nombre}</strong> ha marcado el trabajo como completado. Esperamos que todo haya salido excelente.</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #059669;">
                    <p style="margin: 4px 0;"><strong>Trabajo:</strong> {trabajo.descripcion}</p>
                    <p style="margin: 4px 0;"><strong>Contratista:</strong> {contratista_nombre}</p>
                </div>
                <p style="color: #374151; font-size: 15px; margin: 20px 0;">
                    Tu opinión es muy importante para otros clientes. ¿Puedes tomarte un momento para calificar el trabajo?
                </p>
                <a href="{link}" style="display: inline-block; background: #F97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                    ⭐ Calificar a {contratista_nombre} →
                </a>
                <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">
                    Solo toma un minuto y ayuda a otros clientes a encontrar buenos profesionales.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email trabajo completado: {e}")


def enviar_email_resena_contratista(resena):
    try:
        contratista = resena.contratista
        if not contratista.usuario or not contratista.usuario.email:
            return
        estrellas = '⭐' * resena.rating
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": contratista.usuario.email,
            "subject": f"⭐ Nueva reseña de {resena.nombre_cliente}",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">¡Tienes una nueva reseña!</h2>
                <p>Hola <strong>{contratista.nombre}</strong>,</p>
                <p><strong>{resena.nombre_cliente}</strong> ha calificado tu trabajo.</p>
                <div style="background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #F97316; text-align: center;">
                    <p style="font-size: 32px; margin: 0 0 8px;">{estrellas}</p>
                    <p style="font-size: 20px; font-weight: 700; color: #1B3A6B; margin: 0 0 8px;">{resena.rating} / 5</p>
                    {f'<p style="font-size: 15px; color: #374151; font-style: italic; margin: 12px 0 0;">"{resena.comentario}"</p>' if resena.comentario else ''}
                </div>
                <a href="{FRONTEND_URL}/panel" style="display: inline-block; background: #1B3A6B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                    Ver en mi panel →
                </a>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email reseña al contratista: {e}")


# CLASES Y VISTAS

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
            usuario=user,
            nombre=f'{nombre} {apellido}',
            oficio=oficio,
            telefono=telefono,
            comuna=comuna,
            experiencia=experiencia,
            descripcion=descripcion,
            activo=True
        )

        return Response({'mensaje': 'Registro exitoso', 'email': email}, status=status.HTTP_201_CREATED)

class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            contratista = Contratista.objects.get(usuario=user)
            contratista_id = contratista.id
            oficio = contratista.oficio
        except Contratista.DoesNotExist:
            contratista_id = None
            oficio = None

        return Response({
            'nombre': f'{user.first_name} {user.last_name}'.strip(),
            'email': user.email,
            'username': user.username,
            'contratista_id': contratista_id,
            'oficio': oficio,
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

        nuevo_estado = request.data.get('estado')
        serializer = TrabajoSerializer(trabajo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if nuevo_estado == 'completado':
                enviar_email_trabajo_completado(trabajo)
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
            if nuevo_estado == 'enviada':
                link = f"{FRONTEND_URL}/cotizacion/{cotizacion.token}"
                enviar_email_cotizacion_cliente(cotizacion, link)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ENDPOINTS PÚBLICOS — sin autenticación

@api_view(['GET'])
def contratistas_publicos(request):
    contratistas = Contratista.objects.filter(activo=True).order_by('-creado_en')
    data = []
    for c in contratistas:
        data.append({
            'id': c.id,
            'nombre': c.nombre,
            'oficio': c.oficio,
            'comuna': c.comuna,
            'experiencia': c.experiencia,
            'descripcion': c.descripcion,
            'verificado': c.verificado,
        })
    return Response(data)

@api_view(['GET'])
def contratista_publico(request, pk):
    try:
        c = Contratista.objects.get(pk=pk, activo=True)
    except Contratista.DoesNotExist:
        return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': c.id,
        'nombre': c.nombre,
        'oficio': c.oficio,
        'comuna': c.comuna,
        'experiencia': c.experiencia,
        'descripcion': c.descripcion,
        'verificado': c.verificado,
        'telefono': c.telefono,
    })

@api_view(['POST'])
def solicitud_cotizacion(request, pk):
    try:
        contratista = Contratista.objects.get(pk=pk, activo=True)
    except Contratista.DoesNotExist:
        return Response({'error': 'Contratista no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    nombre = request.data.get('nombre_cliente', '')
    telefono = request.data.get('telefono_cliente', '')
    email = request.data.get('email_cliente', '')
    descripcion = request.data.get('descripcion', '')

    if not nombre or not telefono or not descripcion:
        return Response({'error': 'Nombre, teléfono y descripción son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    solicitud = SolicitudCotizacion.objects.create(
        contratista=contratista,
        nombre_cliente=nombre,
        telefono_cliente=telefono,
        email_cliente=email,
        descripcion=descripcion
    )

    enviar_email_solicitud_maestro(contratista, solicitud)
    enviar_email_confirmacion_cliente(solicitud)

    return Response({'mensaje': 'Solicitud enviada exitosamente'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def mis_solicitudes(request):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        contratista = Contratista.objects.get(usuario=request.user)
    except Contratista.DoesNotExist:
        return Response([])

    solicitudes = SolicitudCotizacion.objects.filter(
        contratista=contratista
    ).order_by('-creado_en')

    data = [{
        'id': s.id,
        'nombre_cliente': s.nombre_cliente,
        'telefono_cliente': s.telefono_cliente,
        'email_cliente': s.email_cliente,
        'descripcion': s.descripcion,
        'leida': s.leida,
        'descartada': s.descartada,
        'creado_en': s.creado_en,
    } for s in solicitudes]
    return Response(data)

@api_view(['PATCH'])
def marcar_solicitud_leida(request, pk):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        contratista = Contratista.objects.get(usuario=request.user)
        solicitud = SolicitudCotizacion.objects.get(pk=pk, contratista=contratista)
    except (Contratista.DoesNotExist, SolicitudCotizacion.DoesNotExist):
        return Response({'error': 'No encontrada'}, status=status.HTTP_404_NOT_FOUND)

    solicitud.leida = True
    solicitud.save()
    return Response({'mensaje': 'Marcada como leída'})

@api_view(['PATCH'])
def descartar_solicitud(request, pk):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        contratista = Contratista.objects.get(usuario=request.user)
        solicitud = SolicitudCotizacion.objects.get(pk=pk, contratista=contratista)
    except (Contratista.DoesNotExist, SolicitudCotizacion.DoesNotExist):
        return Response({'error': 'No encontrada'}, status=status.HTTP_404_NOT_FOUND)

    solicitud.descartada = True
    solicitud.leida = True
    solicitud.save()
    return Response({'mensaje': 'Solicitud descartada'})

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
        enviar_email_trabajo_iniciado(cotizacion)
    else:
        cotizacion.estado = 'rechazada'
        cotizacion.save()

    return Response({'estado': cotizacion.estado})


@api_view(['GET', 'POST'])
def calificar_trabajo(request, token_resena):
    try:
        trabajo = Trabajo.objects.get(token_resena=token_resena)
    except Trabajo.DoesNotExist:
        return Response({'error': 'Link no válido'}, status=status.HTTP_404_NOT_FOUND)

    if trabajo.estado != 'completado':
        return Response({'error': 'Este trabajo no puede ser calificado'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        contratista = Contratista.objects.get(usuario=trabajo.usuario)
    except Contratista.DoesNotExist:
        return Response({'error': 'Contratista no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        ya_calificado = Resena.objects.filter(trabajo=trabajo).exists()
        return Response({
            'ya_calificado': ya_calificado,
            'trabajo': trabajo.descripcion,
            'cliente': trabajo.cliente,
            'contratista': contratista.nombre,
            'contratista_oficio': contratista.oficio,
        })

    # POST — guardar reseña
    if Resena.objects.filter(trabajo=trabajo).exists():
        return Response({'error': 'Este trabajo ya fue calificado'}, status=status.HTTP_400_BAD_REQUEST)

    rating = request.data.get('rating')
    comentario = request.data.get('comentario', '').strip()

    if not rating or int(rating) not in [1, 2, 3, 4, 5]:
        return Response({'error': 'Rating debe ser entre 1 y 5'}, status=status.HTTP_400_BAD_REQUEST)

    resena = Resena.objects.create(
        trabajo=trabajo,
        contratista=contratista,
        nombre_cliente=trabajo.cliente,
        rating=int(rating),
        comentario=comentario
    )

    enviar_email_resena_contratista(resena)

    return Response({'mensaje': 'Reseña enviada con éxito'}, status=status.HTTP_201_CREATED)