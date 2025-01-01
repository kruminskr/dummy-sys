const jwt = require('jsonwebtoken');

const generateToken = (accessToken, refreshToken, bic, consents) => {

    const payload = {
        accessToken,
        refreshToken,
        bic,
        consents,
    }

    const secret = process.env.JWT_SECRET

    const options = {
        expiresIn: '5h', 
    };

    const token = jwt.sign(payload, secret, options);

    return token;
}

module.exports = {
    generateToken,
}