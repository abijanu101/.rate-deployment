const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use('/people', require('./routes/people'));
// app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('/actors', require('./routes/actors'));
app.use('/reviews', require('./routes/reviews'));
// app.use('/images', require('./routes/images'));

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

