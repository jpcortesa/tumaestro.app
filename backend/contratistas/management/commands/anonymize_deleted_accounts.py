# Guardar en: backend/contratistas/management/commands/anonymize_deleted_accounts.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from contratistas.models import Contratista


class Command(BaseCommand):
    """
    Management command para anonimizar cuentas desactivadas después de 30 días.
    
    USO:
        python manage.py anonymize_deleted_accounts
    
    Esto se debe ejecutar una vez al día como CRON JOB:
        0 2 * * * cd /ruta/al/proyecto && python manage.py anonymize_deleted_accounts
        
    (Ejecuta diariamente a las 2:00 AM)
    """
    
    help = 'Anonimiza cuentas desactivadas hace más de 30 días'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔄 Iniciando anonimización de cuentas...'))
        
        # Obtener todas las cuentas que fueron desactivadas hace más de 30 días
        hace_30_dias = timezone.now() - timedelta(days=30)
        
        cuentas_a_anonimizar = Contratista.objects.filter(
            deleted_at__isnull=False,  # Tiene fecha de desactivación
            deleted_at__lt=hace_30_dias,  # Hace más de 30 días
            is_deleted=False  # Aún no está anonimizada
        )
        
        count = cuentas_a_anonimizar.count()
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS('✅ No hay cuentas para anonimizar'))
            return
        
        self.stdout.write(self.style.WARNING(f'⚠️  Anonimizando {count} cuenta(s)...'))
        
        for contratista in cuentas_a_anonimizar:
            try:
                self.stdout.write(f'  Anonimizando: {contratista.nombre} (ID: {contratista.id})')
                contratista.anonimizar()
                self.stdout.write(self.style.SUCCESS(f'    ✓ OK'))
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'    ❌ Error: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'✅ Anonimización completada: {count} cuenta(s)')
        )