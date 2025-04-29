// routes/movies.js
const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CREATE: Insert a new movie with an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Await poolPromise to get the pool
    const pool = await poolPromise;
    if (!pool) {
      throw new Error('Database connection pool is not initialized');
    }

    const { title, director, releasedOn, synopsis } = req.body;
    const imageName = req.file.originalname;
    const imageBuffer = req.file.buffer;
    const imageMIME = req.file.mimetype;

    // Validate required fields
    if (!title || !director || !releasedOn || !synopsis || !imageBuffer || !imageMIME) {
      throw new Error('Missing required fields (title, director, releasedOn, synopsis)');
    }

    // store image and movie
    const request = pool.request();
    request.input('title', sql.VarChar(64), title);
    request.input('director', sql.Int, director);
    request.input('releasedOn', sql.Date, releasedOn);
    request.input('synopsis', sql.Text, synopsis);
    request.input('imageName', sql.VarChar(64), imageName);
    request.input('imageType', sql.VarChar(32), imageMIME);
    request.input('imageBin', sql.VarBinary(sql.MAX), imageBuffer);
    request.output('movieID', sql.Int);

    const result = await request.execute('sp_InsertMovie');

    // store actor-movie relationships
    for (const actor of await JSON.parse(req.body.actors)) {
      const request2 = pool.request();
      request2.input('person', sql.Int, actor.actorID);
      request2.input('movie', sql.Int, result.output.movieID);
      request2.input('appearsAs', sql.VarChar(64), actor.as);
      await request2.execute('sp_InsertActor');
    };

    // store genre-movie relationships
    for (const genre of await JSON.parse(req.body.genres)) {
      const request2 = pool.request();
      request2.input('movieID', sql.Int, result.output.movieID);
      request2.input('genreID', sql.Int, genre.id);
      await request2.execute('sp_AssignGenre');
    };

    // write back
    res.status(201).json({
      message: 'Movie added successfully',
      id: result.output.movieID
    });
  } catch (err) {
    console.error('Error in POST /movies:', err); // Log the error for debugging
    res.status(500).send('Insert failed: ' + err.message);
  }
});


// GET all movies with image and mean rating
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().execute('sp_GetMovies');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET movie by ID with image and director name
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const movieDetails = await pool.request().input('id', req.params.id).execute('sp_GetMovieById');
    const actors = await pool.request().input('id', req.params.id).execute('sp_GetActorsByMovieId');
    const result = { ...movieDetails.recordset[0], 'actors': actors.recordset };
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT update movie
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const pool = await poolPromise;

    const { id, title, director, releasedOn, synopsis } = req.body;
    const imageName = req.file.originalname;
    const imageBuffer = req.file.buffer;
    const imageMIME = req.file.mimetype;

    // Validate required fields
    if (!title || !director || !releasedOn || !synopsis || !imageBuffer || !imageMIME) {
      throw new Error('Missing required fields (title, director, releasedOn, synopsis)');
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar(64), title)
      .input('director', sql.Int, director)
      .input('releasedOn', sql.Date, releasedOn)
      .input('synopsis', sql.Text, synopsis)
      .input('imageName', sql.VarChar(64), imageName)
      .input('imageType', sql.VarChar(32), imageMIME)
      .input('imageBin', sql.VarBinary(sql.MAX), imageBuffer)
      .execute('sp_UpdateMovie');

    await pool.request()
      .input('movie', req.params.id)
      .execute('sp_WipeMovieGenres');

    await pool.request()
      .input('movie', req.params.id)
      .execute('sp_WipeMovieActors');

    // store actor-movie relationships
    for (const actor of await JSON.parse(req.body.actors)) {
      await pool.request()
        .input('person', sql.Int, actor.actorID)
        .input('movie', sql.Int, id)
        .input('appearsAs', sql.VarChar(64), actor.appearsAs)
        .execute('sp_InsertActor');
    };

    // store genre-movie relationships
    for (const genre of await JSON.parse(req.body.genres)) {
      await pool.request()
        .input('movieID', sql.Int, id)
        .input('genreID', sql.Int, genre.id)
        .execute('sp_AssignGenre');
    };

    res.send('Movie updated successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE movie
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().input('id', req.params.id).execute('sp_DeleteMovie');
    res.send('Movie deleted successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});




module.exports = router;