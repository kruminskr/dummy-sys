const consentModel = require('../models/consent.model');

const { generateToken } = require('../../../../services/token');

var consentId; // varbút sim ir labaka alternativa
var accountId;

const createConsent = async (req, res) => {
    try {
        const consents = req.consents
        const accessToken = req.accessToken;
        const date = new Date().toUTCString()
        const reqId = 1; 
        const userIp = req.ip;
        const userAgent = req.headers['user-agent'];

        const consentDetails = req.body.consentDetails;


        const consent = await consentModel.createConsent(accessToken, date, reqId, userIp, userAgent, consentDetails);

        accountId = req.body?.accountId || consentDetails?.access?.availableAccounts;
        consents[accountId] = consent.consentId;

        consentId = consent.consentId;

        const token = generateToken(accessToken, consents);
        consent.token = token;

        res.status(200).json(consent);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const handleConsentCallback = async (req, res) => {
    try {
        const accessToken = req.user.accessToken;
        const date = new Date().toUTCString()
        const reqId = 1;

        // const consentStatus = await consentModel.getConsentStatus(accessToken, date, reqId, consentId);

        // if (consentStatus !== 'valid') {
        //     return res.status(400).redirect(`${process.env.APP_URL}/account`);
        // }

        return res.status(200).redirect(`${process.env.APP_URL}/account/${accountId}/balance`);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        return res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

module.exports = {
    createConsent,
    // signConsent,
    handleConsentCallback, 
}