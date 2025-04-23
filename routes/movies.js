// routes/movies.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// CREATE: Insert a new movie with an image
router.post('/', async (req, res) => {
  try {
    // Await poolPromise to get the pool
    const pool = await poolPromise;
    if (!pool) {
      throw new Error('Database connection pool is not initialized');
    }

    const { title, director, releasedOn, synopsis, imageName, imageType, imageBase64 } = req.body;

    // Validate required fields
    if (!title || !director || !releasedOn || !synopsis || !imageName || !imageType || !imageBase64) {
      throw new Error('All fields (title, director, releasedOn, synopsis, imageName, imageType, imageBase64) are required');
    }

    // Validate imageType length (max 5 characters as per procedure)
    if (imageType.length > 5) {
      throw new Error('imageType must be 5 characters or less');
    }

    // Convert base64 string to binary (Buffer) for imageBin
    const imageBin = Buffer.from(imageBase64, 'base64');

    // Call the stored procedure
    const request = pool.request();
    request.input('title', sql.VarChar(64), title);
    request.input('director', sql.Int, director);
    request.input('releasedOn', sql.Date, releasedOn);
    request.input('synopsis', sql.Text, synopsis);
    request.input('imageName', sql.VarChar(32), imageName);
    request.input('imageType', sql.VarChar(5), imageType);
    request.input('imageBin', sql.VarBinary(sql.MAX), imageBin);
    request.output('imageId', sql.Int);

    const result = await request.execute('sp_InsertMovie');

    res.status(201).json({
      message: 'Movie added successfully',
      imageId: result.output.imageId
    });
  } catch (err) {
    console.error('Error in POST /movies:', err); // Log the error for debugging
    res.status(500).send('Insert failed: ' + err.message);
  }
});

module.exports = router;