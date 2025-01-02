const axios = require('axios');

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
        'TPP-Redirect-Preferred': redirect,
        'TPP-Explicit-Authorisation-Preferred': authorisation,
    };

    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents`, consentDetails, {headers, params});

    return data;
}

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

    console.log('body', body);

    const { data } = await axios.put(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents/${consentId}/authorisations/${authorisationId}`, body, {headers, params});

    return data;
}

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


const checkScaStatus = async (accessToken, bic, consentId, authorisationId) => {
    try {
        const poll = async () => {
            const status = await getScaStatus(accessToken, bic, consentId, authorisationId);


            if (status.scaStatus === 'finalised') {
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
            return poll(); 
        };

        await poll(); 
    } catch (error) {
        return error?.response?.data?.tppMessages || error
    }
};


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