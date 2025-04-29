const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(require('cors')());


app.use('/people', require('./routes/people'));//redirect to people file
app.use('/users', require('./routes/users'));//redirect to users file
app.use('/movies', require('./routes/movies'));//redirect to movies file
app.use('/genres', require('./routes/genres'));//redirect to actors file
app.use('/actors', require('./routes/actors'));//redirect to actors file
app.use('/reviews', require('./routes/reviews'));//redirect to reviews file
// app.use('/images', require('./routes/images'));//redirect to images file

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
