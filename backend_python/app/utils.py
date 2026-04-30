import random
import string
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp: str):
    # Usamos el puerto 465 para SSL que es más robusto en entornos de nube
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = 465 
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_user or not smtp_password:
        print("Error: Credenciales SMTP no configuradas en el entorno")
        return False

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = "Tu codigo de verificacion OTP"

    body = f"Tu codigo de verificacion es: {otp}. Expira en 5 minutos."
    msg.attach(MIMEText(body, 'plain'))

    context = ssl.create_default_context()

    try:
        # Usamos SMTP_SSL para una conexión directa y segura
        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context, timeout=15) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        print(f"Correo enviado exitosamente a {email}")
        return True
    except Exception as e:
        print(f"Error critico enviando correo: {e}")
        return False
