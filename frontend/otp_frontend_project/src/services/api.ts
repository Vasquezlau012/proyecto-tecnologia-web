import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://proyecto-tecnologia-web.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// OTP
export const sendOTP = (email: string) =>
  api.post('/auth/request-otp', { email });

export const verifyOTP = (email: string, code: string) =>
  api.post('/auth/verify-otp', { email, code });

// Estudiantes
export const getStudents = () =>
  api.get('/students');

export const getStudent = (id: number) =>
  api.get(`/students/${id}`);

export const createStudent = (data: any) =>
  api.post('/students', data);

export const updateStudent = (id: number, data: any) =>
  api.put(`/students/${id}`, data);

export const deleteStudent = (id: number) =>
  api.delete(`/students/${id}`);

export default api;
