import { validationResult } from 'express-validator';

export const checkValidators = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param || error.path,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: formattedErrors,
    });
  }

  next();
};
