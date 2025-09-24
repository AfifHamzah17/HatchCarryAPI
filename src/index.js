// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/user.js'; // assuming the first snippet is in routes/user.js
// import profileRoutes from './routes/profile.js';  // ← impor
// import reportRoutes from './routes/report.js';
// import { initFirestore } from './utils/firestore.js';

// dotenv.config();
// const app = express();

// // Function to initialize Firestore and start the server
// const startServer = async () => {
//   try {
//     // Initialize Firestore
//     await initFirestore();


// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes); // protect all user routes with auth + admin
// app.use('/api/profile', profileRoutes);
// app.use('/api/reports', reportRoutes);

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: true, message: 'Endpoint tidak ditemukan' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({ error: true, message: err.message });
// });

// console.log("Loaded bucket name:", process.env.GCLOUD_STORAGE_BUCKET);
// //     // Cloud Run sets the PORT as an environment variable
//   const PORT = process.env.PORT || 8080;  // Default to 8080 if PORT is not set
//     app.listen(PORT, () => {
//       console.log(`Server berjalan di http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error during server startup:", error);
//     process.exit(1); // Exit process with failure code
//   }
// };

// // Start the server
// startServer();
// //deployment pakai ini cuy!
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));

// // import express from 'express';
// // import cors from 'cors';
// // import dotenv from 'dotenv';
// // import authRoutes from './routes/auth.js';
// // import userRoutes from './routes/user.js';
// // import profileRoutes from './routes/profile.js';
// // import { initFirestore } from './utils/firestore.js';

// // dotenv.config();

// // const app = express();

// // // Wrap Firestore initialization in an async function
// // const startServer = async () => {
// //   try {
// //     // Initialize Firestore
// //     await initFirestore();

// //     // Middleware
// //     app.use(cors());
// //     app.use(express.json());

// //     // Routes
// //     app.use('/api/auth', authRoutes);
// //     app.use('/api/users', userRoutes); // Protect all user routes with auth + admin
// //     app.use('/api/profile', profileRoutes);

// //     // 404 handler
// //     app.use((req, res) => {
// //       res.status(404).json({ error: true, message: 'Endpoint tidak ditemukan' });
// //     });

// //     // Error handler
// //     app.use((err, req, res, next) => {
// //       console.error(err);
// //       res.status(err.status || 500).json({ error: true, message: err.message });
// //     });

// //     console.log("Loaded bucket name:", process.env.GCLOUD_STORAGE_BUCKET);


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import reportRoutes from './routes/report.js';
import { initFirestore } from './utils/firestore.js';

dotenv.config();
const app = express();

// Function to initialize Firestore and start the server
const startServer = async () => {
  try {
    // Initialize Firestore
    await initFirestore();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes); // protect all user routes with auth + admin
    app.use('/api/profile', profileRoutes);
    app.use('/api/reports', reportRoutes);

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

    // Cloud Run sets the PORT as an environment variable
    const PORT = process.env.PORT || 8080;  // Default to 8080 if PORT is not set
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1); // Exit process with failure code
  }
};

// Start the server
startServer();
