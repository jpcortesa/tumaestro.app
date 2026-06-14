from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ContratistaViewSet, RegistroView, PerfilView, TrabajosView, TrabajoDetalleView, ClientesView, ClienteDetalleView, CotizacionesView, CotizacionDetalleView

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
]