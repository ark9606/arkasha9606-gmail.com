'use strict';

const uuidv1 = require('uuid/v1');
const db = require('./database');
const utils = require('./utils');

const saveItem = async (event, context, callback) => {
  const item = JSON.parse(event.body);
  console.log(item);
  item.id = uuidv1();
  item.createdAt = new Date().toISOString();

  const res = await db.saveItem(item);
  console.log(res);
  callback(null, utils.createResponse(200, res));
};

const getItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;
  console.log(itemId);

  const res = await db.getItem(itemId);
  console.log(res);
  callback(null, utils.createResponse(200, res));
};

const getItems = async (event, context, callback) => {
  const items = await db.getItems();
  console.log(items);
  callback(null, utils.createResponse(200, items));
};

const deleteItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;

  await db.deleteItem(itemId);
  callback(null, utils.createResponse(200, 'Item was deleted'));
};

const updateItem = async (event, context, callback) => {
  const itemId = event.pathParameters.itemId;

  const body = JSON.parse(event.body);

  try {
    const res = await db.updateItem(itemId, body);
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
};


