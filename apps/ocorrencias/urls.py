from django.urls import path
from . import views

urlpatterns = [
    path('denuncias/', views.lista_denuncias),
    path('denuncias/criar/', views.criar_denuncia),
    path('denuncias/acompanhar/', views.acompanhar_denuncia),
    path('denuncias/status/', views.atualizar_status_denuncia),
]