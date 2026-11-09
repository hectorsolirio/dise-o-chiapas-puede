import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  
  //  AQUÍ DEFINES EL ROL EN LA BASE DE DATOS
  rol: { 
    type: String, 
    enum: ['administrador', 'visita'], 
    default: 'visita' // Por defecto, cualquier cuenta nueva entra como visita
  }
});

export default mongoose.model('Usuario', UsuarioSchema);
