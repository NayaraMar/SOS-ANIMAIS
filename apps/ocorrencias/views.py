import json
from django.shortcuts import render, get_object_or_404
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

            lat = data.get('latitude')
            lng = data.get('longitude')
            
            # Converte string vazia para None para passar na validação numérica e do clean
            if lat == "": lat = None
            if lng == "": lng = None

            denuncia = Denuncia(
                tipo_animal=data.get('tipo_animal'),
                tipo_risco=data.get('tipo_risco'),
                descricao=data.get('descricao'),
                latitude=lat,
                longitude=lng,
                endereco=data.get('endereco'),
                email_contato=data.get('email_contato'),
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


@csrf_exempt
def atualizar_status_denuncia(request, id):
    if request.method in ['PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
            novo_status = data.get('status')

            if not novo_status or novo_status not in dict(Denuncia.STATUS_CHOICES):
                return JsonResponse({'erro': 'Status inválido ou não informado.'}, status=400)

            denuncia = get_object_or_404(Denuncia, id=id)
            denuncia.status = novo_status
            denuncia.save()

            return JsonResponse({'mensagem': 'Status atualizado com sucesso!', 'status': novo_status}, status=200)

        except Exception as e:
            return JsonResponse({'erro': str(e)}, status=500)

    return JsonResponse({'erro': 'Método não permitido'}, status=405)