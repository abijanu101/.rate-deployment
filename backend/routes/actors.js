// GET actors by movie ID
router.get('/:movieId', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('id', req.params.movieId).execute('sp_GetActorsByMovieId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT update actor's role
router.put('/', async (req, res) => {
  const { movie, person, appearsAs } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movie', movie)
      .input('person', person)
      .input('appearsAs', appearsAs)
      .execute('sp_UpdateActor');
    res.send('Actor role updated successfully.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE actor from movie
router.delete('/', async (req, res) => {
  const { movie, person } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('movie', movie)
      .input('person', person)
      .execute('sp_DeleteActor');
    res.send('Actor removed from movie.');
  } catch (err) {
    res.status(500).send(err.message);
  }
});
