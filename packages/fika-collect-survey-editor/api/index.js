// /api/index.js
import express from 'express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate path to the dist directory (where Vite builds to)
const distPath = path.join(__dirname, '../../dist');

console.log('Starting API initialization, serving from:', distPath);

const app = express();

// Basic authentication middleware
app.use(
  basicAuth({
    users: { 'admin': process.env.AUTH_PASSWORD || 'defaultpassword' },
    challenge: true,
    realm: 'Secure Area',
  })
);

console.log('Auth middleware set up');

// Serve static files from the Vite build directory
app.use(express.static(distPath));

// Handle client-side routing by serving index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

console.log('Static file middleware set up');

// Export the Express app
export default app;