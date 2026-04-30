import random
import string
import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp: str):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    sender_email = os.getenv("SENDER_EMAIL", "laura.vasquez@ieee.org")

    if not smtp_user or not smtp_password:
        print("Error: Credenciales SMTP no configuradas")
        return False

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = email
    msg['Subject'] = "Codigo de Verificacion OTP"

    body = f"Tu codigo de verificacion es: {otp}\n\nEste codigo expirara en 5 minutos."
    msg.attach(MIMEText(body, 'plain'))

    context = ssl.create_default_context()

    try:
        # Usamos SMTP_SSL para plataformas que permiten salida por el puerto 465
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context, timeout=15) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        print(f"Correo enviado exitosamente a {email}")
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False
