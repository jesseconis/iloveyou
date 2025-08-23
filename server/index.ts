import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import wedding from './routes/wedding';

const app = new OpenAPIHono();

// Enable CORS for the Vite dev server
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite default ports
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// API routes
app.route('/api/wedding', wedding);

// Health check endpoint
const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            timestamp: z.string(),
            message: z.string(),
          }),
        },
      },
      description: 'Server health status',
    },
  },
});

app.openapi(healthRoute, (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Wedding Countdown API Server is running!' 
  });
});

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Wedding Countdown API',
    description: 'I LOVE YOU ASHLEIGH 💖',
  },
});

// Swagger UI
app.get('/api/doc', swaggerUI({ url: '/doc' }));

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
