const { v4: uuidv4 } = require('uuid');

const accountModel = require('../models/account.model');

const getAccounts = async (req, res) => {
    try {
        const accessToken = req.accessToken;
        const consentId = req.consents["allAccounts"];

        const bic = req.bic
        
        const date = new Date().toUTCString()
        const reqId = uuidv4();

        const accounts = await accountModel.getAccounts(bic, accessToken, consentId, date, reqId);

        return res.json(accounts);
    } catch (error){
        console.error(error?.response?.data?.tppMessages || error);
        return res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const getAccount = async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const accessToken = req.accessToken;
        const consentId = req.consents[accountId];

        const bic = req.bic
    
        const date = new Date().toUTCString()
        const reqId = uuidv4();;
    
        const account = await accountModel.getAccount(bic, accessToken, consentId, date, reqId, accountId);
    
        return res.json(account);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        return res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const getAccountBalance = async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const accessToken = req.accessToken;
        const consentId = req.consents[accountId];

        const bic = req.bic

        const date = new Date().toUTCString()
        const reqId = uuidv4();
        
        const accountBalance = await accountModel.getAccountBalance(bic, accessToken, consentId, date, reqId, accountId);

        return res.json(accountBalance);
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        return res.status(500).send(error?.response?.data?.tppMessages || error);
    }
}

const getAccountTransactions = async (req, res) => {
    try {
        const accountId = req.params.accountId;

        const accessToken = req.accessToken;
        const consentId = req.consents[accountId];

        const bic = req.bic

        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const status = req.body.status;
        const pageId = req.body.pageId;

        const date = new Date().toUTCString()
        const reqId = uuidv4();;

        const accountTransactions = await accountModel.getAccountTransactions(bic, accessToken, consentId, date, reqId, accountId, dateFrom, dateTo, status, pageId);

        return res.json(accountTransactions)
    } catch (error) {
        console.error(error?.response?.data?.tppMessages || error);
        return res.status(500).json(error?.response?.data?.tppMessages || error);
    }
}


module.exports = {
    getAccounts,
    getAccount,
    getAccountBalance,
    getAccountTransactions,
}