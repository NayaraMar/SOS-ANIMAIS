import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.usuario.models import Usuario

cpf = "06007091678" 
nome = "Administrador"
email = "admin@admin.com"
senha = "admin123"

if not Usuario.objects.filter(cpf=cpf).exists():
    Usuario.objects.create_superuser(
        cpf=cpf,
        nome=nome,
        email=email,
        password=senha
    )
    print("Superusuário criado com sucesso.")
else:
    print("Superusuário já existe.")