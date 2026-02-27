import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto del comentario es requerido'],
      trim: true,
      minlength: [1, 'El comentario debe tener al menos 1 carácter'],
      maxlength: [1000, 'El comentario no puede exceder 1000 caracteres'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opinion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opinion',
      required: [true, 'La publicación es requerida'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para mejorar las consultas por publicación
commentSchema.index({ opinion: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
