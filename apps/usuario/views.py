from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'JSON inválido'},
            status=400
        )

    cpf = data.get('cpf')
    senha = data.get('senha')

    if not cpf or not senha:
        return JsonResponse(
            {'error': 'CPF e senha são obrigatórios'},
            status=400
        )

    # remove máscara (garante consistência)
    cpf = ''.join(filter(str.isdigit, cpf))

    user = authenticate(
        request,
        username=cpf,   # ✅ corrigido
        password=senha
    )

    if user is not None:
        login(request, user)

        return JsonResponse({
            'success': True,
            'message': 'Login realizado com sucesso',
            'usuario': {
                'nome': user.nome,
                'cpf': user.cpf
            }
        })

    return JsonResponse(
        {
            'success': False,
            'error': 'CPF ou senha incorretos'  
        },
        status=401
    )