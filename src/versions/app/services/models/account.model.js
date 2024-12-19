const axios = require('axios');

const getAccounts = async (accessToken, consentId, date, reqId) => {
    const params = {
        bic: process.env.SWEDBANK_BIC,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
        withBalance: false,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'Consent-ID': consentId,
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/accounts`, {headers, params});

    return data;
}

const getAccount = async (accessToken, consentId, date, reqId, accountId) => {
    const params = {
        bic: process.env.SWEDBANK_BIC,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
        withBalance: false,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'Consent-ID': consentId,
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/accounts/${accountId}`, {headers, params});

    return data;
}

const getAccountBalance = async (accessToken, consentId, date, reqId, accountId) => {
    const params = {
        bic: process.env.SWEDBANK_BIC,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'Consent-ID': consentId,
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/accounts/${accountId}/balances`, { params, headers });

    return data;
}

const getAccountTransactions = async (accessToken, consentId, date, reqId, accountId, dateFrom, dateTo, status, pageId) => {
    const params = {
        bic: process.env.SWEDBANK_BIC,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
        dateFrom,
        dateTo,
        withBalance: false,
        bookingStatus: status, 
        statementFormat: 'json',
        pageSize: 5,
        pageId: pageId || null
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'Consent-ID': consentId,
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/accounts/${accountId}/transactions`, {headers, params});

    return data;
}

module.exports = {
    getAccounts,
    getAccount,
    getAccountBalance,
    getAccountTransactions,
};