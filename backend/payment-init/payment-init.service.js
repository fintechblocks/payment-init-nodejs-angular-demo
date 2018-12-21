const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var request = require('request');
const API_URL = process.env.API_URL;
const authorizeJs = require('../_helpers/authorize');
const fs = require('fs');
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('./test/private_key.txt');

module.exports = {
  createPayment,
  getPayment,
  getSubmission
};

async function createJWSSignatureHeader(body) {
  var jwt_header = {
    alg: 'RS256',
    kid: '000000000',
    b64: false,
    'http://openbanking.org.uk/iat': new Date().getTime(),
    'http://openbanking.org.uk/iss': 'C=UK, ST=England, L=London, O=Acme Ltd.',
    crit: ['b64', 'http://openbanking.org.uk/iat', 'http://openbanking.org.uk/iss']
  };
  var jws_signature = await jwt.sign(body, PRIVATE_KEY, {
    algorithm: 'RS256',
    header: jwt_header
  });
  return `${jws_signature.split('.')[0]}..${jws_signature.split('.')[2]}`;
}

async function createPayment(req, res) {
  const createPaymentUrl = API_URL + req.url;
  const idempotencyKey = req.headers["x-idempotency-key"];
  const accessToken = await authorizeJs.authorize();

  var signature = await createJWSSignatureHeader(req.body);
  request({
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
  }).pipe(res);
}

async function getPayment(req, res) {
  const accessToken = await authorizeJs.authorize();
  const payment = await authorizeJs.getPayment(req.params[0], accessToken);
  res.send(payment)
}

async function getSubmission(req, res) {
  const getSubmissionUrl = API_URL + req.url;
  const accessToken = await authorizeJs.authorize();
  request({
    headers: {
      'authorization': `bearer ${accessToken}`
    },
    uri: getSubmissionUrl,
    method: req.method,
    json: true
  }).pipe(res);
}




