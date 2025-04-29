const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // Import from db.js

// POST /reviews
router.post('/', async (req, res) => {
  const { movie, id, rating, msg } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('movie', sql.Int, movie)
      .input('id', sql.Int, id)
      .input('rating', sql.Int, rating)
      .input('msg', sql.VarChar(sql.MAX), msg)
      .execute('sp_InsertReview');

    res.status(200).json({ message: 'Review inserted successfully', result: result.recordset });
  } catch (err) {
    console.error('❌ Error executing sp_InsertReview:', err);
    res.status(500).json({ error: 'Failed to insert review' });
  }
});

// GET reviews by movie ID
router.get('/:movieId', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('movie', req.params.movieId).execute('sp_GetReviewsByMovieId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT update review rating
router.put('/', async (req, res) => {
  const { movie, id, rating } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movie', movie)
      .input('id', id)
      .input('rating', rating)
      .execute('sp_UpdateReview');
    res.send('Review updated successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE review
router.delete('/', async (req, res) => {
  const { movie, id } = req.body;
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
