import mongoose from 'mongoose';

const opinionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [120, 'El título no puede exceder 120 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      trim: true,
      minlength: [3, 'La categoría debe tener al menos 3 caracteres'],
      maxlength: [50, 'La categoría no puede exceder 50 caracteres'],
    },
    text: {
      type: String,
      required: [true, 'El texto es requerido'],
      trim: true,
      minlength: [10, 'El texto debe tener al menos 10 caracteres'],
      maxlength: [5000, 'El texto no puede exceder 5000 caracteres'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Opinion = mongoose.model('Opinion', opinionSchema);
