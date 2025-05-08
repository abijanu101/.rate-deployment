const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// POST /people (uses stored procedure)
router.post('/', async (req, res) => {
  try {
    const { fname, lname, gender = '-', dob = null } = req.body;
    const pool = await poolPromise;

    //

  } catch (err) {
    res.status(500).send(`❌ Error: ${err.message}`);
  }
});



// READ People with average rating
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.query('SELECT id, gname as name FROM Genre');

    res.status(200).json(result.recordset); // return data as JSON
  } catch (err) {
    res.status(500).send(`❌ Failed to fetch genres: ${err.message}`);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .execute('sp_GetGenresByMovieId');

    if (result.recordset.length === 0) {
      return res.status(200).json({ message: 'No Genre Tags Found' });
    }

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update person
router.put('/:id', async (req, res) => {
  const { fname, lname, gender, dob } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', req.params.id)
      .input('fname', fname)
      .input('lname', lname)
      .input('gender', gender)
      .input('dob', dob)
      .execute('sp_UpdatePerson');
    res.send('Person updated successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE person
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', req.params.id).execute('sp_DeletePerson');
    res.send('Person deleted successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
