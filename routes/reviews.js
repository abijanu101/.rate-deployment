const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // Import from db.js

// POST /reviews
router.post('/', async (req, res) => {
  const { movie, id, rating } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('movie', sql.Int, movie)
      .input('id', sql.Int, id)
      .input('rating', sql.Int, rating)
      .execute('sp_InsertReview');

    res.status(200).json({ message: 'Review inserted successfully', result: result.recordset });
  } catch (err) {
    console.error('❌ Error executing sp_InsertReview:', err);
    res.status(500).json({ error: 'Failed to insert review' });
  }
});

module.exports = router;
