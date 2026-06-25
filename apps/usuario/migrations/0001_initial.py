from django.db import migrations


def criar_usuario(apps, schema_editor):
    Usuario = apps.get_model('usuario', 'Usuario')

    if not Usuario.objects.filter(email="admin@gmail.com").exists():
        user = Usuario(
            email="admin@gmail.com",
            nome="Administrador"
        )
        user.set_password("Admin123")
        user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('usuario', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(criar_usuario),
    ]
