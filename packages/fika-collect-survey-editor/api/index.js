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

// Add a simple route
app.get('*', (req, res) => {
  res.status(200).json({ message: 'Authentication successful!' });
});

// Export the Express app
export default app;