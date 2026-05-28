from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def enviar_email_protocolo(email_destino, protocolo):

    assunto = 'Denúncia registrada - SOS Animais'

    texto = f'''
Sua denúncia foi registrada com sucesso.

Protocolo: {protocolo}
'''

    html = f"""
    <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
    ">

        <div style="
            max-width: 600px;
            margin: auto;
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">

            <h1 style="
                color: #2e7d32;
                text-align: center;
            ">
                🐾 SOS Animais
            </h1>

            <p style="font-size: 16px;">
                Olá!
            </p>

            <p style="font-size: 16px;">
                Sua denúncia foi registrada com sucesso em nosso sistema.
            </p>

            <div style="
                background-color: #eeeeee;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 25px 0;
            ">

                <p style="
                    margin: 0;
                    font-size: 14px;
                    color: #555;
                ">
                    PROTOCOLO
                </p>

                <h2 style="
                    margin-top: 10px;
                    color: #d32f2f;
                ">
                    {protocolo}
                </h2>

            </div>

            <p style="font-size: 15px;">
                Guarde esse número para acompanhar o andamento da denúncia.
            </p>

            <p style="font-size: 15px;">
                Obrigado por ajudar na proteção e cuidado dos animais ❤️
            </p>

            <hr style="margin: 30px 0;">

            <p style="
                font-size: 13px;
                color: gray;
                text-align: center;
            ">
                Equipe SOS Animais
            </p>

        </div>

    </div>
    """

    email = EmailMultiAlternatives(
        assunto,
        texto,
        settings.DEFAULT_FROM_EMAIL,
        [email_destino]
    )

    email.attach_alternative(html, "text/html")

    email.send()