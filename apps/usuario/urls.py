from django.urls import path
from .views import login_view, logout_view, me_view, rota_protegida

urlpatterns = [
    path('login/', login_view),
    path('logout/', logout_view),
    path('me/', me_view),
    path('protegida/', rota_protegida),
]