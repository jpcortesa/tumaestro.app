from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ContratistaViewSet, RegistroView

router = DefaultRouter()
router.register(r'contratistas', ContratistaViewSet)

urlpatterns = router.urls + [
    path('registro/', RegistroView.as_view()),
]