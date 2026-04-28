import { Router } from "express";
import { getDatabase } from "../database/db";
import { students } from "../database/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET todos los estudiantes
router.get("/", async (req, res) => {
  try {
    const db = await getDatabase();
    const allStudents = await db.select().from(students);
    res.json(allStudents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET un estudiante por ID
router.get("/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(req.params.id)))
      .limit(1);

    if (!student.length) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    res.json(student[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear estudiante
router.post("/", async (req, res) => {
  try {
    const { nombre, email, edad, calificacion } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ error: "Nombre y email son requeridos" });
    }

    const db = await getDatabase();
    const result = await db.insert(students).values({
      nombre,
      email,
      edad: edad ? parseInt(edad) : null,
      calificacion: calificacion ? parseInt(calificacion) : null,
    });

    res.status(201).json({ id: result.insertId, nombre, email, edad, calificacion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar estudiante
router.put("/:id", async (req, res) => {
  try {
    const { nombre, email, edad, calificacion } = req.body;
    const db = await getDatabase();

    await db
      .update(students)
      .set({
        nombre: nombre || undefined,
        email: email || undefined,
        edad: edad ? parseInt(edad) : undefined,
        calificacion: calificacion ? parseInt(calificacion) : undefined,
      })
      .where(eq(students.id, parseInt(req.params.id)));

    res.json({ mensaje: "Estudiante actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar estudiante
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    await db.delete(students).where(eq(students.id, parseInt(req.params.id)));
    res.json({ mensaje: "Estudiante eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
