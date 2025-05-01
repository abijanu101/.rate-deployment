const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { sql, poolPromise } = require('../db');

router.post('/login', async (req, res) => {
    const { email, pw } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar(sql.MAX), email)
            .input('pw', sql.VarChar(sql.MAX), pw)
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





const { verifyToken } = require('../auth');

router.get('/me', verifyToken, async (req, res) => {
    const { id } = req.user;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id, username, isAdmin FROM Users WHERE id = @id');
        res.json(result.recordset[0]);
    }
    catch (e) { res.status(500).send(e); }

});

module.exports = router;
