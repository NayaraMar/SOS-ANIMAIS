from django.db import models
import uuid
from django.core.exceptions import ValidationError
from django.conf import settings


class Denuncia(models.Model):
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em andamento'),
        ('resolvido', 'Resolvido'),
    ]

    TIPO_ANIMAL_CHOICES = [
        ('cachorro', 'Cachorro (ex: vira-lata, poodle)'),
        ('gato', 'Gato (ex: doméstico)'),
        ('ave', 'Ave (ex: papagaio, galinha)'),
        ('coelho', 'Coelho'),
        ('cavalo', 'Cavalo'),
        ('bovino', 'Bovino (ex: boi, vaca)'),
        ('suino', 'Suíno (ex: porco)'),
        ('caprino', 'Caprino (ex: cabra, bode)'),
        ('reptil', 'Réptil (ex: cobra, lagarto)'),
        ('anfibio', 'Anfíbio (ex: sapo)'),
        ('silvestre', 'Animal silvestre (ex: macaco, raposa)'),
        ('marinho', 'Animal marinho (ex: peixe, tartaruga)'),
    ]

    TIPO_RISCO_CHOICES = [
        ('maus_tratos', 'Maus-tratos'),
        ('abandono', 'Abandono'),
        ('ferido', 'Animal ferido'),
        ('doente', 'Doente'),
        ('desnutrido', 'Desnutrido'),
        ('em_perigo', 'Em perigo'),
        ('atropelado', 'Atropelado'),
        ('preso', 'Preso/Aprisionado'),
        ('envenenamento', 'Suspeita de envenenamento'),
        ('exploracao', 'Exploração ilegal'),
        ('violencia', 'Violência física'),
    ]

    administrador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    nome_admin_registro = models.CharField(
        max_length=100,
        blank=True
    )

    protocolo = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    tipo_animal = models.CharField(
        max_length=20,
        choices=TIPO_ANIMAL_CHOICES
    )

    tipo_risco = models.CharField(
        max_length=20,
        choices=TIPO_RISCO_CHOICES
    )

    descricao = models.TextField()

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    endereco = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    email_contato = models.EmailField(
        blank=True,
        null=True,
        help_text='Email do denunciante para receber o protocolo'
    )

    telefone_contato = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text='Telefone/Celular do denunciante para receber o protocolo'
    )

    data_hora = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='aberto'
    )

    def clean(self):
        coordenadas_ok = (
            self.latitude is not None and
            self.longitude is not None
        )

        endereco_ok = bool(self.endereco)

        if not coordenadas_ok and not endereco_ok:
            raise ValidationError(
                'Informe localização por coordenadas ou endereço.'
            )

    def save(self, *args, **kwargs):
        if self.administrador and not self.nome_admin_registro:
            self.nome_admin_registro = self.administrador.nome

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.protocolo} - {self.tipo_animal}"


class Evidencia(models.Model):
    denuncia = models.ForeignKey(
        Denuncia,
        on_delete=models.CASCADE,
        related_name='evidencias'
    )

    url_imagem = models.URLField()

    def __str__(self):
        return f"Evidência {self.id} - {self.denuncia.protocolo}"