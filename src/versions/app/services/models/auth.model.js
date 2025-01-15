const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Get the available authentication methods in the specified country
const getAuthMethods = async (bic, TPPRedirect) => {
    const params = {
        bic
    }

    const headers = {
        "TPP-Redirect-Preferred": TPPRedirect
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/psd2/v5/available-authentication-methods`, {headers, params});

    return data.authenticationMethods;
}

// Initiate decoupled authentication process
const initiateDecoupledAuth = async (bic, psuId, authMethod, personalID, phoneNumber) => {
    const date = new Date().toUTCString()
    const reqId = uuidv4();

    const params = {
        client_id: process.env.SWEDBANK_CLIENT_ID,
        bic
    }

    const headers = {
        "PSU-ID": psuId,
        date,
        "X-Request-ID": reqId
    }

    const psuData = phoneNumber ? { phoneNumber } : { personalID };


    const body = {
        authenticationMethodId: authMethod,
        clientID: process.env.SWEDBANK_CLIENT_ID,
        psuData,
        redirectUri: process.env.SWEDBANK_CALLBACK_URL,
        scope: process.env.SWEDBANK_API_SCOPE
    }

    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/psd2/v5/authorize-decoupled`, body, {headers, params});

    return data
}

// Get the state of the decoupled authentication process
const decoupledAuthState = async (bic, psuId, authId) => {
    const date = new Date().toUTCString()
    const reqId = uuidv4();

    const params = {
        client_id: process.env.SWEDBANK_CLIENT_ID,
        bic
    }

    const headers = {
        "PSU-ID": psuId,
        date,
        "X-Request-ID": reqId
    }

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/psd2/v5/authorize-decoupled/authorize/${authId}`, {headers, params});

    return data
}

// Check the status of the decoupled authentication process every 3 seconds and return when finalised or failed
const checkAuthStatus = async (bic, psuId, authId) => {
    const poll = async () => {
        const state = await decoupledAuthState(bic, psuId, authId)

        if (state.scaStatus === "finalised") {
            return state.authorizationCode;
        }

        if (state.scaStatus === "failed") {
            throw new Error("Authentication failed");
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        return poll(); 
    }

    return await poll();
}

// Get the access token using the authorization code
const getAuthToken = async (bic, credentials, authCode) => {
    const headers = {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    const body = {
        bic,
        scope: process.env.SWEDBANK_API_SCOPE,
        redirect_uri: process.env.SWEDBANK_CALLBACK_URL,
        grant_type: "authorization_code",
        code: authCode
    }

    
    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/psd2/token`, body, {headers});


    return data;
}

// Get a new access token using the refresh token
const getRefreshToken = async (date, reqId, accessToken, refreshToken) => {
    const params = {
        client_id: process.env.SWEDBANK_CLIENT_ID,
        client_secret: process.env.SWEDBANK_CLIENT_SECRET,  
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        access_token: accessToken,
        redirect_uri: process.env.SWEDBANK_CALLBACK_URL,
    }

    const headers = {
        date,
        "X-Request-ID": reqId,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    
    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/psd2/token`, {}, {headers, params});

    return data;
}

module.exports = {
    getAuthMethods,
    initiateDecoupledAuth,
    decoupledAuthState,
    checkAuthStatus,
    getAuthToken,
    getRefreshToken,
}