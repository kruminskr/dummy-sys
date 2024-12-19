const jwt = require('jsonwebtoken');

const generateToken = (accessToken, consents) => {

    const payload = {
        accessToken,
        consents,
    }


    const secret = process.env.JWT_SECRET

    const options = {
        expiresIn: '1h', 
    };

    const token = jwt.sign(payload, secret, options);

    return token;
}

module.exports = {
    generateToken,
}