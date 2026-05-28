from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
import urllib.request
import urllib.parse

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
    recaptcha_token = data.get('recaptcha_token')

    if not cpf or not senha:
        return JsonResponse(
            {'error': 'CPF e senha são obrigatórios.    '},
            status=400
        )

    # valida recaptcha
    if not recaptcha_token:
         return JsonResponse({'error': 'O código de verificação reCAPTCHA é obrigatório.'}, status=400)

    try:
       
        secret_key = "6LdkYdssAAAAAC8GW0zTgoyuDNc01hYc-t_aXGt5"
        verify_data = urllib.parse.urlencode({
            'secret': secret_key,
            'response': recaptcha_token
        }).encode('utf-8')
        
        req = urllib.request.Request('https://www.google.com/recaptcha/api/siteverify', data=verify_data)
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode())
        print("RECAPTCHA RESULT:", result)
        
        if not result.get('success'):
            return JsonResponse({'error': f"Validação contra robôs falhou. Motivo: {result.get('error-codes', ['desconhecido'])}"}, status=400)
            
    except Exception as e:
        return JsonResponse({'error': 'Erro ao validar recaptcha.'}, status=500)

    cpf = ''.join(filter(str.isdigit, cpf))

    user = authenticate(
        request,
        username=cpf,   
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