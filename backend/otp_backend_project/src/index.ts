import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/db";
import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend OTP Auth funcionando" });
});

// Inicializar servidor
async function start() {
  try {
    await initializeDatabase();
    console.log("✅ Base de datos conectada");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📧 SMTP configurado: ${process.env.GMAIL_USER}`);
    });
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
    process.exit(1);
  }
}

start();
