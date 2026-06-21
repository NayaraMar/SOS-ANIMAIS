import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from .models import Denuncia
from .utils import enviar_email_protocolo


def opcoes_denuncia(request):
    return JsonResponse({
        'tipos_animal': [
            {'valor': valor, 'nome': nome}
            for valor, nome in Denuncia.TIPO_ANIMAL_CHOICES
        ],
        'tipos_risco': [
            {'valor': valor, 'nome': nome}
            for valor, nome in Denuncia.TIPO_RISCO_CHOICES
        ]
    })


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

            if lat == "":
                lat = None

            if lng == "":
                lng = None

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

            if denuncia.email_contato:
                enviar_email_protocolo(
                    denuncia.email_contato,
                    denuncia.protocolo
                )

            return JsonResponse({
                'mensagem': 'Denúncia criada com sucesso',
                'protocolo': denuncia.protocolo
            }, status=201)

        except ValidationError as e:
            return JsonResponse(
                {'erro': e.messages},
                status=400
            )

        except Exception as e:
            return JsonResponse(
                {'erro': str(e)},
                status=500
            )

    return JsonResponse(
        {'erro': 'Método não permitido'},
        status=405
    )


@csrf_exempt
def atualizar_status_denuncia(request):
    if request.method not in ['PUT', 'PATCH']:
        return JsonResponse(
            {'erro': 'Método não permitido'},
            status=405
        )

    try:
        data = json.loads(request.body)

        protocolo = data.get('protocolo')
        novo_status = data.get('status')

        if not protocolo:
            return JsonResponse(
                {'erro': 'Protocolo é obrigatório'},
                status=400
            )

        if not novo_status:
            return JsonResponse(
                {'erro': 'Status é obrigatório'},
                status=400
            )

        denuncia = get_object_or_404(
            Denuncia,
            protocolo=protocolo
        )

        denuncia.status = novo_status
        denuncia.save()

        return JsonResponse({
            'success': True,
            'mensagem': 'Status atualizado com sucesso',
            'dados': {
                'protocolo': denuncia.protocolo,
                'status': denuncia.status,
            }
        })

    except Exception as e:
        return JsonResponse(
            {'erro': str(e)},
            status=500
        )


@csrf_exempt
def acompanhar_denuncia(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            protocolo = data.get('protocolo')

            denuncia = Denuncia.objects.filter(
                protocolo=protocolo
            ).first()

            if not denuncia:
                return JsonResponse(
                    {'erro': 'Protocolo não encontrado'},
                    status=404
                )

            return JsonResponse({
                'protocolo': denuncia.protocolo,
                'tipo_animal': denuncia.tipo_animal,
                'tipo_risco': denuncia.tipo_risco,
                'descricao': denuncia.descricao,
                'status': denuncia.status,
                'endereco': denuncia.endereco,
            })

        except Exception as e:
            return JsonResponse(
                {'erro': str(e)},
                status=500
            )

    return JsonResponse(
        {'erro': 'Método não permitido'},
        status=405
    )