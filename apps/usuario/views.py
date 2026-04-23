from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data.get('email')
        senha = data.get('senha')

        user = authenticate(request, username=email, password=senha)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login realizado com sucesso'})
        else:
            return JsonResponse({'error': 'Credenciais inválidas'}, status=400)

    return JsonResponse({'error': 'Método não permitido'}, status=405)

def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout realizado com sucesso'})

def me_view(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'email': request.user.email,
            'nome': request.user.nome
        })
    else:
        return JsonResponse({'error': 'Não autenticado'}, status=401)
    
from django.contrib.auth.decorators import login_required

@login_required
def rota_protegida(request):
    return JsonResponse({'message': 'Você está autenticado'})