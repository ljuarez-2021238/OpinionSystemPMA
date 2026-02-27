import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { validateJWT } from '../middlewares/validate-JWT.js';
import { checkValidators } from '../middlewares/check-validators.js';
import { loginLimiter, registerLimiter } from '../configs/rateLimit.configuration.js';

const router = Router();

const registerValidators = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 5 })
    .withMessage('El nombre debe tener al menos 5 caracteres'),
  body('email')
    .isEmail()
    .withMessage('el email es inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúscula, minúscula y número'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseña es incorrecta');
    }
    return true;
  }),
];

const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

const updateProfileValidators = [
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La biografía no puede exceder 500 caracteres'),
];

const changePasswordValidators = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener mayúscula, minúscula y número'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
];

router.post(
  '/register',
  registerLimiter,
  registerValidators,
  checkValidators,
  register
);

router.post(
  '/login',
  loginLimiter,
  loginValidators,
  checkValidators,
  login
);

router.get('/profile', validateJWT, getProfile);

router.put(
  '/profile',
  validateJWT,
  updateProfileValidators,
  checkValidators,
  updateProfile
);

router.post(
  '/change-password',
  validateJWT,
  changePasswordValidators,
  checkValidators,
  changePassword
);

export default router;
