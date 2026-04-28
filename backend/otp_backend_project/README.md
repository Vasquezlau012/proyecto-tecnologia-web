# Backend OTP Auth System

API REST para autenticación con OTP y gestión de estudiantes.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
# o con pnpm
pnpm install
```

## 🔧 Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno:
```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/otp_db
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 📦 Crear base de datos

```bash
# Generar migraciones
npm run db:push
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📡 Endpoints

### Autenticación OTP

**POST** `/api/auth/send-otp`
```json
{
  "email": "usuario@ejemplo.com"
}
```

**POST** `/api/auth/verify-otp`
```json
{
  "email": "usuario@ejemplo.com",
  "otp": "123456"
}
```

### Estudiantes

**GET** `/api/students` - Obtener todos
**GET** `/api/students/:id` - Obtener uno
**POST** `/api/students` - Crear
**PUT** `/api/students/:id` - Actualizar
**DELETE** `/api/students/:id` - Eliminar

## 📁 Estructura

```
src/
├── database/
│   ├── db.ts         # Conexión a BD
│   └── schema.ts     # Esquema Drizzle
├── routes/
│   ├── auth.ts       # Rutas OTP
│   └── students.ts   # Rutas CRUD
├── services/
│   ├── emailService.ts   # SMTP
│   └── otpService.ts     # Lógica OTP
└── index.ts          # Servidor Express
```

## 🔐 Seguridad

- OTP expira en 5 minutos
- Códigos de 6 dígitos
- SMTP seguro con Gmail
- CORS configurado

## 📝 Licencia

MIT
