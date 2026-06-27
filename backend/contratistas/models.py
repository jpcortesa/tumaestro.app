import uuid
import os
import resend
from django.db import models
from django.contrib.auth.models import User

resend.api_key = os.environ.get('RESEND_API_KEY', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://tumaestro.app')


class Contratista(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    oficio = models.CharField(max_length=100)
    oficios = models.JSONField(default=list, blank=True)
    telefono = models.CharField(max_length=20)
    rut = models.CharField(max_length=12, blank=True, null=True, unique=True)
    descripcion = models.TextField(blank=True)
    certificacion = models.TextField(blank=True)
    comuna = models.CharField(max_length=100, blank=True)
    comunas = models.JSONField(default=list, blank=True)
    experiencia = models.IntegerField(default=0)
    activo = models.BooleanField(default=True)
    email_verificado = models.BooleanField(default=False)
    verificado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.oficio}"


class Cliente(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=12, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    comuna = models.CharField(max_length=100, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.usuario}"


class Cotizacion(models.Model):
    ESTADOS = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    cliente_nombre = models.CharField(max_length=100, blank=True)
    cliente_rut = models.CharField(max_length=12, blank=True)
    descripcion = models.CharField(max_length=200)
    detalle = models.TextField(blank=True)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='borrador')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cotización {self.id} - {self.cliente.nombre}"

    def save(self, *args, **kwargs):
        if self.estado == 'aprobada':
            trabajo_existe = Trabajo.objects.filter(
                usuario=self.usuario,
                cliente=self.cliente.nombre,
                descripcion=self.descripcion
            ).exists()
            
            if not trabajo_existe:
                try:
                    print(f"\n[TRABAJO] Creando trabajo para cotización {self.id}...")
                    
                    cliente_rut_value = self.cliente.rut if self.cliente.rut else None
                    cliente_email_value = self.cliente.email if self.cliente.email else ''
                    cliente_comuna_value = self.cliente.comuna if self.cliente.comuna else ''
                    
                    print(f"  - Cliente: {self.cliente.nombre}")
                    print(f"  - RUT: {cliente_rut_value}")
                    print(f"  - Email: {cliente_email_value}")
                    print(f"  - Comuna: {cliente_comuna_value}")
                    
                    trabajo = Trabajo.objects.create(
                        usuario=self.usuario,
                        cliente=self.cliente.nombre,
                        cliente_email=cliente_email_value,
                        cliente_rut=cliente_rut_value,
                        descripcion=self.descripcion,
                        comuna=cliente_comuna_value,
                        monto=self.monto,
                        incluye_iva=self.incluye_iva,
                        estado='pendiente',
                        fecha=self.creado_en.date(),
                    )
                    print(f"  ✓ Trabajo #{trabajo.id} creado exitosamente\n")
                    
                except Exception as e:
                    print(f"\n[ERROR TRABAJO] {type(e).__name__}: {str(e)}")
                    import traceback
                    traceback.print_exc()
        
        super().save(*args, **kwargs)

    def aprobar(self):
        self.estado = 'aprobada'
        self.save()


class ItemCotizacion(models.Model):
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name='items')
    descripcion = models.CharField(max_length=200)
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.IntegerField(default=0)

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.descripcion} x{self.cantidad}"


class Trabajo(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En progreso'),
        ('completado', 'Completado'),
        ('cotizacion', 'Cotizacion'),
    ]
    
    TRANSICIONES_PERMITIDAS = {
        'pendiente': ['en_progreso'],
        'en_progreso': ['completado'],
        'completado': [],
        'cotizacion': ['pendiente', 'en_progreso'],
    }

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trabajos')
    cliente = models.CharField(max_length=100)
    cliente_email = models.EmailField(blank=True)
    cliente_rut = models.CharField(max_length=12, blank=True, null=True)
    descripcion = models.CharField(max_length=200)
    comuna = models.CharField(max_length=100)
    monto = models.IntegerField(default=0)
    incluye_iva = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateField(auto_now_add=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    token_resena = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    def __str__(self):
        return f"{self.cliente} - {self.descripcion}"
    
    def _enviar_email_trabajo_iniciado(self):
        """Envía email cuando trabajo pasa a en_progreso"""
        if not self.cliente_email:
            return
        try:
            contratista_nombre = f'{self.usuario.first_name} {self.usuario.last_name}'.strip()
            resend.Emails.send({
                "from": "tumaestro.app <noreply@tumaestro.app>",
                "to": self.cliente_email,
                "subject": "🔨 ¡Tu trabajo está en camino! - tumaestro.app",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                    <h2 style="color: #1B3A6B;">¡Trabajo iniciado!</h2>
                    <p>Hola <strong>{self.cliente}</strong>,</p>
                    <p><strong>{contratista_nombre}</strong> ha comenzado el trabajo. Nos contactaremos contigo con actualizaciones.</p>
                    <div style="background: #F8F9FA; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #059669;">
                        <p style="margin: 4px 0;"><strong>Trabajo:</strong> {self.descripcion}</p>
                        <p style="margin: 4px 0;"><strong>Contratista:</strong> {contratista_nombre}</p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px;">
                        En breve recibirás actualizaciones sobre el progreso del trabajo.
                    </p>
                    <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 16px;">
                        tumaestro.app — La plataforma para contratistas independientes en Chile
                    </p>
                </div>
                """
            })
            print(f"[EMAIL ✓] Notificación enviada: {self.cliente_email}")
        except Exception as e:
            print(f"[EMAIL ❌] Error enviando email: {e}")
    
    def save(self, *args, **kwargs):
        # Validar flujo de estados SOLO si es update (tiene pk)
        estado_cambio = None
        if self.pk:
            trabajo_db = Trabajo.objects.get(pk=self.pk)
            estado_anterior = trabajo_db.estado
            estado_nuevo = self.estado
            
            # Si el estado cambió, validar
            if estado_anterior != estado_nuevo:
                transiciones_permitidas = self.TRANSICIONES_PERMITIDAS.get(estado_anterior, [])
                
                # Si el nuevo estado NO está en las transiciones permitidas, lanzar error
                if estado_nuevo not in transiciones_permitidas:
                    estado_anterior_label = dict(self.ESTADOS)[estado_anterior]
                    estado_nuevo_label = dict(self.ESTADOS).get(estado_nuevo, estado_nuevo)
                    transiciones_labels = ', '.join([dict(self.ESTADOS)[e] for e in transiciones_permitidas]) if transiciones_permitidas else 'ninguna (estado terminal)'
                    
                    mensaje = f"❌ No se puede cambiar de '{estado_anterior_label}' a '{estado_nuevo_label}'. " \
                             f"Transiciones permitidas desde '{estado_anterior_label}': {transiciones_labels}"
                    raise ValueError(mensaje)
                else:
                    print(f"[FLUJO OK] {estado_anterior} → {estado_nuevo}")
                    # Guardar el cambio de estado para disparar eventos después
                    estado_cambio = (estado_anterior, estado_nuevo)
        
        super().save(*args, **kwargs)
        
        # Disparar emails según transición de estado
        if estado_cambio:
            estado_anterior, estado_nuevo = estado_cambio
            
            # 🔨 Cuando pasa de pendiente a en_progreso, enviar email "¡Tu trabajo está en camino!"
            if estado_anterior == 'pendiente' and estado_nuevo == 'en_progreso':
                print(f"[FLUJO] Disparando email: {estado_anterior} → {estado_nuevo}")
                self._enviar_email_trabajo_iniciado()


class SolicitudCotizacion(models.Model):
    contratista = models.ForeignKey(Contratista, on_delete=models.CASCADE, related_name='solicitudes')
    nombre_cliente = models.CharField(max_length=100)
    rut_cliente = models.CharField(max_length=12, blank=True)
    telefono_cliente = models.CharField(max_length=20)
    email_cliente = models.EmailField(blank=True)
    descripcion = models.TextField()
    leida = models.BooleanField(default=False)
    descartada = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Solicitud de {self.nombre_cliente} para {self.contratista.nombre}"


class Resena(models.Model):
    trabajo = models.OneToOneField(Trabajo, on_delete=models.CASCADE, related_name='resena')
    contratista = models.ForeignKey(Contratista, on_delete=models.CASCADE, related_name='resenas')
    nombre_cliente = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comentario = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reseña de {self.nombre_cliente} para {self.contratista.nombre} — {self.rating}★"


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)

    def is_valid(self):
        from django.utils import timezone
        from datetime import timedelta
        return not self.usado and (timezone.now() - self.creado_en) < timedelta(hours=2)

    def __str__(self):
        return f"Reset token para {self.user.email}"


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)

    def __str__(self):
        return f"Verificación email para {self.user.email}"