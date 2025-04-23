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

module.exports = router;
