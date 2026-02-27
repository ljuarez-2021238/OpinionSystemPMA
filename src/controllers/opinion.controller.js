import mongoose from 'mongoose';
import { Opinion } from '../models/opinion.model.js';

export const createOpinion = async (req, res, next) => {
  try {
    const { title, category, text } = req.body;

    const opinion = await Opinion.create({
      title,
      category,
      text,
      author: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      data: opinion,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpinions = async (req, res, next) => {
  try {
    const opinions = await Opinion.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: opinions,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpinionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación inválido',
      });
    }

    const opinion = await Opinion.findById(id).populate('author', 'name email');

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: opinion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOpinion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación inválido',
      });
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada',
      });
    }

    if (opinion.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta publicación',
      });
    }

    if (title !== undefined) opinion.title = title;
    if (category !== undefined) opinion.category = category;
    if (text !== undefined) opinion.text = text;

    const updatedOpinion = await opinion.save();

    res.status(200).json({
      success: true,
      message: 'Publicación actualizada exitosamente',
      data: updatedOpinion,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOpinion = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de publicación inválido',
      });
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada',
      });
    }

    if (opinion.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta publicación',
      });
    }

    await opinion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Publicación eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
