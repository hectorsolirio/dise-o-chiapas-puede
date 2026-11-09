
import Publicacion from '../models/Publicacion.js';

//  Leer todas las publicaciones (las más nuevas primero)
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find().sort({ createdAt: -1 });

    res.json(publicaciones);

  } catch (error) {
    console.error('Error al obtener:', error);

    res.status(500).json({
      mensaje: 'Error al obtener las publicaciones'
    });
  }
};


// ➕ Crear una publicación
export const crearPublicacion = async (req, res) => {
  try {
    const {
      titulo,
      texto,
      imagenUrl,
      descripcionImagen,
      color,
      destino,
      tamanoImagen
    } = req.body;

    const nueva = await Publicacion.create({
      titulo,
      texto,
      imagenUrl,
      descripcionImagen,
      color,
      destino,
      tamanoImagen
    });

    res.status(201).json({
      data: nueva
    });

  } catch (error) {
    console.error('Error al crear:', error);

    res.status(500).json({
      mensaje: 'Error al crear la publicación'
    });
  }
};


// ✏️ Modificar una publicación
export const actualizarPublicacion = async (req, res) => {
  try {
    const {
      titulo,
      texto,
      imagenUrl,
      descripcionImagen,
      color,
      destino,
      tamanoImagen
    } = req.body;

    const actualizada = await Publicacion.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        texto,
        imagenUrl,
        descripcionImagen,
        color,
        destino,
        tamanoImagen
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!actualizada) {
      return res.status(404).json({
        mensaje: 'Publicación no encontrada'
      });
    }

    res.json({
      data: actualizada
    });

  } catch (error) {
    console.error('Error al actualizar:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar la publicación'
    });
  }
};


// 🗑️ Eliminar una publicación
export const eliminarPublicacion = async (req, res) => {
  try {
    const eliminada = await Publicacion.findByIdAndDelete(
      req.params.id
    );

    if (!eliminada) {
      return res.status(404).json({
        mensaje: 'Publicación no encontrada'
      });
    }

    res.json({
      mensaje: 'Publicación eliminada'
    });

  } catch (error) {
    console.error('Error al eliminar:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar la publicación'
    });
  }
};
