const jose = require('jose');

// // generates session token
const generateToken = async (accessToken, refreshToken, bic, consents) => {
    try {
        const payload = {
            accessToken,
            refreshToken,
            bic,
            consents,
        };

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .encrypt(secretKey);

        return token;
    } catch (error) {
        console.error(error.message);
        return;
    }
}

module.exports = {
    generateToken,
}
