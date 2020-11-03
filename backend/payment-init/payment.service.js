var request = require('request');
const PAYMENT_INIT_API_URL = process.env.PAYMENT_INIT_API_URL;
const authorizeJs = require('../_helpers/authorize');
const cert = process.env.HTTPS_CLIENT_CERT;
const key = process.env.HTTPS_CLIENT_KEY;

module.exports = {
  createPaymentConsent,
  createPayment,
  getPaymentConsent,
  getPayment,
  getFundConfirmation
};

async function createPaymentConsent(req, res) {
  const createPaymentUrl = PAYMENT_INIT_API_URL + req.url;
  const idempotencyKey = req.headers["x-idempotency-key"];
  const accessToken = await authorizeJs.authorize();
  console.log(`${new Date().toISOString()} | createPaymentConsent | createPaymentConsentUrl: ${createPaymentUrl} | body:`, req.body);
  var signature = await authorizeJs.createJWSSignatureHeader(req.body);
  let options = {
    headers: {
      'authorization': `bearer ${accessToken}`,
      'x-idempotency-key': idempotencyKey,
      'x-jws-signature': signature
    },
    qs: req.query,
    uri: createPaymentUrl,
    body: req.body,
    method: req.method,
    json: true
  };
  if (cert && key) {
    options.cert = cert;
    options.key = key;
  }
  request(options).pipe(res);
}

async function createPayment(req, res) {
  const createPaymentUrl = PAYMENT_INIT_API_URL + req.url;
  const idempotencyKey = req.headers["x-idempotency-key"];
  console.log(`${new Date().toISOString()} | createPayment | createPaymentUrl: ${createPaymentUrl} | body:`, req.body);
  var signature = await authorizeJs.createJWSSignatureHeader(req.body);
  const authorizationTokens = await authorizeJs.getCreatedAuthorizationTokens();
  let options = {
    headers: {
      'authorization': `Bearer ${authorizationTokens.access_token}`,
      'x-idempotency-key': idempotencyKey,
      'x-jws-signature': signature
    },
    qs: req.query,
    uri: createPaymentUrl,
    body: req.body,
    method: req.method,
    json: true
  };
  if (cert && key) {
    options.cert = cert;
    options.key = key;
  }
  request(options).pipe(res);
}

async function getPaymentConsent(req, res) {
  const access_token = await authorizeJs.authorize();
  const getPaymentConsentUrl = PAYMENT_INIT_API_URL + req.url;
  let options = {
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    uri: getPaymentConsentUrl,
    method: 'GET',
    json: true
  };
  if (cert && key) {
    options.cert = cert;
    options.key = key;
  }
  request(options).pipe(res);
}

async function getPayment(req, res) {
  const getPaymentUrl = PAYMENT_INIT_API_URL + req.url;
  console.log(`${new Date().toISOString()} | getSubmission | getSubmissionUrl: ${getPaymentUrl}`);
  const accessToken = await authorizeJs.authorize();
  let options = {
    headers: {
      'authorization': `bearer ${accessToken}`
    },
    uri: getPaymentUrl,
    method: req.method,
    json: true
  };
  if (cert && key) {
    options.cert = cert;
    options.key = key;
  }
  request(options).pipe(res);
}

async function getFundConfirmation(req, res) {
  const getFundConfirmationUrl = PAYMENT_INIT_API_URL + req.url;
  console.log(`${new Date().toISOString()} | getSubmission | getSubmissionUrl: ${getFundConfirmationUrl}`);
  const authorizationTokens = await authorizeJs.getCreatedAuthorizationTokens();
  let options = {
    headers: {
      'authorization': `Bearer ${authorizationTokens.access_token}`
    },
    uri: getFundConfirmationUrl,
    method: req.method,
    json: true
  };
  if (cert && key) {
    options.cert = cert;
    options.key = key;
  }
  request(options).pipe(res);
}
