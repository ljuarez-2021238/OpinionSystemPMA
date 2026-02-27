import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createComment,
  getCommentsByOpinion,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import { validateJWT } from '../middlewares/validate-JWT.js';
import { checkValidators } from '../middlewares/check-validators.js';

const router = Router();

// Validadores para crear/actualizar comentarios
const commentCreateValidators = [
  body('text')
    .notEmpty()
    .withMessage('El texto del comentario es requerido')
    .isLength({ min: 1, max: 1000 })
    .withMessage('El comentario debe tener entre 1 y 1000 caracteres')
    .trim(),
];

const commentUpdateValidators = [
  body('text')
    .notEmpty()
    .withMessage('El texto del comentario es requerido')
    .isLength({ min: 1, max: 1000 })
    .withMessage('El comentario debe tener entre 1 y 1000 caracteres')
    .trim(),
];

// Validadores de parámetros
const opinionIdValidator = [
  param('opinionId')
    .notEmpty()
    .withMessage('El ID de la publicación es requerido')
    .isMongoId()
    .withMessage('El ID de la publicación no es válido'),
];

const commentIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isMongoId()
    .withMessage('El ID del comentario no es válido'),
];

/**
 * @route   POST /api/comments/:opinionId
 * @desc    Crear un comentario en una publicación
 * @access  Privado (requiere autenticación)
 */
router.post(
  '/:opinionId',
  validateJWT,
  opinionIdValidator,
  commentCreateValidators,
  checkValidators,
  createComment
);

/**
 * @route   GET /api/comments/:opinionId
 * @desc    Listar todos los comentarios de una publicación
 * @access  Público
 */
router.get(
  '/:opinionId',
  opinionIdValidator,
  checkValidators,
  getCommentsByOpinion
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Actualizar un comentario (solo el autor)
 * @access  Privado (requiere autenticación)
 */
router.put(
  '/:id',
  validateJWT,
  commentIdValidator,
  commentUpdateValidators,
  checkValidators,
  updateComment
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Eliminar un comentario (solo el autor)
 * @access  Privado (requiere autenticación)
 */
router.delete(
  '/:id',
  validateJWT,
  commentIdValidator,
  checkValidators,
  deleteComment
);

export default router;
