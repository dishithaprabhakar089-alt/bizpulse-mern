import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import saleRoutes from './routes/saleRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Setup environment
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'Small Business Management API',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/small_business_db'
  });
});

// Serve frontend static build (Single localhost port delivery)
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving React UI directly from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: system-ui; max-width: 600px; margin: 40px auto; padding: 24px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h2 style="color: #16a34a;">⚡ Small Business Management API is running!</h2>
        <p>The backend is live on port ${process.env.PORT || 5000}.</p>
        <p>To view the full interactive UI here, build the client with: <code>npm run client:build</code>, or run in development mode with <code>npm run dev</code>.</p>
        <p><strong>MongoDB Compass URL:</strong> <code>${process.env.MONGODB_URI || 'mongodb://localhost:27017/small_business_db'}</code></p>
      </div>
    `);
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n=============================================================');
  console.log(`🚀 SMALL BUSINESS MANAGEMENT APP IS READY!`);
  console.log(`🔗 Localhost Web Application Link : http://localhost:${PORT}`);
  console.log(`🧭 MongoDB Compass Connection URL : ${process.env.MONGODB_URI || 'mongodb://localhost:27017/small_business_db'}`);
  console.log(`🗄️  Database Name                  : small_business_db`);
  console.log('=============================================================\n');
});
