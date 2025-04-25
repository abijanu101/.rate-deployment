const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// POST /people (uses stored procedure)
router.post('/', async (req, res) => {
  try {
    const { fname, lname, gender = '-', dob = null } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('fname', sql.VarChar(32), fname)
      .input('lname', sql.VarChar(32), lname)
      .input('gender', sql.Char(1), gender)
      .input('dob', sql.Date, dob)
      .execute('sp_InsertPerson');

    // res.status(201).send('✅ Person inserted using stored procedure.');
  } catch (err) {
    res.status(500).send(`❌ Error: ${err.message}`);
  }
});



// READ People with average rating
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().execute('sp_GetPeople');

    res.status(200).json(result.recordset); // return data as JSON
  } catch (err) {
    res.status(500).send(`❌ Failed to fetch people: ${err.message}`);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .execute('sp_GetPersonById');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json(result.recordset[0]);
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
