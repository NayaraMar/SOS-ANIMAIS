import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from .models import Denuncia, Evidencia
from .utils import enviar_email_protocolo
from decimal import Decimal, ROUND_DOWN


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
    dados = []

    for denuncia in Denuncia.objects.all():
        evidencia = Evidencia.objects.filter(denuncia=denuncia).first()

        imagem_url = None
        if evidencia and evidencia.imagem:
            imagem_url = evidencia.imagem.url

        dados.append({
            'protocolo': denuncia.protocolo,
            'tipo_animal': denuncia.tipo_animal,
            'tipo_risco': denuncia.tipo_risco,
            'descricao': denuncia.descricao,
            'status': denuncia.status,
            'endereco': denuncia.endereco,
            'latitude': denuncia.latitude,
            'longitude': denuncia.longitude,
            'imagem': imagem_url
        })

    return JsonResponse(dados, safe=False)


@csrf_exempt
def criar_denuncia(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    try:
        data = request.POST
        imagem = request.FILES.get('imagem')

        campos_ausentes = []

        if not data.get('tipo_animal'):
            campos_ausentes.append('Tipo do animal')

        if not data.get('tipo_risco'):
            campos_ausentes.append('Tipo da ocorrência')

        if not data.get('descricao'):
            campos_ausentes.append('Descrição')

        lat = data.get('latitude')
        lng = data.get('longitude')

        if not data.get('endereco') and (not lat or not lng):
            campos_ausentes.append('Endereço ou localização')

        if campos_ausentes:
            return JsonResponse(
                {'erro': 'Preencha os campos obrigatórios: ' + ', '.join(campos_ausentes)},
                status=400
            )

        email_contato = data.get('email_contato') or None

        if lat in ["", None]:
            lat = None
        else:
            lat = round(float(lat), 8)

        if lng in ["", None]:
            lng = None
        else:
            lng = round(float(lng), 8)

        denuncia = Denuncia(
            tipo_animal=data.get('tipo_animal'),
            tipo_risco=data.get('tipo_risco'),
            descricao=data.get('descricao'),
            endereco=data.get('endereco'),
            latitude=lat,
            longitude=lng,
            email_contato=email_contato,
        )

        denuncia.save()

        if imagem:
            Evidencia.objects.create(denuncia=denuncia, imagem=imagem)

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
        return JsonResponse({'erro': e.messages}, status=400)

    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=500)


@csrf_exempt
def atualizar_status_denuncia(request):
    if request.method not in ['PUT', 'PATCH']:
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        protocolo = data.get('protocolo')
        novo_status = data.get('status')

        if not protocolo:
            return JsonResponse({'erro': 'Protocolo é obrigatório'}, status=400)

        if not novo_status:
            return JsonResponse({'erro': 'Status é obrigatório'}, status=400)

        denuncia = get_object_or_404(Denuncia, protocolo=protocolo)
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
        return JsonResponse({'erro': str(e)}, status=500)


@csrf_exempt
def acompanhar_denuncia(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        protocolo = data.get('protocolo')

        denuncia = Denuncia.objects.filter(protocolo=protocolo).first()

        if not denuncia:
            return JsonResponse({'erro': 'Protocolo não encontrado'}, status=404)

        evidencia = Evidencia.objects.filter(denuncia=denuncia).first()
        imagem_url = None

        if evidencia and evidencia.imagem:
            imagem_url = request.build_absolute_uri(evidencia.imagem.url)

        return JsonResponse({
            'protocolo': denuncia.protocolo,
            'tipo_animal': denuncia.tipo_animal,
            'tipo_risco': denuncia.tipo_risco,
            'descricao': denuncia.descricao,
            'status': denuncia.status,
            'endereco': denuncia.endereco,
            'latitude': denuncia.latitude,
            'longitude': denuncia.longitude,
            'imagem': imagem_url
        })

    except Exception as e:
        return JsonResponse({'erro': str(e)}, status=500)
