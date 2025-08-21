import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import countdownRoute from './routes/countdown';

const app = new Hono();

// Enable CORS for the Vite dev server
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite default ports
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// API routes
app.route('/api/countdown', countdownRoute);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Wedding Countdown API Server is running!' 
  });
});

// Root endpoint with API documentation
app.get('/', (c) => {
  return c.json({
    message: 'Wedding Countdown API Server',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Server health check',
      'GET /api/countdown': 'Get wedding countdown data',
      'POST /api/countdown/update-date': 'Update wedding date',
      'GET /api/countdown/config': 'Get full wedding configuration'
    },
    example: {
      countdown: 'GET http://localhost:3001/api/countdown',
      updateDate: 'POST http://localhost:3001/api/countdown/update-date'
    }
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`🚀 Wedding Countdown API Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`);
  console.log(`📋 API Documentation: http://localhost:${info.port}/`);
  console.log(`💖 Wedding Countdown: http://localhost:${info.port}/api/countdown`);
});
