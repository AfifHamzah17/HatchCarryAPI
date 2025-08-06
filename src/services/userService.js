// src/services/userService.js
import bcrypt from 'bcrypt';
import { getFirestore } from '../utils/firestore.js';

const usersCol = () => getFirestore().collection('users');

// List all users
export async function listUsers(req, res, next) {
  try {
    const snapshot = await usersCol().get();
    const users = [];
    snapshot.forEach(doc => {
      const { username, role, avatarUrl } = doc.data();
      users.push({ email: doc.id, username, role, avatarUrl: avatarUrl || null });
    });
    res.json({ error: false, data: users });
  } catch (err) {
    next(err);
  }
}

// Create new user
export async function createUser(req, res, next) {
  try {
    const { email, username, password, role = 'user' } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: true, message: 'Email, username, password wajib diisi' });
    }
    const doc = await usersCol().doc(email).get();
    if (doc.exists) {
      return res.status(409).json({ error: true, message: 'Email sudah terdaftar' });
    }
    const hash = await bcrypt.hash(password, 10);
    await usersCol().doc(email).set({ username, passwordHash: hash, role });
    res.status(201).json({ error: false, message: 'User dibuat' });
  } catch (err) {
    next(err);
  }
}

// Update existing user
export async function updateUser(req, res, next) {
  try {
    const { email } = req.params;
    const { username, password, role } = req.body;
    const docRef = usersCol().doc(email);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: true, message: 'User tidak ditemukan' });
    }
    const updates = {};
    if (username) updates.username = username;
    if (role) updates.role = role;
    if (password) {
      updates.passwordHash = await bcrypt.hash(password, 10);
    }
    await docRef.update(updates);
    res.json({ error: false, message: 'User diperbarui' });
  } catch (err) {
    next(err);
  }
}

// Delete user
export async function deleteUser(req, res, next) {
  try {
    const { email } = req.params;
    const docRef = usersCol().doc(email);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: true, message: 'User tidak ditemukan' });
    }
    await docRef.delete();
    res.json({ error: false, message: 'User dihapus' });
  } catch (err) {
    next(err);
  }
}