const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

// Serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// SSL configuration
let sslOptions = null;
if (process.env.NODE_ENV === 'production') {
  sslOptions = {
    key: fs.readFileSync('/ssl/key.pem'),
    cert: fs.readFileSync('/ssl/cert.pem')
  };
}

// Start the server
const PORT = process.env.PORT || 3000;
if (sslOptions) {
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS server listening on port ${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
  });
}