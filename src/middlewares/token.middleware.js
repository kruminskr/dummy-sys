const jose = require('jose');

// Middleware to verify the token and extract the accessToken, refreshToken, bic and consents
const tokenMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

        const { plaintext } = await jose.compactDecrypt(token, secretKey);

        const decoded = JSON.parse(new TextDecoder().decode(plaintext));

        req.accessToken = decoded.accessToken;
        req.refreshToken = decoded.refreshToken;
        req.bic = decoded.bic
        req.consents = decoded.consents || {};

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).send('Unauthorized');
    }

}


module.exports = tokenMiddleware;