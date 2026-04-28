# Frontend OTP Auth System

Interfaz React para autenticación con OTP y gestión de estudiantes.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
# o con pnpm
pnpm install
```

## 🔧 Configuración

1. Copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Configura la URL del backend:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

## 📁 Estructura

```
src/
├── pages/
│   ├── Home.tsx          # Página de inicio
│   ├── OTPPage.tsx       # Autenticación OTP
│   └── StudentsPage.tsx  # Gestión de estudiantes
├── services/
│   └── api.ts            # Cliente Axios
├── App.tsx               # Componente principal
├── main.tsx              # Punto de entrada
└── index.css             # Estilos Tailwind
```

## 🎨 Características

- ✅ Interfaz moderna con Tailwind CSS
- ✅ Autenticación OTP por correo
- ✅ CRUD de estudiantes
- ✅ Responsive design
- ✅ Manejo de errores

## 📝 Licencia

MIT
