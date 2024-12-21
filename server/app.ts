import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { expensesRoute } from './routes/expenses';
import { serveStatic } from 'hono/bun';

const app = new Hono();

// Middleware for logging
app.use('*', logger());

// API routes
const apiRoutes = app.basePath('/api').route('/expenses', expensesRoute);
const apiSchoolRoutes = app.basePath('/api').route('/schools', expensesRoute);

// Serve static files (e.g., JS, CSS, images)
app.use('/static/*', serveStatic({ root: './frontend/dist/static' }));
app.use('/assets/*', serveStatic({ root: './frontend/dist/assets' }));

// Fallback to index.html for all other routes
app.get('*', async (c, next) => {
  const response = await serveStatic({ path: './frontend/dist/index.html' })(c, next);
  return response || c.text('Not Found', 404);
});

export default app;
export type ApiRoutes = typeof apiRoutes;
