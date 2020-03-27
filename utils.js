'use strict';

const createResponse = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify(message),
  };
};

module.exports = {
  createResponse,
};
