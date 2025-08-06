// src/routes/profile.js
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload, processAndUpload } from '../middleware/uploadAvatar.js';
import { getUserProfile, updateUserAvatar } from '../services/profileService.js';

const router = express.Router();

router.use(authenticate);

// GET /api/profile
router.get('/', async (req, res) => {
  const profile = await getUserProfile(req.user.email);
  res.json({ error: false, data: profile });
});

// POST /api/profile/avatar
router.post(
  '/avatar',
  upload.single('avatar'),
  processAndUpload,
  async (req, res, next) => {
    try {
      await updateUserAvatar(req.user.email, req.avatarUrl);
      res.json({ error: false, message: 'Avatar berhasil diunggah', data: { avatarUrl: req.avatarUrl } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;