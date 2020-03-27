global.fetch = require('node-fetch');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

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
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken();
        cognitoUser.getUserAttributes(function (err, data) {
          if (err) {
            reject(err);
          }
          const user = data.reduce((prev, curr) => ({...prev, [curr.getName()]: curr.getValue()}), {});
          resolve({user, idToken});
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

module.exports = {
  login,
  register
};
