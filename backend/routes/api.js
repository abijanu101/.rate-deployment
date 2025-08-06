const express = require('express');
const router = express.Router();

router.use('/people', require('./people'));//redirect to people file
router.use('/movies', require('./movies'));//redirect to movies file
router.use('/genres', require('./genres'));//redirect to actors file
router.use('/actors', require('./actors'));//redirect to actors file
router.use('/reviews', require('./reviews'));//redirect to reviews file
router.use('/users', require('./users'));//redirect to reviews file

module.exports = router;
