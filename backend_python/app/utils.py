import random
import string
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp: str):
    # Usamos el puerto 2525 que es el estándar para saltar bloqueos en nubes como Render
    smtp_server = os.getenv("SMTP_SERVER", "smtp.sendgrid.net")
    smtp_port = 2525
    smtp_user = os.getenv("SMTP_USER", "apikey")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_password:
        print("Error: API Key no configurada")
        return False

    msg = MIMEMultipart()
    msg['From'] = os.getenv("SENDER_EMAIL", "laura.vasquez@ieee.org")
    msg['To'] = email
    msg['Subject'] = "Codigo de Verificacion OTP"

    body = f"Tu codigo de verificacion es: {otp}\n\nEste codigo expirara en 5 minutos."
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Conexión optimizada para entornos con restricciones de red
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=20)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print(f"Correo enviado exitosamente a {email}")
        return True
    except Exception as e:
        print(f"Error en el envio SMTP: {e}")
        return False
