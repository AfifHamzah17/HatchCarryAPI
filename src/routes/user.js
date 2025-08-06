import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService.js';

const router = express.Router();

// Semua route di sini wajib login + role=admin
router.use(authenticate, authorize(['admin']));

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

export default router;