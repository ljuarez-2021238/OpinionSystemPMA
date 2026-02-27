import rateLimit from 'express-rate-limit';

export const rateLimitConfig = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health';
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: 'Demasiados intentos de inicio de sesión, intente más tarde',
  skipSuccessfulRequests: true,
  standardHeaders: true,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Demasiados registros, intente más tarde',
  standardHeaders: true,
});
