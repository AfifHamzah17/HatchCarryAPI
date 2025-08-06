import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getFirestore } from '../utils/firestore.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

// Lazy firestore instance inside functions
function usersCollection() {
  return getFirestore().collection('users');
}
export async function register({ email, username, password, role = 'user' }) {
  if (!email || !username || !password) {
    const err = new Error('Email, username, dan password wajib diisi'); err.status = 400; throw err;
  }
  if (!validateEmail(email)) {
    const err = new Error('Format email tidak valid'); err.status = 400; throw err;
  }
  if (!validatePassword(password)) {
    const err = new Error('Password minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol'); err.status = 400; throw err;
  }
  const doc = await usersCollection().doc(email).get();
  if (doc.exists) {
    const err = new Error('Email sudah terdaftar'); err.status = 409; throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  await usersCollection().doc(email).set({ username, passwordHash: hash, role });
  return 'Registrasi berhasil';
}
export async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email dan password wajib diisi'); err.status = 400; throw err;
  }
  if (!validateEmail(email)) {
    const err = new Error('Format email tidak valid'); err.status = 400; throw err;
  }
  const doc = await usersCollection().doc(email).get();
  if (!doc.exists) {
    const err = new Error('Email atau password salah'); err.status = 401; throw err;
  }
  const user = doc.data();
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const err = new Error('Email atau password salah'); err.status = 401; throw err;
  }
  const token = jwt.sign({ email, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}