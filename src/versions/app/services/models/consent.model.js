const axios = require('axios');

const createConsent = async (bic, accessToken, date, reqId, userIp, userAgent, consentDetails) => {
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
        'TPP-Redirect-Preferred': true,
        'TPP-Explicit-Authorisation-Preferred': false,
    };

    const { data } = await axios.post(`${process.env.SWEDBANK_API_URL}/sandbox/v5/consents`, consentDetails, {headers, params});

    return data;
}

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
    getConsentStatus,
};