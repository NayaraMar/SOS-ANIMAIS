from django.conf import settings
import requests


def enviar_email_protocolo(email, protocolo):
    api_key = settings.RESEND_API_KEY

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "from": "onboarding@resend.dev",
        "to": [email],
        "subject": "Protocolo da sua denúncia",
        "html": f"""
        <h2>Denúncia registrada com sucesso</h2>
        <p>Seu protocolo é:</p>
        <h1>{protocolo}</h1>
        """
    }

    resposta = requests.post(
        "https://api.resend.com/emails",
        headers=headers,
        json=data
    )

    print("STATUS EMAIL:", resposta.status_code)
    print("RESPOSTA EMAIL:", resposta.text)
