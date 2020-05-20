'use strict';

const db = require('./database');
const utils = require('./utils');

const saveItem = async (event, context, callback) => {
  const item = JSON.parse(event.body);
  item.user_sub = event.requestContext.authorizer.claims.sub;

  const res = await db.insertItem(item);
  console.log(res);
  callback(null, utils.createResponse(200, res));
};

const getItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;
  const user_sub = event.requestContext.authorizer.claims.sub;
  console.log(itemId);

  const res = await db.getItem(itemId, user_sub);
  console.log(res);
  callback(null, utils.createResponse(200, res));
};

const getItems = async (event, context, callback) => {
  const user_sub = event.requestContext.authorizer.claims.sub;
  console.log(user_sub);

  const items = (await db.getItems(user_sub)).map(item => {
    item.createdAt = new Date(item.createdAt).toISOString();
    return item;
  });
  console.log(items);
  callback(null, utils.createResponse(200, items));
};

const getAllItems = async (event, context, callback) => {
  const items = await db.getAllItems();
  console.log(items);
  callback(null, utils.createResponse(200, items));
};

const deleteItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;
  const user_sub = event.requestContext.authorizer.claims.sub;

  await db.deleteItem(itemId, user_sub);
  callback(null, utils.createResponse(200, 'Item was deleted'));
};

const updateItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;
  const user_sub = event.requestContext.authorizer.claims.sub;

  const body = JSON.parse(event.body);

  try {
    const res = await db.updateItem(itemId, user_sub, body);
    callback(null, utils.createResponse(200, res));
  } catch (e) {
    callback(null, utils.createResponse(e.statusCode, e.message));
  }
};

module.exports = {
  saveItem,
  getItem,
  getItems,
  deleteItem,
  updateItem,
  getAllItems
};


