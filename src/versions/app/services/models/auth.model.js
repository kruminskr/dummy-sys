const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

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
    // return data.authorizeId
}

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

const checkAuthStatus = async (bic, psuId, authId) => {
    try {
        const poll = async () => {
            const state = await decoupledAuthState(bic, psuId, authId)
    
            if (state.scaStatus === "finalised") {
                return state.authorizationCode;
            }
    
            await new Promise(resolve => setTimeout(resolve, 3000));
            return poll(); 
        }
    
        return await poll();
    } catch (error) {
        return error?.response?.data?.tppMessages || error
    } 
}

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

    console.log(data)   


    return data;
}

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