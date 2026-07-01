from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ContratistaViewSet, RegistroView, PerfilView,
    TrabajosView, TrabajoDetalleView,
    ClientesView, ClienteDetalleView,
    CotizacionesView, CotizacionDetalleView,
    cotizacion_publica, cotizacion_responder,
    contratistas_publicos, contratista_publico,
    solicitud_cotizacion, mis_solicitudes,
    marcar_solicitud_leida, descartar_solicitud,
    calificar_trabajo, resenas_contratista, mis_resenas,
    ConfiguracionView, cambiar_password, eliminar_cuenta, reactivar_cuenta, subir_foto_perfil,
    solicitar_reset_password, reset_password,
    verificar_email, reenviar_verificacion, reactivar_con_token,
)

router = DefaultRouter()
router.register(r'contratistas', ContratistaViewSet)

urlpatterns = router.urls + [
    path('registro/', RegistroView.as_view()),
    path('perfil/', PerfilView.as_view()),
    path('trabajos/', TrabajosView.as_view()),
    path('trabajos/<int:pk>/', TrabajoDetalleView.as_view()),
    path('clientes/', ClientesView.as_view()),
    path('clientes/<int:pk>/', ClienteDetalleView.as_view()),
    path('cotizaciones/', CotizacionesView.as_view()),
    path('cotizaciones/<int:pk>/', CotizacionDetalleView.as_view()),
    path('cotizaciones/publica/<uuid:token>/', cotizacion_publica),
    path('cotizaciones/publica/<uuid:token>/responder/', cotizacion_responder),
    path('publico/contratistas/', contratistas_publicos),
    path('publico/contratistas/<int:pk>/', contratista_publico),
    path('publico/contratistas/<int:pk>/solicitud/', solicitud_cotizacion),
    path('mis-solicitudes/', mis_solicitudes),
    path('mis-solicitudes/<int:pk>/leer/', marcar_solicitud_leida),
    path('mis-solicitudes/<int:pk>/descartar/', descartar_solicitud),
    path('trabajos/<uuid:token_resena>/calificar/', calificar_trabajo),
    path('publico/contratistas/<int:pk>/resenas/', resenas_contratista),
    path('mis-resenas/', mis_resenas),
    path('configuracion/', ConfiguracionView.as_view()),
    path('configuracion/cambiar-password/', cambiar_password),
    path('configuracion/eliminar-cuenta/', eliminar_cuenta),
    path('configuracion/reactivar-cuenta/', reactivar_cuenta),
    path('configuracion/reactivar-con-token/', reactivar_con_token),
    path('configuracion/foto/', subir_foto_perfil),
    path('solicitar-reset-password/', solicitar_reset_password),
    path('reset-password/', reset_password),
    path('verificar-email/', verificar_email),
    path('reenviar-verificacion/', reenviar_verificacion),
]