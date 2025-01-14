const axios = require('axios');

// handles consent creation for globas consents and detailed consents
const createConsent = async (bic, accessToken, date, reqId, userIp, userAgent, consentDetails, redirect, authorisation) => {
    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'PSU-IP-Address': userIp,
        'PSU-User-Agent': userAgent,
        'TPP-Redirect-URI': `${process.env.REDIRECT_URL}/api/app/consent/callback`,
        'TPP-Nok-Redirect-URI': `${process.env.REDIRECT_URL}/api/app/consent/callback/fail`,
        'TPP-Redirect-Preferred': redirect,
        'TPP-Explicit-Authorisation-Preferred': authorisation,
    };

    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents`, consentDetails, {headers, params});

    return data;
}

// handles authorisation process - returns authorisation ID and available methods
const startAuthorisation = async (bic, accessToken, consentId, userIp, userAgent) => {
    const date = new Date().toUTCString()
    const reqId = 1; 

    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
        'PSU-IP-Address': userIp,
        'PSU-User-Agent': userAgent,
        'TPP-Redirect-Preferred': 'false',
    };

    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents/${consentId}/authorisations`, {}, {headers, params});

    return data;
}

// handles SCA process - initiates SCA process in users device
const startSCA = async (bic, accessToken, consentId, authorisationId, body) => {
    const date = new Date().toUTCString()
    const reqId = 1; 

    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,

    };

    // when Swedbank handles request it initiates the SCA process in users device
    const { data } = await axios.put(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents/${consentId}/authorisations/${authorisationId}`, body, {headers, params});

    return data;
}

// handles the retrieval of SCA status
const getScaStatus = async (accessToken, bic, consentId, authorisationId) => {
    const date = new Date().toUTCString()
    const reqId = 1; 

    const params = {
        bic,
        'app-id': process.env.SWEDBANK_CLIENT_ID,
    };

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Date: date,
        'X-Request-ID': reqId,
    };

    const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents/${consentId}/authorisations/${authorisationId}`, {headers, params});

    return data;
}


// check SCA status every 3 seconds - when user signs consent returns
const checkScaStatus = async (accessToken, bic, consentId, authorisationId) => {
    const poll = async () => {
        const status = await getScaStatus(accessToken, bic, consentId, authorisationId);


        if (status.scaStatus === 'finalised') {
            return;
        }

        if (status.scaStatus === 'failed') {
            throw new Error('SCA failed');
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        return poll(); 
    };

    await poll(); 
};


// get consent status - returns consent status
const getConsentStatus = async (bic, accessToken, date, reqId, consentId) => {
  const params = {
      bic,
      'app-id': process.env.SWEDBANK_CLIENT_ID,
  };

  const headers = {
      Authorization: `Bearer ${accessToken}`,
      Date: date,
      'X-Request-ID': reqId,
  } 

  const { data } = await axios.get(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents/${consentId}/status`, {headers, params});

  return data.consentStatus;
}

module.exports = {  
    createConsent,
    startAuthorisation,
    startSCA,
    checkScaStatus,
    getConsentStatus,
};