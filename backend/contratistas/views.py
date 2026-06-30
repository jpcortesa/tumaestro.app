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
from .models import Contratista, Trabajo, Cliente, Cotizacion, ItemCotizacion, SolicitudCotizacion, Resena, PasswordResetToken, EmailVerificationToken
from .serializers import ContratistaSerializer, TrabajoSerializer, ClienteSerializer, CotizacionSerializer, ItemCotizacionSerializer, SolicitudCotizacionSerializer

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


def enviar_email_cotizacion_aprobada_contratista(cotizacion):
    """
    Notifica al contratista que su cotización fue aprobada por el cliente.
    Le pide que cambie el trabajo a 'en progreso' para informar al cliente.
    """
    if not cotizacion.usuario or not cotizacion.usuario.email:
        return
    
    try:
        contratista_nombre = f'{cotizacion.usuario.first_name} {cotizacion.usuario.last_name}'.strip()
        cliente_nombre = cotizacion.cliente.nombre
        monto_formateado = f"{cotizacion.monto:,}".replace(",", ".")
        link_panel = f"{FRONTEND_URL}/panel"
        
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": cotizacion.usuario.email,
            "subject": "✅ ¡Cotización aprobada! - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #059669;">¡Cotización aprobada!</h2>
                <p>Hola <strong>{contratista_nombre}</strong>,</p>
                <p><strong>{cliente_nombre}</strong> ha aprobado tu cotización. ¡Felicidades! 🎉</p>
                
                <div style="background: #ECFDF5; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #059669;">
                    <p style="margin: 4px 0;"><strong>Cliente:</strong> {cliente_nombre}</p>
                    <p style="margin: 4px 0;"><strong>Descripción:</strong> {cotizacion.descripcion}</p>
                    <p style="margin: 4px 0; font-size: 16px; font-weight: bold;"><strong>Monto:</strong> ${monto_formateado}</p>
                </div>
                
                <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <p style="color: #92400E; font-weight: bold; margin-top: 0;">⚠️ Próximo paso:</p>
                    <p style="color: #92400E; margin: 8px 0;">
                        Para informarle al cliente que su trabajo ya está en camino, debes:
                    </p>
                    <ol style="color: #92400E; margin: 0; padding-left: 20px;">
                        <li>Entra a tu panel de tumaestro.app</li>
                        <li>Encuentra el trabajo en estado <strong>"Pendiente"</strong></li>
                        <li>Cambia el estado a <strong>"En progreso"</strong></li>
                        <li>El cliente recibirá automáticamente una notificación 🔨</li>
                    </ol>
                </div>
                
                <a href="{link_panel}" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; margin-top: 16px;">
                    Ir a mi panel →
                </a>
                
                <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">
                    Una vez que cambies el trabajo a "En progreso", el cliente recibirá la notificación 🔨 "¡Tu trabajo está en camino!"
                </p>
                
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
        print(f"[EMAIL ✓] Notificación enviada al contratista: {cotizacion.usuario.email}")
    except Exception as e:
        print(f"[EMAIL ❌] Error enviando email al contratista: {e}")


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


def enviar_email_reset_password(user, token):
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    try:
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": user.email,
            "subject": "🔑 Recupera tu contraseña - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">Recupera tu contraseña</h2>
                <p>Hola <strong>{user.first_name}</strong>,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en tumaestro.app.</p>
                <p>Haz click en el botón para crear una nueva contraseña. Este link es válido por <strong>2 horas</strong>.</p>
                <a href="{link}" style="display: inline-block; background: #F97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; margin: 16px 0;">
                    Restablecer contraseña →
                </a>
                <p style="color: #6B7280; font-size: 13px;">Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña no cambiará.</p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email reset: {e}")


def enviar_email_verificacion(user, token):
    link = f"{FRONTEND_URL}/verificar-email?token={token}"
    try:
        resend.Emails.send({
            "from": "tumaestro.app <noreply@tumaestro.app>",
            "to": user.email,
            "subject": "✉️ Verifica tu email - tumaestro.app",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <h2 style="color: #1B3A6B;">¡Bienvenido a tumaestro.app!</h2>
                <p>Hola <strong>{user.first_name}</strong>,</p>
                <p>Gracias por registrarte. Para activar tu cuenta y comenzar a recibir clientes, debes verificar tu dirección de email.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{link}" style="display: inline-block; background: #F97316; color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                        ✅ Verificar mi email →
                    </a>
                </div>
                <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 8px; padding: 14px 16px; margin: 16px 0;">
                    <p style="font-size: 13px; color: #92400E; margin: 0;">
                        ⚠️ Este link es válido por <strong>24 horas</strong>. Si no verificas tu email en ese plazo, deberás solicitar un nuevo link desde la página de inicio de sesión.
                    </p>
                </div>
                <p style="color: #6B7280; font-size: 13px;">Si no creaste esta cuenta, puedes ignorar este email.</p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                    tumaestro.app — La plataforma para contratistas independientes en Chile
                </p>
            </div>
            """
        })
    except Exception as e:
        print(f"Error enviando email verificación: {e}")


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

        data = super().validate(attrs)

        # Bloquear login si email no verificado
        try:
            contratista = Contratista.objects.get(usuario=self.user)
            if not contratista.email_verificado:
                raise Exception('EMAIL_NO_VERIFICADO')
        except Contratista.DoesNotExist:
            pass

        return data

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
        rut = data.get('rut', '')
        certificacion = data.get('certificacion', '')
        
        # Validar que el RUT no esté registrado
        if rut and Contratista.objects.filter(rut=rut).exists():
            return Response({'error': 'Este RUT ya está registrado en la plataforma'}, status=400)
        
        oficios_lista = data.get('oficios', [])
        oficio_legacy = data.get('oficio', '')
        if not oficios_lista and oficio_legacy:
            oficios_lista = [oficio_legacy]
        oficio_principal = oficios_lista[0] if oficios_lista else ''
        comuna = data.get('comuna', '')
        telefono = data.get('telefono', '')
        experiencia = data.get('experiencia', 0)
        descripcion = data.get('descripcion', '')

        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            return Response({'error': 'Este email ya está registrado. ¿Ya tienes una cuenta? Inicia sesión.'}, status=status.HTTP_400_BAD_REQUEST)

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
            oficio=oficio_principal,
            oficios=oficios_lista,
            telefono=telefono,
            rut=rut,
            certificacion=certificacion,
            comuna=comuna,
            experiencia=experiencia,
            descripcion=descripcion,
            activo=True,
            email_verificado=False,
        )

        # Crear token y enviar email de verificación
        verification_token = EmailVerificationToken.objects.create(user=user)
        enviar_email_verificacion(user, verification_token.token)

        return Response({
            'mensaje': 'Registro exitoso. Revisa tu email para verificar tu cuenta.',
            'email': email
        }, status=status.HTTP_201_CREATED)


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            contratista = Contratista.objects.get(usuario=user)
            contratista_id = contratista.id
            oficio = contratista.oficio
            email_verificado = contratista.email_verificado
            foto_url = contratista.foto_url
        except Contratista.DoesNotExist:
            contratista_id = None
            oficio = None
            email_verificado = False
            foto_url = None

        return Response({
            'nombre': f'{user.first_name} {user.last_name}'.strip(),
            'email': user.email,
            'username': user.username,
            'contratista_id': contratista_id,
            'oficio': oficio,
            'email_verificado': email_verificado,
            'foto_url': foto_url,
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
        tipo_impuesto = request.data.get('tipo_impuesto', 'ninguno')
        
        # Calcular incluye_iva basado en tipo_impuesto
        incluye_iva = tipo_impuesto in ['iva', 'honorarios']

        subtotal = sum(int(i.get('cantidad', 1)) * int(i.get('precio_unitario', 0)) for i in items_data)
        
        # Calcular monto según tipo_impuesto
        if tipo_impuesto == 'iva':
            monto = int(subtotal * 1.19)
        elif tipo_impuesto == 'honorarios':
            monto = int(subtotal * 1.1525)
        else:  # 'ninguno'
            monto = subtotal

        data = {
            'cliente': request.data.get('cliente'),
            'descripcion': request.data.get('descripcion'),
            'detalle': request.data.get('detalle', ''),
            'tipo_impuesto': tipo_impuesto,
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
        
        # Si se está actualizando tipo_impuesto, recalcular monto
        if 'tipo_impuesto' in request.data:
            items = cotizacion.items.all()
            subtotal = sum(int(i.cantidad) * int(i.precio_unitario) for i in items)
            
            tipo_impuesto = request.data.get('tipo_impuesto', cotizacion.tipo_impuesto)
            
            if tipo_impuesto == 'iva':
                monto = int(subtotal * 1.19)
            elif tipo_impuesto == 'honorarios':
                monto = int(subtotal * 1.1525)
            else:  # 'ninguno'
                monto = subtotal
            
            request.data._mutable = True if hasattr(request.data, '_mutable') else None
            request.data['monto'] = monto
            incluye_iva = tipo_impuesto in ['iva', 'honorarios']
            request.data['incluye_iva'] = incluye_iva
        
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


# ENDPOINTS PÚBLICOS

@api_view(['GET'])
def contratistas_publicos(request):
    contratistas = Contratista.objects.filter(activo=True, email_verificado=True).order_by('-creado_en')
    data = []
    for c in contratistas:
        resenas = Resena.objects.filter(contratista=c)
        total = resenas.count()
        promedio = round(sum(r.rating for r in resenas) / total, 1) if total > 0 else None
        data.append({
            'id': c.id,
            'nombre': c.nombre,
            'oficio': c.oficio,
            'oficios': c.oficios if hasattr(c, 'oficios') and c.oficios else [],
            'comuna': c.comuna,
            'comunas': c.comunas if hasattr(c, 'comunas') and c.comunas else [],
            'experiencia': c.experiencia,
            'descripcion': c.descripcion,
            'certificacion': c.certificacion,
            'verificado': c.verificado,
            'promedio_resenas': promedio,
            'total_resenas': total,
        })
    return Response(data)


@api_view(['GET'])
def contratista_publico(request, pk):
    try:
        c = Contratista.objects.get(pk=pk, activo=True, email_verificado=True)
    except Contratista.DoesNotExist:
        return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': c.id,
        'nombre': c.nombre,
        'oficio': c.oficio,
        'oficios': c.oficios if hasattr(c, 'oficios') and c.oficios else [],
        'comuna': c.comuna,
        'comunas': c.comunas if hasattr(c, 'comunas') and c.comunas else [],
        'experiencia': c.experiencia,
        'descripcion': c.descripcion,
        'certificacion': c.certificacion,
        'verificado': c.verificado,
        'telefono': c.telefono,
        'foto_url': c.foto_url,
    })


@api_view(['POST'])
def solicitud_cotizacion(request, pk):
    try:
        contratista = Contratista.objects.get(pk=pk, activo=True, email_verificado=True)
    except Contratista.DoesNotExist:
        return Response({'error': 'Contratista no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    nombre = request.data.get('nombre_cliente', '')
    telefono = request.data.get('telefono_cliente', '')
    email = request.data.get('email_cliente', '')
    rut = request.data.get('rut_cliente', '')
    descripcion = request.data.get('descripcion', '')

    if not nombre or not telefono or not descripcion:
        return Response({'error': 'Nombre, teléfono y descripción son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    solicitud = SolicitudCotizacion.objects.create(
        contratista=contratista,
        nombre_cliente=nombre,
        telefono_cliente=telefono,
        email_cliente=email,
        rut_cliente=rut,
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

    solicitudes = SolicitudCotizacion.objects.filter(contratista=contratista).order_by('-creado_en')
    data = [{
        'id': s.id,
        'nombre_cliente': s.nombre_cliente,
        'telefono_cliente': s.telefono_cliente,
        'email_cliente': s.email_cliente,
        'rut_cliente': s.rut_cliente,
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
        'items': [{
            'descripcion': i.descripcion,
            'cantidad': i.cantidad,
            'precio_unitario': i.precio_unitario,
            'subtotal': i.subtotal,
        } for i in items]
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

    try:
        if respuesta == 'aprobada':
            cotizacion.aprobar()
            # Notifica al contratista que debe cambiar el trabajo a 'en progreso'
            enviar_email_cotizacion_aprobada_contratista(cotizacion)
        else:
            cotizacion.estado = 'rechazada'
            cotizacion.save()
        
        return Response({'estado': cotizacion.estado, 'mensaje': 'Operación exitosa'})
    except Exception as e:
        print(f"Error en cotizacion_responder: {e}")
        return Response({'error': f'Error al procesar: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET'])
def resenas_contratista(request, pk):
    try:
        contratista = Contratista.objects.get(pk=pk, activo=True)
    except Contratista.DoesNotExist:
        return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

    resenas = Resena.objects.filter(contratista=contratista).order_by('-creado_en')
    total = resenas.count()
    promedio = round(sum(r.rating for r in resenas) / total, 1) if total > 0 else None

    data = {
        'promedio': promedio,
        'total': total,
        'resenas': [{
            'nombre_cliente': r.nombre_cliente,
            'rating': r.rating,
            'comentario': r.comentario,
            'creado_en': r.creado_en,
            'trabajo': r.trabajo.descripcion,
        } for r in resenas]
    }
    return Response(data)


@api_view(['GET'])
def mis_resenas(request):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        contratista = Contratista.objects.get(usuario=request.user)
    except Contratista.DoesNotExist:
        return Response([])

    resenas = Resena.objects.filter(contratista=contratista).order_by('-creado_en')
    total = resenas.count()
    promedio = round(sum(r.rating for r in resenas) / total, 1) if total > 0 else None

    data = {
        'promedio': promedio,
        'total': total,
        'resenas': [{
            'id': r.id,
            'nombre_cliente': r.nombre_cliente,
            'rating': r.rating,
            'comentario': r.comentario,
            'creado_en': r.creado_en,
            'trabajo': r.trabajo.descripcion,
        } for r in resenas]
    }
    return Response(data)


# CONFIGURACIÓN

class ConfiguracionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            contratista = Contratista.objects.get(usuario=request.user)
        except Contratista.DoesNotExist:
            return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'nombre': contratista.nombre,
            'oficio': contratista.oficio,
            'oficios': contratista.oficios if hasattr(contratista, 'oficios') and contratista.oficios else [],
            'descripcion': contratista.descripcion,
            'comuna': contratista.comuna,
            'comunas': contratista.comunas if hasattr(contratista, 'comunas') and contratista.comunas else [],
            'experiencia': contratista.experiencia,
            'telefono': contratista.telefono,
            'activo': contratista.activo,
            'email': request.user.email,
        })

    def patch(self, request):
        try:
            contratista = Contratista.objects.get(usuario=request.user)
        except Contratista.DoesNotExist:
            return Response({'error': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

        for campo in ['descripcion', 'comuna', 'comunas', 'experiencia', 'telefono', 'activo']:
            if campo in request.data:
                setattr(contratista, campo, request.data[campo])

        if 'oficios' in request.data:
            oficios_lista = request.data['oficios'][:5]
            contratista.oficios = oficios_lista
            contratista.oficio = oficios_lista[0] if oficios_lista else ''
        elif 'oficio' in request.data:
            contratista.oficio = request.data['oficio']

        contratista.save()
        return Response({'mensaje': 'Configuración actualizada'})


@api_view(['POST'])
def cambiar_password(request):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)

    password_actual = request.data.get('password_actual', '')
    password_nuevo = request.data.get('password_nuevo', '')

    if not request.user.check_password(password_actual):
        return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password_nuevo) < 6:
        return Response({'error': 'La nueva contraseña debe tener al menos 6 caracteres'}, status=status.HTTP_400_BAD_REQUEST)

    request.user.set_password(password_nuevo)
    request.user.save()
    return Response({'mensaje': 'Contraseña actualizada correctamente'})


@api_view(['DELETE'])
def eliminar_cuenta(request):
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)

    password = request.data.get('password', '')
    if not request.user.check_password(password):
        return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_400_BAD_REQUEST)

    request.user.delete()
    return Response({'mensaje': 'Cuenta eliminada permanentemente'})


@api_view(['POST'])
def subir_foto_perfil(request):
    """
    Endpoint para subir foto de perfil a Cloudinary
    
    Recibe: multipart/form-data con 'archivo' (imagen)
    Retorna: { "foto_url": "https://..." }
    """
    if not request.user.is_authenticated:
        return Response({'error': 'No autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        contratista = Contratista.objects.get(usuario=request.user)
    except Contratista.DoesNotExist:
        return Response({'error': 'Contratista no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    if 'archivo' not in request.FILES:
        return Response({'error': 'No se envió archivo'}, status=status.HTTP_400_BAD_REQUEST)
    
    archivo = request.FILES['archivo']
    
    # Validar que sea imagen
    if not archivo.content_type.startswith('image/'):
        return Response({'error': 'El archivo debe ser una imagen'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validar tamaño (máx 5MB)
    if archivo.size > 5 * 1024 * 1024:
        return Response({'error': 'La imagen debe ser menor a 5MB'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        import cloudinary
        import cloudinary.uploader
        
        # Configurar Cloudinary
        cloudinary.config(
            cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
            api_key=os.environ.get('CLOUDINARY_API_KEY'),
            api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
        )
        
        # Subir a Cloudinary
        resultado = cloudinary.uploader.upload(
            archivo,
            folder='tumaestro/fotos-perfil',
            resource_type='auto',
        )
        
        # Construir URL simple (sin transformaciones en URL)
        # El CSS del avatar se encarga del recorte
        cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
        public_id = resultado['public_id']
        foto_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}"
        
        # Guardar URL en BD
        print(f"DEBUG: Guardando foto_url: {foto_url}")
        print(f"DEBUG: Contratista antes: foto_url={contratista.foto_url}")
        contratista.foto_url = foto_url
        contratista.save()
        print(f"DEBUG: Contratista después: foto_url={contratista.foto_url}")
        
        # Verificar que se guardó
        contratista.refresh_from_db()
        print(f"DEBUG: Contratista refrescado: foto_url={contratista.foto_url}")
        
        return Response({
            'foto_url': foto_url,
            'mensaje': 'Foto subida exitosamente'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error al subir foto: {e}")
        return Response(
            {'error': f'Error al subir foto: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


# RESET PASSWORD

@api_view(['POST'])
def solicitar_reset_password(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'El email es requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'mensaje': 'Si ese email está registrado, recibirás un link en tu correo.'})

    PasswordResetToken.objects.filter(user=user, usado=False).update(usado=True)
    reset_token = PasswordResetToken.objects.create(user=user)
    enviar_email_reset_password(user, reset_token.token)

    return Response({'mensaje': 'Si ese email está registrado, recibirás un link en tu correo.'})


@api_view(['POST'])
def reset_password(request):
    token_str = request.data.get('token', '')
    password_nuevo = request.data.get('password', '')

    if not token_str or not password_nuevo:
        return Response({'error': 'Token y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password_nuevo) < 8:
        return Response({'error': 'La contraseña debe tener al menos 8 caracteres'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        reset_token = PasswordResetToken.objects.get(token=token_str)
    except PasswordResetToken.DoesNotExist:
        return Response({'error': 'Link inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

    if not reset_token.is_valid():
        return Response({'error': 'Este link ya fue usado o expiró. Solicita uno nuevo.'}, status=status.HTTP_400_BAD_REQUEST)

    reset_token.user.set_password(password_nuevo)
    reset_token.user.save()
    reset_token.usado = True
    reset_token.save()

    return Response({'mensaje': 'Contraseña actualizada correctamente'})


# VERIFICACIÓN DE EMAIL

@api_view(['POST'])
def verificar_email(request):
    token_str = request.data.get('token', '')

    if not token_str:
        return Response({'error': 'Token requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = EmailVerificationToken.objects.get(token=token_str)
    except EmailVerificationToken.DoesNotExist:
        return Response({'error': 'Link inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

    if token.usado:
        return Response({'error': 'Este link ya fue usado. Tu cuenta ya está verificada.'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar que no hayan pasado más de 24 horas
    from django.utils import timezone
    from datetime import timedelta
    if timezone.now() - token.creado_en > timedelta(hours=24):
        return Response({'error': 'Este link expiró. Solicita uno nuevo desde el inicio de sesión.'}, status=status.HTTP_400_BAD_REQUEST)

    # Activar cuenta
    try:
        contratista = Contratista.objects.get(usuario=token.user)
        contratista.email_verificado = True
        contratista.save()
    except Contratista.DoesNotExist:
        return Response({'error': 'Cuenta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    token.usado = True
    token.save()

    return Response({'mensaje': 'Email verificado correctamente. Ya puedes iniciar sesión.'})


@api_view(['POST'])
def reenviar_verificacion(request):
    email = request.data.get('email', '').strip().lower()
    if not email:
        return Response({'error': 'El email es requerido'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        contratista = Contratista.objects.get(usuario=user)
    except (User.DoesNotExist, Contratista.DoesNotExist):
        return Response({'mensaje': 'Si ese email está registrado y pendiente de verificación, recibirás un nuevo link.'})

    if contratista.email_verificado:
        return Response({'error': 'Este email ya está verificado. Puedes iniciar sesión.'}, status=status.HTTP_400_BAD_REQUEST)

    # Invalidar tokens anteriores y crear uno nuevo
    EmailVerificationToken.objects.filter(user=user, usado=False).update(usado=True)
    nuevo_token = EmailVerificationToken.objects.create(user=user)
    enviar_email_verificacion(user, nuevo_token.token)

    return Response({'mensaje': 'Si ese email está registrado y pendiente de verificación, recibirás un nuevo link.'})