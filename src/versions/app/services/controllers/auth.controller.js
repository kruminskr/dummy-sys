const { v4: uuidv4 } = require('uuid');

const AuthModel = require('../models/auth.model');

const passport = require('../../../../config/passport')

const { generateToken } = require('../../../../services/token');

var bic;

const getAuthMethods = async (req, res) => {
    try {
        bic = req.body.bic;
        
        const TPPRedirect = req.body.redirect;

        const methods = await AuthModel.getAuthMethods(bic, TPPRedirect)

        return res.json(methods)
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const redirectAuth = async (req, res) => {
    try {
        passport.authenticate('oauth2', {
            state: JSON.stringify({ bic }), 
        })(req, res);
    } catch (error) {
        res.status(500).send(error?.response?.data?.tppMessages || error.message);
    }
}

const initiateDecoupledAuth = async (req, res) => {
    try {
        const authMethod = req.body.authMethod;
        const psuId = req.body.userId;
        var personalID;
        var phoneNumber;

        if (authMethod === "EPARAKSTS_MOBILE") {
            personalID = req.body.personalCode
        }

        if (authMethod === "MOBILE_ID") {
            phoneNumber = req.body.phoneNumber
        }

        const authData = await AuthModel.initiateDecoupledAuth(bic, psuId, authMethod, personalID, phoneNumber) 

        return res.json(authData);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error.message);
        res.status(500).send(error?.response?.data?.tppMessages || error.message);
    }
}

const decoupledAuthStatus = async (req, res) => {
    try {
        const psuId = req.body.userId;
        const authId = req.body.authId;

        const credentials = btoa(process.env.SWEDBANK_CLIENT_ID + ":" + process.env.SWEDBANK_CLIENT_SECRET);

        // check if authStatus is finalised every 3 seconds
        const authCode = await AuthModel.checkAuthStatus(bic, psuId, authId)

        // exchanges auth code for auth token
        const authData = await AuthModel.getAuthToken(bic, credentials, authCode)

        const accessToken = authData.access_token
        const refreshToken = authData.refresh_token

        const token = generateToken(accessToken, refreshToken, bic, {});

        return res.json(token);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error.message);
        res.status(500).send(error?.response?.data?.tppMessages || error.message);
    }
}

const getRefreshToken = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const refreshToken = req.refreshToken
        const bic = req.bic
        const consents = req.consents

        const date = new Date().toUTCString()
        const reqId = uuidv4();

        const newTokenData = await AuthModel.getRefreshToken(date, reqId, accessToken, refreshToken);

        const token = generateToken(newTokenData.access_token, newTokenData.refresh_token, bic, consents);

        return res.json(token);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const handleAuthCallback = async (req, res) => {
    try {
        const { accessToken } = req.user;
        const { refreshToken } = req.user;
        const { bic } = req.user

        const token = generateToken(accessToken, refreshToken, bic, {});

        res.redirect(`${process.env.APP_URL}/account/?token=${token}`);
    } catch (error) {
        res.redirect('http://localhost:5173');
    }
}

module.exports = {
    getAuthMethods,
    redirectAuth,
    initiateDecoupledAuth,
    decoupledAuthStatus,
    getRefreshToken,
    handleAuthCallback 
}