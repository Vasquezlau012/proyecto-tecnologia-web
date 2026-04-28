import React, { useState, useEffect } from 'react';
import { sendOTP, verifyOTP } from '../services/api';
import { Lock, Loader2 } from 'lucide-react';

interface OTPPageProps {
  onNavigate: (page: string) => void;
  onAuthenticated: (token: string) => void;
}

export default function OTPPage({ onNavigate, onAuthenticated }: OTPPageProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setError('El código OTP ha expirado. Solicita uno nuevo.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendOTP(email);
      setSuccess('✅ OTP enviado a tu correo');
      setTimeout(() => {
        setStep('otp');
        setTimeLeft(300);
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);
      setSuccess('✅ OTP verificado correctamente');
      localStorage.setItem('authToken', result.data.token);
      onAuthenticated(result.data.token);
      setTimeout(() => {
        onNavigate('students');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al verificar el código');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {step === 'email' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold text-indigo-600 mb-2">
                Verificación OTP
              </h1>
              <p className="text-gray-600">
                Ingresa tu correo para recibir el código
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar código OTP'
                )}
              </button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-3xl font-bold text-indigo-600 mb-2">
                Código de Verificación
              </h1>
              <p className="text-gray-600">
                Se envió un código a <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresa el código de 6 dígitos
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  disabled={loading || timeLeft === 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className={`text-center font-semibold ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-600'}`}>
                Expira en: {formatTime(timeLeft)}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || timeLeft === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-indigo-600 hover:text-indigo-700 py-2 px-4 rounded-lg font-medium"
              >
                ← Cambiar correo
              </button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
