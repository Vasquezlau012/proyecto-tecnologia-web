import random
import string
import os
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email: str, otp: str):
    # Usamos la API de SendGrid (Puerto 443/HTTPS) para saltar bloqueos de Render
    api_key = os.getenv("SENDGRID_API_KEY")
    sender_email = os.getenv("SENDER_EMAIL", "vasquezlau012@gmail.com")

    if not api_key:
        print("Error: SENDGRID_API_KEY no configurada")
        return False

    url = "https://api.sendgrid.com/v3/mail/send"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "personalizations": [
            {
                "to": [{"email": email}],
                "subject": "Codigo de Verificacion OTP"
            }
        ],
        "from": {"email": sender_email},
        "content": [
            {
                "type": "text/plain",
                "value": f"Tu codigo de verificacion es: {otp}. Expira en 5 minutos."
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=15)
        if response.status_code in [200, 201, 202]:
            print(f"Correo enviado exitosamente via API a {email}")
            return True
        else:
            print(f"Error API SendGrid: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"Error de conexion con API SendGrid: {e}")
        return False
