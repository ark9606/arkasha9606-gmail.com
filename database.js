'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE;

class DB {
  params;

  constructor() {
    this.params = { TableName: TABLE_NAME };
  }

  saveItem(item) {
    const params = {
      ...this.params,
      Item: item
    };

    return dynamo.put(params).promise().then(() => {
      return item.id;
    });
  }

  getItem(itemId) {
    const params = {
      ...this.params,
      Key: {
        id: itemId
      },
    };

    return dynamo.get(params).promise().then(result => {
      return result.Item;
    });
  }

  getItems() {
    const params = {
      ...this.params,
      FilterExpression: "attribute_exists(id)",
    };
    return dynamo.scan(params).promise().then(res => res.Items);
  }

  deleteItem(itemId) {
    const params = {
      ...this.params,
      Key: {
        id: itemId
      },
    };

    return dynamo.delete(params).promise();
  }

  updateItem(itemId, paramsName, paramsValue) {
    const params = {
      ...this.params,
      Key: {
        id: itemId,
      },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set ' + paramsName + ' = :v',
      ExpressionAttributeValues: {
        ':v': paramsValue
      },
      ReturnValues: 'ALL_NEW'
    };

    return dynamo.update(params).promise().then(response => {
      return response.Attributes;
    });
  }
}

module.exports = new DB();
