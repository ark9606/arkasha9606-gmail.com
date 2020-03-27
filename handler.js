'use strict';
const items = require('./items');

module.exports = {
  saveItem: items.saveItem,
  getItem: items.getItem,
  getItems: items.getItems,
  deleteItem: items.deleteItem,
  updateItem: items.updateItem,
};
