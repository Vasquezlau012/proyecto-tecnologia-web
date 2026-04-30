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
    # Intentamos el puerto 587 que a veces tiene reglas de salida diferentes en Render
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = 587
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_user or not smtp_password:
        return False

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = "Codigo de Verificacion - Proyecto Web"

    body = f"Tu codigo de verificacion es: {otp}\n\nEste codigo expirara en 5 minutos."
    msg.attach(MIMEText(body, 'plain'))

    try:
        # El truco: Usar un timeout corto y forzar el inicio de TLS de forma explícita
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
        server.ehlo() 
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error en el truco de envio: {e}")
        return False
