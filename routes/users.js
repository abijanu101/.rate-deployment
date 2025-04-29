const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { poolPromise } = require('../db');

router.post('/login', async (req, res) => {
    const { email, pw } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', email)
            .input('pw', pw)
            .query('SELECT id, isAdmin FROM Users WHERE email = @email AND pw = @pw');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.recordset[0];
        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin === 'Y' ? true : false
            },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
