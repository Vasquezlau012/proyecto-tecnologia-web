import { getDatabase } from "../database/db";
import { otp_codes } from "../database/schema";
import { eq } from "drizzle-orm";
import { sendOTPEmail } from "./emailService";

export async function generateOTP(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email: string) {
  const db = await getDatabase();
  const otp = await generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

  // Guardar OTP en la base de datos
  await db.insert(otp_codes).values({
    email,
    codigo: otp,
    expira_en: expiresAt,
  });

  // Enviar correo
  await sendOTPEmail(email, otp);

  return {
    mensaje: "OTP enviado a tu correo",
    email,
  };
}

export async function verifyOTP(email: string, codigo: string) {
  const db = await getDatabase();

  // Buscar el OTP más reciente
  const result = await db
    .select()
    .from(otp_codes)
    .where(eq(otp_codes.email, email))
    .orderBy((t) => t.creado_en)
    .limit(1);

  const otpRecord = result[0];

  if (!otpRecord) {
    throw new Error("No se encontró código OTP para este correo");
  }

  // Verificar si ha expirado
  if (new Date() > otpRecord.expira_en) {
    throw new Error("El código OTP ha expirado");
  }

  // Verificar el código
  if (otpRecord.codigo !== codigo) {
    throw new Error("Código OTP incorrecto");
  }

  // Marcar como usado
  await db
    .update(otp_codes)
    .set({ usado: 1 })
    .where(eq(otp_codes.id, otpRecord.id));

  return {
    mensaje: "OTP verificado correctamente",
    email,
    token: `token_${email}_${Date.now()}`,
  };
}
