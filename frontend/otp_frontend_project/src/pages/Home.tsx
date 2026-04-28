import React from 'react';
import { Lock, Users } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Lock className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">OTP Auth System</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Autenticación OTP
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Gestiona tu autenticación y accede al sistema de estudiantes de forma segura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Autenticación OTP</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Verifica tu identidad con un código de acceso único enviado a tu correo electrónico.
            </p>
            <button
              onClick={() => onNavigate('otp')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
            >
              Ir a Verificación OTP
            </button>
          </div>

          <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Administra el registro completo de estudiantes de forma sencilla y segura.
            </p>
            <button
              onClick={() => onNavigate('students')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
            >
              Ir a Estudiantes
            </button>
          </div>
        </div>

        <div className="p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Instrucciones</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <span>Haz clic en "Ir a Verificación OTP" para iniciar el proceso</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>Ingresa tu correo electrónico y recibirás un código</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <span>Verifica el código en la siguiente pantalla</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <span>Una vez autenticado, accede a la gestión de estudiantes</span>
            </li>
          </ol>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2026 OTP Auth System. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
