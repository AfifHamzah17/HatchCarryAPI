import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; // assuming the first snippet is in routes/user.js
import profileRoutes from './routes/profile.js';  // ← impor
import { initFirestore } from './utils/firestore.js';

dotenv.config();
const app = express();

// Initialize Firestore
await initFirestore();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // protect all user routes with auth + admin
app.use('/api/profile', profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: true, message: err.message });
});

console.log("Loaded bucket name:", process.env.GCLOUD_STORAGE_BUCKET);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));