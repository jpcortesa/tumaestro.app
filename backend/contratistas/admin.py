from django.contrib import admin
from django.utils import timezone
from .models import Contratista, Trabajo, Cliente, Cotizacion, ReactivationToken

@admin.register(Contratista)
class ContratistaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email_verificado', 'deleted_at', 'activo')
    list_filter = ('activo', 'email_verificado', 'deleted_at')
    search_fields = ('nombre', 'usuario__email')
    readonly_fields = ('creado_en', 'anonymized_at')
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('usuario', 'nombre', 'rut', 'telefono', 'foto_url')
        }),
        ('Estado', {
            'fields': ('activo', 'email_verificado', 'deleted_at')
        }),
        ('Timestamps', {
            'fields': ('creado_en', 'anonymized_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['reactivar_cuenta', 'desactivar_cuenta']
    
    def reactivar_cuenta(self, request, queryset):
        actualizado = queryset.filter(deleted_at__isnull=False).update(deleted_at=None)
        self.message_user(request, f'✅ {actualizado} cuenta(s) reactivada(s)')
    reactivar_cuenta.short_description = "✅ Reactivar cuentas"
    
    def desactivar_cuenta(self, request, queryset):
        actualizado = queryset.filter(deleted_at__isnull=True).update(deleted_at=timezone.now())
        self.message_user(request, f'⏸️ {actualizado} cuenta(s) desactivada(s)')
    desactivar_cuenta.short_description = "⏸️ Desactivar cuentas"

admin.site.register(Trabajo)
admin.site.register(Cliente)
admin.site.register(Cotizacion)
admin.site.register(ReactivationToken)
