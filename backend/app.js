const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(require('cors')());
app.use('/api', require('./routes/api'));

app.listen(process.env.PORT, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
