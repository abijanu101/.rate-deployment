const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // Import from db.js
const { verifyToken } = require('../auth');

//Fetch all Reviews for Movie
router.get('/movies/:movieID', async (req, res) => {
  try {
    const pool = await poolPromise;
    const request = await pool.request();
    const result = await request
      .input('movieID', sql.Int, req.params.movieID)
      .query('SELECT U.id, username, rating, msg FROM Reviews R JOIN Users U ON U.id = R.id WHERE R.movie = @movieID');
    res.status(200).send(result.recordset);
  }
  catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})

//Post Reviews (also handles updation by deleting old review)
router.post('/', verifyToken, async (req, res) => {
  const { movie, rating, msg } = req.body;
  const id = req.user.id; // from token

  try {
    const pool = await poolPromise;
    // check for existing reviews
    await (await (pool.request())
      .input('movie', sql.Int, movie)
      .input('id', sql.Int, id)
      .query('DELETE FROM Reviews WHERE (movie = @movie AND id = @id)')
    );

    const result = await (await (pool.request())
      .input('movie', sql.Int, movie)
      .input('id', sql.Int, id)
      .input('rating', sql.Int, rating)
      .input('msg', sql.VarChar(sql.MAX), msg)
      .execute('sp_InsertReview'));

    res.status(200).json({ message: 'Review inserted successfully', result: result.recordset });
  } catch (err) {
    console.error('❌ Error executing sp_InsertReview:', err);
    res.status(500).json({ error: 'Failed to insert review' });
  }
});


//Delete Review
router.delete('/', verifyToken, async (req, res) => {
  const { movie } = req.body;
  const id = req.user.id;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movie', movie)
      .input('id', id)
      .execute('sp_DeleteReview');
    res.send('Review deleted successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});




module.exports = router;
