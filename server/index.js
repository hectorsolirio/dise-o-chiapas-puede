import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.routes.js';

// 1. Importamos las rutas de las publicaciones (verifica que el nombre coincida con tu archivo)
import rutasPublicaciones from './routes/Publicaciones.routes.js';

// Inicializamos la lectura de variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middlewares de configuración obligatorios
app.use(cors());          // Permite que tu Frontend de React haga peticiones sin bloqueos de seguridad
app.use(express.json());  // Permite que tu servidor entienda los datos en formato JSON que manda el formulario

// 3. Conexión a la Base de Datos MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/chiapas_puede';

mongoose.connect(mongoURI)
  .then(() => console.log('🟢 ¡Conectado con éxito a MongoDB!'))
  .catch((error) => console.error('🔴 Error crítico al conectar a MongoDB:', error));

// 4. Declaración de Rutas de la API
// Esto hará que todas tus rutas de publicaciones comiencen con /api (Ej: http://localhost:5000/api/publicaciones)
app.use('/api', rutasPublicaciones);

// Ruta de prueba inicial para verificar en el navegador que el servidor responda
app.get('/', (req, res) => {
  res.send('🚀 Servidor de Chiapas Puede corriendo exitosamente.');
});

// 5. Encendido oficial del Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en el puerto: http://localhost:${PORT}`);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));