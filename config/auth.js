const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"
        if (!token) throw new Error('Token not found');
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Unauthorized'});
    }
}

module.exports = auth;
