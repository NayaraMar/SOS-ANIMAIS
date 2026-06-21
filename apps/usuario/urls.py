from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('usuarios/', views.listar_usuarios),
    path('usuarios/criar/', views.criar_usuario),
    path('usuarios/<int:id>/excluir/', views.excluir_usuario),
    path('recuperar-senha/', views.recuperar_senha),
    path('redefinir-senha/', views.redefinir_senha),
]