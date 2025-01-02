const consentModel = require('../models/consent.model');

const { generateToken } = require('../../../../services/token');

var consentId; // varbút sim ir labaka alternativa
var accountId;

const redirectConsent = async (req, res) => {
    try {
        const consents = req.consents

        const accessToken = req.accessToken;
        const refreshToken = req.refreshToken
        const bic = req.bic

        const date = new Date().toUTCString()
        const reqId = 1; 
        const userIp = req.ip;
        const userAgent = req.headers['user-agent'];

        const redirect = true;
        const authorisation = false

        const consentDetails = req.body.consentDetails;

        const consent = await consentModel.createConsent(bic, accessToken, date, reqId, userIp, userAgent, consentDetails, redirect, authorisation);

        accountId = req.body?.accountId || consentDetails?.access?.availableAccounts;
        consents[accountId] = consent.consentId;

        consentId = consent.consentId;

        const token = generateToken(accessToken, refreshToken, bic, consents);
        consent.token = token;

        res.status(200).json(consent);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const decoupledConsent = async (req, res) => {
    try {
        const consents = req.consents

        const accessToken = req.accessToken;
        const refreshToken = req.refreshToken
        const bic = req.bic

        const date = new Date().toUTCString()
        const reqId = 1; 
        const userIp = req.ip;
        const userAgent = req.headers['user-agent'];

        const redirect = false;
        const authorisation = true;

        const consentDetails = req.body.consentDetails;

        // create consent
        const consent = await consentModel.createConsent(bic, accessToken, date, reqId, userIp, userAgent, consentDetails, redirect, authorisation);

        // start authorisation
        const consentData = await consentModel.startAuthorisation(bic, accessToken, consent.consentId, userIp, userAgent)

        accountId = req.body.accountId;
        consents[accountId] = consent.consentId;

        const token = generateToken(accessToken, refreshToken, bic, consents);
        consentData.token = token;

        res.status(200).json(consentData);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

// specify method and start SCA (Strong Customer Authentication)
const startSCA = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const bic = req.bic

        const authorisationId = req.body.authorisationId
        const body = req.body.info

        const accountId = req.body.accountId;
        const consentId = req.consents[accountId];

        const scaData = await consentModel.startSCA(bic, accessToken, consentId, authorisationId, body)

        return res.json(scaData);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const checkScaStatus = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const bic = req.bic

        const authorisationId = req.body.authorisationId

        const accountId = req.body.accountId;
        const consentId = req.consents[accountId];

        await consentModel.checkScaStatus(accessToken, bic, consentId, authorisationId);

        console.log('back')

        return res.status(200).send()
    } catch (error) {
        res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const handleConsentCallback = async (req, res) => {
    try {
        // const accessToken = req.user.accessToken;
        const bic = req.bic;

        const date = new Date().toUTCString()
        const reqId = 1;

        // const consentStatus = await consentModel.getConsentStatus(bic, accessToken, date, reqId, consentId);

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
    redirectConsent,
    decoupledConsent,
    startSCA,
    checkScaStatus,
    handleConsentCallback, 
}