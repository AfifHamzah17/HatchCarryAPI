import express from 'express';
import { register, login } from '../services/authService.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', async (req, res) => {
  try {
    const message = await register(req.body);
    res.status(201).json({ error: false, message });
  } catch (err) {
    res.status(err.status || 500).json({ error: true, message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const token = await login(req.body);
    res.status(200).json({ error: false, message: 'Login berhasil', data: { token } });
  } catch (err) {
    res.status(err.status || 500).json({ error: true, message: err.message });
  }
});

// Example protected route
router.get('/profile', authenticate, (req, res) => {
  res.json({ error: false, message: 'Access granted', data: req.user });
});

// Admin-only route
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ error: false, message: 'Admin access granted' });
});

export default router;

// Next development steps: Firestore Collections:
// - users: { documentId: email, username, passwordHash, role }
// (Extend with other collections like kebun, hatch_carry, etc. sesuai kebutuhan)