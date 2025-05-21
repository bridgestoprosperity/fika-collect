// /api/index.js
import express from 'express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate path to the dist directory (where Vite builds to)
const distPath = path.join(__dirname, '../packages/fika-collect-survey-editor/dist');

console.log('Starting API initialization, serving from:', distPath);

const app = express();

// Add Content Security Policy middleware
app.use((req, res, next) => {
  // Set a more permissive Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self'"
  );
  next();
});

// Basic authentication middleware
app.use(
  basicAuth({
    users: { 'admin': process.env.AUTH_PASSWORD || 'defaultpassword' },
    challenge: true,
    realm: 'Secure Area',
  })
);

// Serve static files from the Vite build directory
app.use(express.static(distPath));

// Handle client-side routing by serving index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Export the Express app
export default app;
