import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createOpinion,
  getOpinions,
  getOpinionById,
  updateOpinion,
  deleteOpinion,
} from '../controllers/opinion.controller.js';
import { validateJWT } from '../middlewares/validate-JWT.js';
import { checkValidators } from '../middlewares/check-validators.js';

const router = Router();

const opinionValidators = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 3, max: 120 })
    .withMessage('El título debe tener entre 3 y 120 caracteres'),
  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isLength({ min: 3, max: 50 })
    .withMessage('La categoría debe tener entre 3 y 50 caracteres'),
  body('text')
    .notEmpty()
    .withMessage('El texto es requerido')
    .isLength({ min: 10, max: 5000 })
    .withMessage('El texto debe tener entre 10 y 5000 caracteres'),
];

const opinionUpdateValidators = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 120 })
    .withMessage('El título debe tener entre 3 y 120 caracteres'),
  body('category')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('La categoría debe tener entre 3 y 50 caracteres'),
  body('text')
    .optional()
    .isLength({ min: 10, max: 5000 })
    .withMessage('El texto debe tener entre 10 y 5000 caracteres'),
];

const idValidator = [
  param('id').notEmpty().withMessage('El ID es requerido'),
];

router.get('/', getOpinions);
router.get('/:id', idValidator, checkValidators, getOpinionById);

router.post('/', validateJWT, opinionValidators, checkValidators, createOpinion);

router.put(
  '/:id',
  validateJWT,
  idValidator,
  opinionUpdateValidators,
  checkValidators,
  updateOpinion
);

router.delete('/:id', validateJWT, idValidator, checkValidators, deleteOpinion);

export default router;
