const jose = require('node-jose');
const fs = require('fs');
const crypto = require('crypto');
const {
  expect
} = require('chai');
const {
  Issuer
} = require('openid-client');
var request = require('request-promise');
const WELL_KNOWN_URL = process.env.WELL_KNOWN_URL;
const REDIRECT_URL = process.env.REDIRECT_URL;
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('./test/private_key.txt');

module.exports = {
  authorize,
  getAuthorizationUrl,
  createPaymentSubmission,
  getPayment
};
var client;

createClient().catch(function(error) {
  console.log('An unexpected error occured while creating client: ', error);
});

async function createClient() {
  Issuer.defaultHttpOptions = { timeout: 120000 };
  const issuer = await Issuer.discover(WELL_KNOWN_URL);
  const keystore = jose.JWK.createKeyStore();

  await keystore.add(PRIVATE_KEY, 'pem');

  client = new issuer.Client({
    client_id: process.env.CLIENT_ID || 'ftb-demo-app@payment-init',
    token_endpoint_auth_method: 'private_key_jwt',
    request_object_signing_alg: 'RS256'
  }, keystore);

  client.CLOCK_TOLERANCE = 10;

  console.log("Client created");
}

async function authorize() {
  const accessTokenWithClientCredentials = await client.grant({
    grant_type: 'client_credentials',
    scope: "payments"
  });

  return accessTokenWithClientCredentials.access_token;
}

async function getAuthorizationUrl(req, res) {
  const paymentId = req.query.PaymentId;
  const requestObject = await client.requestObject({
    redirect_uri: REDIRECT_URL,
    claims: {
      userinfo: {
        openbanking_intent_id: {
          value: paymentId
        }
      },
      id_token: {
        openbanking_intent_id: {
          value: paymentId
        }
      }
    }
  });


  const url = client.authorizationUrl({
    scope: 'openid payments',
    redirect_uri: REDIRECT_URL,
    response_type: 'code',
    state: paymentId,
    request: requestObject
  });
  res.json(url);
}

async function createPaymentSubmission(req, res) {
  const params = req.body;
  const paymentId = params.state;
  const authorizationTokens = await postAuthenticationCode(params);
  const paymentData = await getPayment(paymentId, authorizationTokens.access_token);
  const submission = await createSubmission(paymentData, authorizationTokens);

  res.json(submission);
}

async function getPayment(paymentId, access_token) {
  const getPaymentUrl = `${API_URL}/open-banking/v1.1/payments/${encodeURIComponent(String(paymentId))}`;
  return await request({
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    uri: getPaymentUrl,
    method: 'GET',
    json: true
  });
}

async function postAuthenticationCode(params) {
  const authorizationTokens = await client.authorizationCallback(REDIRECT_URL, params, {
    state: params.state
  });

  return authorizationTokens;
}

async function createSubmission(paymentData, authorizationTokens){
  const createSubmissionUrl = `${API_URL}/open-banking/v1.1/payment-submissions`;
  const query = paymentData;
  const x_idempotency_key = crypto.randomBytes(12).toString('hex');

  let requestBody = {'Data' : {
    'PaymentId': paymentData.Data.PaymentId,
    'Initiation':  paymentData.Data.Initiation  
  }, 'Risk': paymentData.Risk};

  return await request({
    headers: {
      'Authorization': `Bearer ${authorizationTokens.access_token}`,
      'x-idempotency-key': x_idempotency_key,
    },
    uri: createSubmissionUrl,
    body: requestBody,
    method: 'POST',
    json: true
  });
}