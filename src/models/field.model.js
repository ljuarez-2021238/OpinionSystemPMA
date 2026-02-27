import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del campo es requerido'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    icon: String,
    color: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

fieldSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }
  next();
});

export const Field = mongoose.model('Field', fieldSchema);
