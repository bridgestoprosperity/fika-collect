const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic authentication middleware
app.use(
  basicAuth({
    users: { admin: process.env.AUTH_PASSWORD || "your-default-password" },
    challenge: true,
    realm: "Secure Area",
  })
);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle all routes by serving the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
