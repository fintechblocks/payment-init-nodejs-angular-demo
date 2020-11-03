'use strict';

const jose = require('node-jose');
const {
  Issuer
} = require('openid-client');
const jwt = require('jsonwebtoken');
const q = require('q');

module.exports = {
  createClient: createClient,
  jwtSign: jwtSign,
  decodeJwt: decodeJwt
}

async function createClient(clientId, privateKey, tokenEndpointUri, authEndpointUri, issuer, jwksUri, keyID, clientCert, clientKey) {
  await checkKeyBitLength(privateKey);
  let options = {
    timeout: 120000,
    rejectUnauthorized: false
  }
  if (clientCert && clientKey) {
    options.cert = clientCert;
    options.key = clientKey;
  }
  Issuer.defaultHttpOptions = options;

  const token_endpoint_auth_signing_alg_values_supported = ["RS256"];
  const createdIssuer = new Issuer({
    token_endpoint: tokenEndpointUri,
    authorization_endpoint: authEndpointUri,
    token_endpoint_auth_signing_alg_values_supported: token_endpoint_auth_signing_alg_values_supported,
    issuer: issuer,
    jwks_uri: jwksUri
  });

  const keystore = jose.JWK.createKeyStore();
  const generatedKeyJson = await generateKeyStoreJson(privateKey, keyID);
  await keystore.add(generatedKeyJson);
  var client = new createdIssuer.Client({
    client_id: clientId,
    token_endpoint_auth_method: 'private_key_jwt',
    request_object_signing_alg: 'RS256'
  }, keystore);

  client.CLOCK_TOLERANCE = 10;
  return client;
}

async function generateKeyStoreJson(privateKey, keyID) {
  const key = await jose.JWK.asKey(privateKey, 'pem');
  const keyJson = key.toJSON(true);
  keyJson.kid = keyID;
  return keyJson;
}

function jwtSign(payload, secret, options) {
  var deferred = q.defer();
  jwt.sign(payload, secret, options, function (err, signature) {
    if (err) deferred.reject(err);
    else deferred.resolve(signature);
  });
  return deferred.promise;
}

function decodeJwt(token) {
  return jwt.decode(token, {
    complete: true
  });
}

async function checkKeyBitLength(privateKey) {
  var keystore = jose.JWK.createKeyStore();
  var key = await keystore.add(privateKey, 'pem');
  if (key.length < 2048) throw new Error(`The signing key's size is ${key.length} bits which is not secure enough for the RS256 algorithm. See https://tools.ietf.org/html/rfc7518#section-3.3 for more information.`);
}