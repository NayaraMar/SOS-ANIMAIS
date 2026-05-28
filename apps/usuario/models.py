from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Orgao(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class UsuarioManager(BaseUserManager):

    def create_user(self, cpf, nome, password=None):
        if not cpf:
            raise ValueError("O usuário deve ter CPF")

        user = self.model(
            cpf=cpf,
            nome=nome
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cpf, nome, password):
        user = self.create_user(cpf, nome, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Usuario(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=100)

    cpf = models.CharField(max_length=11, unique=True)

    orgao = models.ForeignKey(
        Orgao,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()  

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['nome']

    def __str__(self):
        return self.nome