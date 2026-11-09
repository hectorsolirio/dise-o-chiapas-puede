import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const carpetaUploads = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(carpetaUploads, { recursive: true });

const EXTENSIONES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, carpetaUploads),
  filename: (req, file, cb) => {
    const nombre = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${EXTENSIONES[file.mimetype]}`;
    cb(null, nombre);
  }
});

const upload = multer({
  storage: almacenamiento,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (EXTENSIONES[file.mimetype]) cb(null, true);
    else cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'));
  }
});

const router = Router();

// POST -> http://localhost:5000/api/upload
router.post('/upload', (req, res) => {
  upload.single('imagen')(req, res, (error) => {
    if (error) return res.status(400).json({ mensaje: error.message });
    if (!req.file) return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

export default router;