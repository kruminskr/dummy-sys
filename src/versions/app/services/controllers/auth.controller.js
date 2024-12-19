// const AuthModel = require('../models/auth.model');

const { generateToken } = require('../../../../services/token');

const handleAuthCallback = async (req, res) => {
    try {
        const { accessToken } = req.user;

        const token = generateToken(accessToken, {});


        // mosh var kaut ko diskrētāk padot
        res.redirect(`${process.env.APP_URL}/account/?token=${token}`);
    } catch (error) {
        res.redirect('http://localhost:5173/');
    }
}

module.exports = {
    handleAuthCallback 
}