import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Denuncia
from django.core.exceptions import ValidationError

def lista_denuncias(request):
    dados = list(Denuncia.objects.values())
    return JsonResponse(dados, safe=False)

@csrf_exempt
def criar_denuncia(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            denuncia = Denuncia(
                tipo_animal=data.get('tipo_animal'),
                tipo_risco=data.get('tipo_risco'),
                descricao=data.get('descricao'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                endereco=data.get('endereco'),
            )

            denuncia.save()

            return JsonResponse({
                'mensagem': 'Denúncia criada com sucesso!',
                'protocolo': str(denuncia.protocolo)
            }, status=201)

        except ValidationError as e:
            return JsonResponse({'erro': e.message_dict}, status=400)

        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=500)

    return JsonResponse({'erro': 'Método não permitido'}, status=405)