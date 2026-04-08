from django.contrib import admin
from .models import Orgao, Usuario, Denuncia, Evidencia

admin.site.register(Orgao)
admin.site.register(Usuario)
admin.site.register(Denuncia)
admin.site.register(Evidencia)