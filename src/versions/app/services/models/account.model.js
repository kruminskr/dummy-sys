const axios = require('axios');

// Get all accounts that the user has access to
const getAccounts = async (bic, accessToken, consentId, date, reqId) => {
    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
        withBalance: 'false',
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

// Get detailed data about an account
const getAccount = async (bic, accessToken, consentId, date, reqId, accountId) => {
    const params = {
        bic,
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

// Get the balance of an account
const getAccountBalance = async (bic, accessToken, consentId, date, reqId, accountId) => {
    const params = {
        bic,
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

// Get the transactions of an account
const getAccountTransactions = async (bic, accessToken, consentId, date, reqId, accountId, dateFrom, dateTo, status, pageId) => {
    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
        dateFrom,
        dateTo,
        withBalance: true,
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