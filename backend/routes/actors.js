const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db'); // Import from your db.js

// POST /actors
router.post('/', async (req, res) => {
  const { person, movie, appearsAs } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('person', sql.Int, person)
      .input('movie', sql.Int, movie)
      .input('appearsAs', sql.VarChar(64), appearsAs)
      .execute('sp_InsertActor');

    res.status(200).json({ message: 'Actor inserted successfully', result: result.recordset });
  } catch (err) {
    console.error('❌ Error executing sp_InsertActor:', err);
    res.status(500).json({ error: 'Failed to insert actor' });
  }
});




module.exports = router;
