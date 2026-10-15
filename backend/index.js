import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

dotenv.config({ quiet: true });

const app = express();

// Comma-separated list of allowed origins, e.g. "https://edulearn-rm.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'https://edulearn-rm.vercel.app,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow same-origin / server-to-server requests that send no Origin header
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Reuse one connection across serverless invocations
let connection = null;
const connectDB = () => {
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      connection = null;
      throw err;
    });
  }
  return connection;
};

app.get('/', (req, res) => {
  res.send('EduLearn API is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(503).json({ message: 'Database unavailable, please try again shortly' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.status === 413 ? 'Payload too large' : 'Server error' });
});

const PORT = process.env.PORT || 5000;

// On Vercel the exported app is used as the serverless handler
if (!process.env.VERCEL) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => console.error('MongoDB connection error:', err));
}

export default app;
