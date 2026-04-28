import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/api';
import { Trash2, Edit2, Plus, Loader2 } from 'lucide-react';

interface Student {
  id: number;
  nombre: string;
  email: string;
  edad?: number;
  calificacion?: number;
}

interface StudentsPageProps {
  onNavigate: (page: string) => void;
}

export default function StudentsPage({ onNavigate }: StudentsPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    calificacion: '',
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStudent(editingId, formData);
      } else {
        await createStudent(formData);
      }
      setFormData({ nombre: '', email: '', edad: '', calificacion: '' });
      setEditingId(null);
      setShowForm(false);
      loadStudents();
    } catch (error) {
      console.error('Error guardando estudiante:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      nombre: student.nombre,
      email: student.email,
      edad: student.edad?.toString() || '',
      calificacion: student.calificacion?.toString() || '',
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Error eliminando estudiante:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Estudiantes Registrados</h2>
          <button
            onClick={() => {
              setFormData({ nombre: '', email: '', edad: '', calificacion: '' });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
          >
            <Plus className="h-4 w-4" />
            Agregar Estudiante
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Edad"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Calificación"
                  value={formData.calificacion}
                  onChange={(e) => setFormData({ ...formData, calificacion: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Edad</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Calificación</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{student.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.edad || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.calificacion || '-'}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay estudiantes registrados
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
