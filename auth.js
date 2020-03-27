'use strict';

const utils = require('./utils');
const identity = require('./identity');

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const signIn = async (event, context, callback) => {
  const credentials = JSON.parse(event.body);
  console.log(credentials);

  try {
    const res = await identity.login(credentials);
    console.log(res);
    callback(null, utils.createResponse(200, res));
  } catch (e) {
    callback(null, utils.createResponse(500, e));
  }
};

const signUp = async (event, context, callback) => {
  const userData = JSON.parse(event.body);

  try {
    const res = await identity.register(userData);
    console.log(res);
    callback(null, utils.createResponse(200, res));
  } catch (e) {
    callback(null, utils.createResponse(500, e));
  }
};

const preSignUp = (event, context, callback) => {
  event.response.autoConfirmUser = true;
  callback(null, event);
};

module.exports = {
  signIn,
  signUp,
  preSignUp
};


