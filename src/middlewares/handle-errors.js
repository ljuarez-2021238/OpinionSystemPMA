/**
 * Middleware global para manejo de errores
 * Captura todos los errores y devuelve respuestas estructuradas
 */
export const handleErrors = (error, req, res, next) => {
  console.error('✗ Error:', error);

  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: messages,
    });
  }

  // Error de clave duplicada (índice único)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `El ${field} ya está registrado`,
    });
  }

  // Error de token JWT inválido
  if (error.name === 'JsonWebTokenError') {
    return res.status(403).json({
      success: false,
      message: 'Token inválido',
    });
  }

  // Error de token JWT expirado
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // Error de casting (ID inválido de MongoDB)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `ID inválido: ${error.value}`,
    });
  }

  // Error genérico
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
};
