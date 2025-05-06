// /api/index.js
import express from 'express';
import basicAuth from 'express-basic-auth';

const app = express();

// Basic authentication middleware
app.use(
  basicAuth({
    users: { 'admin': process.env.AUTH_PASSWORD || 'defaultpassword' },
    challenge: true,
    realm: 'Secure Area',
  })
);

// Use a specific route instead of a wildcard
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Authentication successful!' });
});

// If you need a catch-all route, use proper Express 4 syntax
app.get('/:path(*)', (req, res) => {
  res.status(200).json({ message: 'Authentication successful for path: ' + req.params.path });
});

// Export the Express app as default
export default app;