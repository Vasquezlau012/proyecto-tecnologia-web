import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp: str):
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_user or not smtp_password:
        print("Error: Credenciales SMTP no configuradas")
        return False

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = email
    msg['Subject'] = "Tu codigo de verificacion OTP"

    body = f"Tu codigo de verificacion es: {otp}. Expira en 5 minutos."
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Añadimos un timeout de 10 segundos para que no se quede pegado
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False
