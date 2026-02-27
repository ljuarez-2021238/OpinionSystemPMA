import mongoose from 'mongoose';
import { Comment } from '../models/comment.model.js';
import { Opinion } from '../models/opinion.model.js';

/**
 * Crear un nuevo comentario en una publicación
 */
export const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { opinionId } = req.params;

    // Validar que el ID de la publicación sea válido
    if (!mongoose.Types.ObjectId.isValid(opinionId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación inválido',
      });
    }

    // Verificar que la publicación existe
    const opinion = await Opinion.findById(opinionId);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada',
      });
    }

    // Crear el comentario
    const comment = await Comment.create({
      text,
      author: req.user.userId,
      opinion: opinionId,
    });

    // Poblar datos del autor
    await comment.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todos los comentarios de una publicación
 */
export const getCommentsByOpinion = async (req, res, next) => {
  try {
    const { opinionId } = req.params;

    // Validar que el ID de la publicación sea válido
    if (!mongoose.Types.ObjectId.isValid(opinionId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación inválido',
      });
    }

    // Verificar que la publicación existe
    const opinion = await Opinion.findById(opinionId);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada',
      });
    }

    // Obtener comentarios
    const comments = await Comment.find({ opinion: opinionId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
      total: comments.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Editar un comentario (solo el autor puede editar)
 */
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validar que el ID del comentario sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de comentario inválido',
      });
    }

    // Buscar el comentario
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    // Verificar que el usuario sea el autor del comentario
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este comentario',
      });
    }

    // Actualizar el comentario
    comment.text = text;
    await comment.save();

    await comment.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un comentario (solo el autor puede eliminar)
 */
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validar que el ID del comentario sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de comentario inválido',
      });
    }

    // Buscar el comentario
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    // Verificar que el usuario sea el autor del comentario
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este comentario',
      });
    }

    // Eliminar el comentario
    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
