import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { setupDatabase } from './server/db';
import authRoutes from './server/routes/auth';
import issueRoutes, { setIo, setUpload } from './server/routes/issues';
import userRoutes from './server/routes/users';
import aiRoutes from './server/routes/ai';
import miscRoutes from './server/routes/misc';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({
    origin: [
      "https://civi-fix-sand.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));

  // ── File upload middleware ──────────────────────────────────────────────────
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png, and .webp formats allowed!'));
      }
    },
  });

  app.use('/uploads', express.static(uploadDir));

  // ── Database ───────────────────────────────────────────────────────────────
  await setupDatabase();

  // ── API routes ─────────────────────────────────────────────────────────────
  app.use('/api/auth',   authRoutes);
  app.use('/api/issues', issueRoutes);
  app.use('/api/users',  userRoutes);
  app.use('/api',        aiRoutes);    // /api/analyze-issue, /api/chat, /api/verify-issue
  app.use('/api',        miscRoutes);  // /api/volunteers, /api/resources, /api/notifications, /api/operations

  // ── Vite dev server / production static ────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // ── HTTP server + Socket.io ────────────────────────────────────────────────
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "https://civi-fix-sand.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  // Inject io and upload into the issues router
  setIo(io);
  setUpload(upload);

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`[Civic Tech Server] Running on http://localhost:${PORT}`);
    console.log('[Socket.io] Ready for real-time connections');
  });
}

startServer();
