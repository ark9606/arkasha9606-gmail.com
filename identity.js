global.fetch = require('node-fetch');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const jwtDecode = require('jwt-decode');

const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.APP_CLIENT_ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const login = body => {
  const userName = body.email;
  const password = body.password;
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: userName,
    Password: password
  });
  const userData = {
    Username: userName,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        const tokens = getTokens(session);
        cognitoUser.getUserAttributes(function (err, data) {
          if (err) {
            reject(err);
          }
          const user = data.reduce((prev, curr) => ({...prev, [curr.getName()]: curr.getValue()}), {});
          resolve({ user, ...tokens });
        });
      },
      onFailure: err => reject(err)
    })
  });
};

const register = body => {
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const attributeList = [];

  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: name }));
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result.user);
    })
  });
};

const refreshToken = body => {
  const { idToken, refreshToken } = body;
  const userData = jwtDecode(idToken);
  const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken });
  const user = new AmazonCognitoIdentity.CognitoUser({Pool: userPool, Username: userData.email});
  return new Promise(resolve => {
    user.refreshSession(RefreshToken, (err, session) => {
      if (err) throw err;
      const tokens = getTokens(session);
      resolve(tokens);
    });
  });
};

function getTokens(session) {
  return {
    accessToken: session.getAccessToken().getJwtToken(),
    idToken: session.getIdToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken()
  };
}

module.exports = {
  login,
  register,
  refreshToken
};
