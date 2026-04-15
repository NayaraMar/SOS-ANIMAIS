from django.urls import path
from . import views 

urlpatterns = [
    path('denuncias/', views.lista_denuncias),
    path('denuncias/criar/', views.criar_denuncia),
]