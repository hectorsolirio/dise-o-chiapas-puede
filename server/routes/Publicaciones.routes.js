import { Router } from 'express';
import {obtenerPublicaciones, crearPublicacion, actualizarPublicacion, eliminarPublicacion
} from '../controllers/publicaciones.controller.js';

const router = Router();

// GET -> http://localhost:5000/api/publicaciones
router.get('/publicaciones', obtenerPublicaciones);

// POST -> http://localhost:5000/api/publicaciones
router.post('/publicaciones', crearPublicacion);

// PUT -> http://localhost:5000/api/publicaciones/:id  (editar)
router.put('/publicaciones/:id', actualizarPublicacion);

// DELETE -> http://localhost:5000/api/publicaciones/:id  (eliminar)
router.delete('/publicaciones/:id', eliminarPublicacion);

export default router;
