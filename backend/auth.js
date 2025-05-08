const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['x-auth-token'];

    if (!authHeader) return res.status(403).json({ message: 'Token missing' });

    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        req.user = decoded; // { id, isAdmin }
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

function isAdmin(req, res, next) {
    const authHeader = req.headers['x-auth-token'];

    if (!authHeader) return res.status(403).json({ message: 'Token missing' });
    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        req.user = decoded; // { id, isAdmin }
        if (decoded.isAdmin) return next();

    } catch (err) {}
    res.status(403).json({ message: 'Admin Access Only' });
}

module.exports = { verifyToken, isAdmin };
