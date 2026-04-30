from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

from . import models, schemas, utils
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Proyecto Tecnología Web API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Tecnología Web con FastAPI"}

@app.post("/auth/request-otp")
def request_otp(request: schemas.OTPRequest, db: Session = Depends(get_db)):
    otp_code = utils.generate_otp()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    db_otp = models.OTP(email=request.email, code=otp_code, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    
    # ENVÍO DE CORREO REAL ACTIVADO
    email_sent = utils.send_otp_email(request.email, otp_code)
    
    if not email_sent:
        return {"message": "OTP generado pero hubo un error al enviar el correo. Revisa tu configuración SMTP.", "code": otp_code}
    
    return {"message": "OTP enviado correctamente a su correo", "code": otp_code}

@app.post("/auth/verify-otp")
def verify_otp(request: schemas.OTPVerify, db: Session = Depends(get_db)):
    db_otp = db.query(models.OTP).filter(
        models.OTP.email == request.email, 
        models.OTP.code == request.code
    ).order_by(models.OTP.created_at.desc()).first()
    if not db_otp or db_otp.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=400, detail="Código inválido o expirado")
    return {"message": "Verificación exitosa", "token": "fake-jwt-token"}

@app.get("/students", response_model=list[schemas.Student])
def get_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()

@app.post("/students", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
