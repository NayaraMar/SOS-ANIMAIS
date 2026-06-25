# SOS Animais

Sistema full para registro e gerenciamento de denúncias de animais em situação de risco.

O projeto conta com backend em Django (API REST), frontend em React e banco de dados PostgreSQL, totalmente containerizado com Docker.

---

## Tecnologias

### Backend
- Python 3.11
- Django
- Django REST Framework
- PostgreSQL

### Frontend
- React
- Vite
- JavaScript

### Infraestrutura
- Docker

---

## Como executar o projeto

### 1. Clonar o repositório

``bash
git clone <URL_DO_REPOSITORIO>
cd sos-animais``

### 2. Subir o ambiente com Docker
``bash
docker-compose up --build``

## Em outro terminal:
### 4. Criar superusuário (admin)
``bash
docker-compose exec web python manage.py createsuperuser``

Preencha:

CPF 
Nome
Email
Senha

### 3. Acessar o sistema
``bash
Frontend: http://localhost:5173``