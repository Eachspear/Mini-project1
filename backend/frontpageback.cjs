const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/ce', (req, res) => {
  res.sendFile(path.join(__dirname, 'ce.html'));
});

app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'subjext.html'));
});

app.get('/ds', (req, res) => {
  res.sendFile(path.join(__dirname, 'ds.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
