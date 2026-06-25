#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def criar_superusuario():
    try:
        import django
        django.setup()

        from apps.usuario.models import Usuario

        cpf_admin = "06007091678"

        if not Usuario.objects.filter(cpf=cpf_admin).exists():
            Usuario.objects.create_superuser(
                cpf=cpf_admin,
                nome="Administrador",
                email="admin@admin.com",
                password="admin123"
            )
            print("Superusuário criado com sucesso!")
        else:
            print("Superusuário já existe.")

    except Exception as e:
        print(f"Erro ao criar superusuário: {e}")


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # roda migrations normalmente
    execute_from_command_line(sys.argv)

    # se executou migrate, tenta criar admin
    if len(sys.argv) > 1 and sys.argv[1] == "migrate":
        criar_superusuario()


if __name__ == "__main__":
    main()