import { Router } from "express";
import { sendOTP, verifyOTP } from "../services/otpService";

const router = Router();

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    const result = await sendOTP(email);
    res.json(result);
  } catch (error: any) {
    console.error("Error en send-otp:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email y OTP son requeridos" });
    }

    const result = await verifyOTP(email, otp);
    res.json(result);
  } catch (error: any) {
    console.error("Error en verify-otp:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
