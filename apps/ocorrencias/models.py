from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils import timezone
import random


class Denuncia(models.Model):

    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em andamento'),
        ('resolvido', 'Resolvido'),
    ]

    TIPO_ANIMAL_CHOICES = [
        ('cachorro', 'Cachorro'),
        ('gato', 'Gato'),
        ('ave', 'Ave'),
        ('coelho', 'Coelho'),
        ('cavalo', 'Cavalo'),
        ('bovino', 'Bovino'),
        ('suino', 'Suíno'),
        ('caprino', 'Caprino'),
        ('reptil', 'Réptil'),
        ('anfibio', 'Anfíbio'),
        ('silvestre', 'Silvestre'),
        ('marinho', 'Marinho'),
    ]

    TIPO_RISCO_CHOICES = [
        ('maus_tratos', 'Maus-tratos'),
        ('abandono', 'Abandono'),
        ('ferido', 'Ferido'),
        ('doente', 'Doente'),
        ('desnutrido', 'Desnutrido'),
        ('em_perigo', 'Em perigo'),
        ('atropelado', 'Atropelado'),
        ('preso', 'Preso'),
        ('envenenamento', 'Envenenamento'),
        ('exploracao', 'Exploração'),
        ('violencia', 'Violência'),
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

    protocolo = models.CharField(
        max_length=50,
        unique=True,
        editable=False
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

    latitude = models.FloatField(
        null=True,
        blank=True
    )

    longitude = models.FloatField(
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
        null=True
    )

    data_hora = models.DateTimeField(auto_now_add=True)

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
                'Informe localização ou endereço.'
            )

    def gerar_protocolo(self):
        animal_map = {
            'cachorro': 'CA',
            'gato': 'GA',
            'ave': 'AV',
            'coelho': 'CO',
            'cavalo': 'CV',
            'bovino': 'BO',
            'suino': 'SU',
            'caprino': 'CP',
            'reptil': 'RE',
            'anfibio': 'AN',
            'silvestre': 'SI',
            'marinho': 'MA',
        }

        risco_map = {
            'maus_tratos': 'MT',
            'abandono': 'AB',
            'ferido': 'FE',
            'doente': 'DO',
            'desnutrido': 'DE',
            'em_perigo': 'EP',
            'atropelado': 'AT',
            'preso': 'PR',
            'envenenamento': 'EN',
            'exploracao': 'EX',
            'violencia': 'VI',
        }

        data = timezone.now().strftime('%Y%m%d%H%M%S')
        aleatorio = random.randint(1000, 9999)

        animal = animal_map.get(self.tipo_animal, 'XX')
        risco = risco_map.get(self.tipo_risco, 'XX')

        return f'{animal}-{risco}-{data}-{aleatorio}'

    def gerar_protocolo_unico(self):
        while True:
            novo = self.gerar_protocolo()

            existe = Denuncia.objects.filter(
                protocolo=novo
            ).exists()

            if not existe:
                return novo

    def save(self, *args, **kwargs):

        if not self.protocolo:
            self.protocolo = self.gerar_protocolo_unico()

        if self.administrador and not self.nome_admin_registro:
            self.nome_admin_registro = self.administrador.nome

        if self.latitude is not None:
            self.latitude = round(float(self.latitude), 8)

        if self.longitude is not None:
            self.longitude = round(float(self.longitude), 8)

        try:
            self.full_clean()
            print("FULL CLEAN PASSOU")
        except ValidationError as e:
            print("ERRO NO FULL_CLEAN:", e.message_dict)
            raise

        super().save(*args, **kwargs)

    def __str__(self):
        return self.protocolo


class Evidencia(models.Model):
    denuncia = models.ForeignKey(
        Denuncia,
        on_delete=models.CASCADE,
        related_name='evidencias'
    )

    imagem = models.ImageField(
        upload_to='evidencias/',
        null=True,
        blank=True
    )

    def __str__(self):
        return f'Evidência {self.id} - {self.denuncia.protocolo}'
