from django.db import models
import uuid
from django.core.exceptions import ValidationError


class Orgao(models.Model):
    nome = models.CharField(max_length=100)


class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)
    orgao = models.ForeignKey(Orgao, on_delete=models.CASCADE)


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
        ('anfibio', 'Anfíbio (ex: sapo, cobra)'),
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

    #se o administrador for deletado, a denúncia continua salva
    administrador = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    
    #campo para "eternizar" o nome de quem atendeu
    nome_admin_registro = models.CharField(max_length=100, blank=True)

    protocolo = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    tipo_animal = models.CharField(max_length=20, choices=TIPO_ANIMAL_CHOICES)
    tipo_risco = models.CharField(max_length=20, choices=TIPO_RISCO_CHOICES)
    descricao = models.TextField()
    
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    
    def clean(self):
        if (self.latitude is None or self.longitude is None) and not self.endereco:
            raise ValidationError('Informe a localização (coordenadas ou endereço).')

    def save(self, *args, **kwargs):
        self.full_clean()  # chama validações
        super().save(*args, **kwargs)

    data_hora = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberto')


class Evidencia(models.Model):
    denuncia = models.ForeignKey(Denuncia, on_delete=models.CASCADE, related_name='evidencias')
    url_imagem = models.URLField()