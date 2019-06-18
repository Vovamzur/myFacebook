const jwt = require('express-jwt');
const { secretOrKey } = require('./../config/keys');

function getTokenFromHeaders(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

const auth = {
  required: jwt({
    secret: secretOrKey,
    userProperty: 'payload',
    getToken: getTokenFromHeaders
  }),
  optional: jwt({
    secret: secretOrKey,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeaders
  })
};

module.exports = auth;