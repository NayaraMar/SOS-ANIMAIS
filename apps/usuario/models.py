from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Orgao(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class UsuarioManager(BaseUserManager):

    def create_user(self, cpf, nome, email, password=None):
        if not cpf:
            raise ValueError("O usuário deve ter CPF")

        if not nome:
            raise ValueError("O usuário deve ter nome")

        if not email:
            raise ValueError("O usuário deve ter email")

        cpf = ''.join(filter(str.isdigit, cpf))

        user = self.model(
            cpf=cpf,
            nome=nome,
            email=self.normalize_email(email)
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, cpf, nome, email, password):
        user = self.create_user(
            cpf=cpf,
            nome=nome,
            email=email,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save(using=self._db)

        return user


class Usuario(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=100)

    cpf = models.CharField(
        max_length=11,
        unique=True
    )

    email = models.EmailField(
        unique=True,
        null=True,
        blank=True
    )

    orgao = models.ForeignKey(
        Orgao,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    codigo_recuperacao = models.CharField(
        max_length=6,
        null=True,
        blank=True
    )

    codigo_expira_em = models.DateTimeField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['nome', 'email']

    def save(self, *args, **kwargs):
        self.cpf = ''.join(filter(str.isdigit, self.cpf))
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.nome} ({self.cpf})'