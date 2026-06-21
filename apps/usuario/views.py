from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
import json
import random
from datetime import timedelta
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

from .models import Usuario

import json
import urllib.request
import urllib.parse


def obter_usuario_jwt(request):

    try:
        auth = JWTAuthentication()

        resultado = auth.authenticate(request)

        if resultado is None:
            return None

        usuario, token = resultado

        return usuario

    except Exception:
        return None


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
            {'error': 'CPF e senha são obrigatórios'},
            status=400
        )

    if not recaptcha_token:
        return JsonResponse(
            {'error': 'O reCAPTCHA é obrigatório'},
            status=400
        )

    try:

        secret_key = "6LdkYdssAAAAAC8GW0zTgoyuDNc01hYc-t_aXGt5"

        verify_data = urllib.parse.urlencode({
            'secret': secret_key,
            'response': recaptcha_token
        }).encode('utf-8')

        req = urllib.request.Request(
            'https://www.google.com/recaptcha/api/siteverify',
            data=verify_data
        )

        response = urllib.request.urlopen(req)

        result = json.loads(
            response.read().decode()
        )

        if not result.get('success'):
            return JsonResponse(
                {
                    'error': 'Validação do reCAPTCHA falhou'
                },
                status=400
            )

    except Exception:
        return JsonResponse(
            {
                'error': 'Erro ao validar reCAPTCHA'
            },
            status=500
        )

    cpf = ''.join(filter(str.isdigit, cpf))

    user = authenticate(
        username=cpf,
        password=senha
    )

    if user is None:
        return JsonResponse(
            {
                'success': False,
                'error': 'CPF ou senha incorretos'
            },
            status=401
        )

    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        'success': True,
        'message': 'Login realizado com sucesso',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'usuario': {
            'id': user.id,
            'nome': user.nome,
            'cpf': user.cpf,
            'is_superuser': user.is_superuser
        }
    })


@csrf_exempt
def logout_view(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    return JsonResponse({
        'success': True,
        'message': 'Logout realizado com sucesso'
    })


@csrf_exempt
def listar_usuarios(request):

    if request.method != 'GET':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    usuario_logado = obter_usuario_jwt(request)

    if not usuario_logado:
        return JsonResponse(
            {'error': 'Usuário não autenticado'},
            status=401
        )

    if not usuario_logado.is_superuser:
        return JsonResponse(
            {'error': 'Acesso negado'},
            status=403
        )

    usuarios = Usuario.objects.all()

    dados = []

    for usuario in usuarios:
        dados.append({
            'id': usuario.id,
            'nome': usuario.nome,
            'cpf': usuario.cpf,
            'is_superuser': usuario.is_superuser,
            'is_staff': usuario.is_staff
        })

    return JsonResponse(
        dados,
        safe=False
    )


@csrf_exempt
def criar_usuario(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    usuario_logado = obter_usuario_jwt(request)

    if not usuario_logado:
        return JsonResponse(
            {'error': 'Usuário não autenticado'},
            status=401
        )

    if not usuario_logado.is_superuser:
        return JsonResponse(
            {'error': 'Apenas superusuários podem criar usuários'},
            status=403
        )

    try:
        data = json.loads(request.body)

        cpf = ''.join(filter(str.isdigit, data.get('cpf', '')))
        nome = data.get('nome')
        email = data.get('email')
        senha = data.get('senha')
        is_superuser = data.get('is_superuser', False)

        if not cpf or not nome or not senha or not email:
            return JsonResponse(
                {'error': 'Nome, CPF, email e senha são obrigatórios'},
                status=400
            )

        if len(cpf) != 11:
            return JsonResponse(
                {'error': 'CPF inválido'},
                status=400
            )

        if len(senha) < 6:
            return JsonResponse(
                {'error': 'A senha deve possuir pelo menos 6 caracteres'},
                status=400
            )

        if Usuario.objects.filter(cpf=cpf).exists():
            return JsonResponse(
                {'error': 'Já existe um usuário com este CPF'},
                status=400
            )

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse(
                {'error': 'Já existe um usuário com este email'},
                status=400
            )

        usuario = Usuario.objects.create_user(
            cpf=cpf,
            nome=nome,
            email=email,
            password=senha
        )

        if is_superuser:
            usuario.is_superuser = True
            usuario.is_staff = True
            usuario.save()

        return JsonResponse(
            {
                'success': True,
                'message': 'Usuário criado com sucesso',
                'usuario': {
                    'id': usuario.id,
                    'nome': usuario.nome,
                    'cpf': usuario.cpf,
                    'email': usuario.email,
                    'is_superuser': usuario.is_superuser
                }
            },
            status=201
        )

    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )


@csrf_exempt
def excluir_usuario(request, id):
    if request.method != 'DELETE':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    usuario_logado = obter_usuario_jwt(request)

    if not usuario_logado:
        return JsonResponse(
            {'error': 'Usuário não autenticado'},
            status=401
        )

    if not usuario_logado.is_superuser:
        return JsonResponse(
            {'error': 'Apenas superusuários podem excluir usuários'},
            status=403
        )

    try:
        usuario = Usuario.objects.filter(id=id).first()

        if not usuario:
            return JsonResponse(
                {'error': 'Usuário não encontrado'},
                status=404
            )

        if usuario.id == usuario_logado.id:
            return JsonResponse(
                {'error': 'Você não pode excluir sua própria conta'},
                status=400
            )

        usuario.delete()

        return JsonResponse({
            'success': True,
            'message': 'Usuário excluído com sucesso'
        })

    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )
    
@csrf_exempt
def recuperar_senha(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    try:
        data = json.loads(request.body)

        cpf = ''.join(
            filter(
                str.isdigit,
                data.get('cpf', '')
            )
        )

        email = data.get('email')

        if not cpf or not email:
            return JsonResponse(
                {
                    'error': 'CPF e e-mail são obrigatórios'
                },
                status=400
            )

        try:
            usuario = Usuario.objects.get(
                cpf=cpf,
                email=email
            )
        except Usuario.DoesNotExist:
            return JsonResponse(
                {
                    'error': 'Usuário não encontrado'
                },
                status=404
            )

        codigo = str(
            random.randint(100000, 999999)
        )

        usuario.codigo_recuperacao = codigo
        usuario.codigo_expira_em = (
            timezone.now() + timedelta(minutes=10)
        )
        usuario.save()

        send_mail(
            subject='Recuperação de senha',
            message=(
                f'Olá {usuario.nome},\n\n'
                f'Seu código de recuperação é: {codigo}\n'
                f'Este código expira em 10 minutos.'
            ),
            from_email='seuemail@gmail.com',
            recipient_list=[usuario.email],
            fail_silently=False
        )

        return JsonResponse({
            'success': True,
            'message': 'Código enviado com sucesso'
        })

    except Exception as e:
        return JsonResponse(
            {
                'error': str(e)
            },
            status=500
        )
    
@csrf_exempt
def redefinir_senha(request):

    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Método não permitido'},
            status=405
        )

    try:
        data = json.loads(request.body)

        cpf = ''.join(
            filter(str.isdigit, data.get('cpf', ''))
        )

        email = data.get('email')
        codigo = data.get('codigo')
        nova_senha = data.get('nova_senha')

        try:
            usuario = Usuario.objects.get(
                cpf=cpf,
                email=email
            )
        except Usuario.DoesNotExist:
            return JsonResponse(
                {'error': 'Usuário não encontrado'},
                status=404
            )

        if usuario.codigo_recuperacao != codigo:
            return JsonResponse(
                {'error': 'Código inválido'},
                status=400
            )

        if timezone.now() > usuario.codigo_expira_em:
            return JsonResponse(
                {'error': 'Código expirado'},
                status=400
            )

        usuario.set_password(nova_senha)
        usuario.codigo_recuperacao = None
        usuario.codigo_expira_em = None
        usuario.save()

        return JsonResponse({
            'success': True,
            'message': 'Senha alterada com sucesso'
        })

    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )