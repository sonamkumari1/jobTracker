import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import connectDb from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobsRoutes from './routes/jobsRoute.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

// Configure environment variables
dotenv.config();

// Connect to MongoDB
connectDb();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal Application',
      description: 'Node Express.js Job Portal Application',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Initialize Express app
const app = express();

// Middleware setup
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://job-trackr-client.vercel.app'],
  })
);
app.use(cookieParser());
app.use(morgan('dev'));

// Swagger documentation route
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Main API endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Job Portal main API endpoint' });
});

// API routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/job', jobsRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Define server port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Node Server running in ${process.env.DEV_MODE} on port ${PORT}`);
});
