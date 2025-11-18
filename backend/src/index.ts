import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translationRoutes from './routes/translation.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Enable CORS for all routes (allows Swift app to connect from any origin)
app.use(cors({
  origin: '*', // Allow all origins in production (you can restrict this later)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Translation API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/translate', translationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Translation API available at http://localhost:${PORT}/api/translate`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});

export default app;
