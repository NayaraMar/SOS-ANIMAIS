from django.shortcuts import render
from django.http import JsonResponse
from .models import Denuncia

def lista_denuncias(request):
    dados = list(Denuncia.objects.values())
    return JsonResponse(dados, safe=False)