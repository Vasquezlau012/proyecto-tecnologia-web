import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Código de Verificación OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Código de Verificación</h2>
          <p>Hola,</p>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px;">
            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>Este código expira en 5 minutos.</p>
          <p>Si no solicitaste este código, ignora este mensaje.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© 2026 OTP Auth System. Todos los derechos reservados.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL OK] OTP enviado a ${email}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Error enviando OTP a ${email}:`, error);
    throw new Error("Error al enviar el correo");
  }
}
