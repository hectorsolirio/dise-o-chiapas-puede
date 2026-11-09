import mongoose from 'mongoose';

const publicacionSchema = new mongoose.Schema({
  titulo: String,
  texto: String,
  imagenUrl: String,
  descripcionImagen: String,
  color: { type: String, default: '#f1f1f1' },
  destino: { type: String, enum: ['principal', 'avisos', 'proceso'], default: 'avisos' },
  tamanoImagen: { type: String, enum: ['chica', 'grande'], default: 'chica' }
}, { timestamps: true });

export default mongoose.model('Publicacion', publicacionSchema);