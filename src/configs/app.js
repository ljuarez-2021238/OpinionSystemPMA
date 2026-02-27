import express from 'express';
import multer from 'multer';
import { corsConfig } from './cors.configuration.js';
import { helmetConfig } from './helmet.configuration.js';
import { rateLimitConfig } from './rateLimit.configuration.js';
import { connectDB } from './db.configuration.js';
import authRoutes from '../routes/auth.routes.js';
import opinionRoutes from '../routes/opinion.routes.js';
import commentRoutes from '../routes/comment.routes.js';
import { handleErrors } from '../middlewares/handle-errors.js';
import morgan from 'morgan';

const PORT = process.env.PORT || 3000;
const BASE_PATH = '/api';

const app = express();
const upload = multer();

app.use(helmetConfig);
app.use(corsConfig);
app.use(rateLimitConfig);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

app.use('/api/auth', authRoutes);
app.use('/api/opinions', opinionRoutes);
app.use('/api/comments', commentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    message: 'Opinions System API is running',
    timestamp: new Date().toISOString()
  });
});

app.use(handleErrors);

export const initServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Opinions-System API running on port ${PORT}`);
      console.log(`Health check endpoint: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

