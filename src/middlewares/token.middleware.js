const jwt = require('jsonwebtoken');

const tokenMiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        if (!decoded.accessToken) {
            return res.status(401).json({ error: 'Unauthorized: Missing accessToken in token' });
        }

        req.accessToken = decoded.accessToken;
        req.refreshToken = decoded.refreshToken;
        req.bic = decoded.bic
        req.consents = decoded.consents || {};
    
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send('Unauthorized');
    }
}

module.exports = tokenMiddleware;