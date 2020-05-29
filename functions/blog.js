'use strict';

const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const moment = require('moment');
const utils = require('../utils');

let dynamo = new AWS.DynamoDB.DocumentClient();

const TableName = process.env.BLOG_TABLE;
const BLOG_TABLE_GSI_Inverted = process.env.BLOG_TABLE_GSI_Inverted;
const BLOG_TABLE_GSI_Status = process.env.BLOG_TABLE_GSI_Status;
const BLOG_TABLE_GSI3_PublishedPosts = process.env.BLOG_TABLE_GSI3_PublishedPosts;

const STATUS = {
  new: 'new',
  published: 'published',
  blocked: 'blocked'
};

const newDate = () => moment().format('YYYY-MM-DD HH:mm:ss.SSS');
const putUser = async (event, context, callback) => {
  const { fullname, birthDate, hobbies } = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.claims.sub;
  const email = event.requestContext.authorizer.claims.email;
  const user = {
    PK: `USER#${userId}`,
    SK: `PROFILE#${userId}`,
    fullname,
    email,
    birthDate,
    hobbies,
    createdAt: newDate()
  };
  await dynamo.put({
    TableName,
    Item: user,
  }).promise();
  callback(null, utils.createResponse(200, userId));
};

const putPost = async (event, context, callback) => {
  const { title, body } = JSON.parse(event.body);
  console.log(event.body);
  const userId = event.requestContext.authorizer.claims.sub;
  const postId = uuidv1();
  const date = newDate();
  const post = {
    PK: `USER#${userId}`,
    SK: `POST#${postId}`,
    title,
    body,
    viewsCount: 0,
    postStatusDate: `${STATUS.new}#${date}`,
    createdAt: date
  };
  await dynamo.put({
    TableName,
    Item: post,
  }).promise();
  callback(null, utils.createResponse(200, postId));
};

const putComment = async (event, context, callback) => {
  const postId = event.pathParameters.postId;
  const { body } = JSON.parse(event.body);
  const commentId = uuidv1();
  const comment = {
    PK: `COMMENT#${commentId}`,
    SK: `POST#${postId}`,
    body,
    createdAt: newDate()
  };
  await dynamo.put({
    TableName,
    Item: comment,
  }).promise();
  callback(null, utils.createResponse(200, commentId));
};

const getUserProfile = async (event, context, callback) => {
  const userId = event.pathParameters.userId;
  const { Item } = await dynamo.get({
    TableName,
    Key: {
      PK: `USER#${userId}`,
      SK: `PROFILE#${userId}`,
    }
  }).promise();
  callback(null, utils.createResponse(200, Item));
};

const getPostComments = async (event, context, callback) => {
  const postId = event.pathParameters.postId;
  const result = await dynamo.query({
    TableName,
    IndexName: BLOG_TABLE_GSI_Inverted,
    KeyConditionExpression: 'SK = :sk and begins_with(PK, :pk)',
    ExpressionAttributeValues: {
      ':sk': `POST#${postId}`,
      ':pk': `COMMENT#`
    }
  }).promise();
  callback(null, utils.createResponse(200, result));
};

const getPostsByUser = async (event, context, callback) => {
  const userId = event.pathParameters.userId;
  const result = await dynamo.query({
    TableName,
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':sk': `POST#`
    }
  }).promise();
  callback(null, utils.createResponse(200, result));
};

const getUserPostsByStatus = async (event, context, callback) => {
  const userId = event.pathParameters.userId;
  const status = event.pathParameters.status;
  const date = event.pathParameters.date;
  const result = await dynamo.query({
    TableName,
    IndexName: BLOG_TABLE_GSI_Status,
    KeyConditionExpression: 'PK = :pk and begins_with(postStatusDate, :status)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':status': `${status}#${date}`,
    },
    ScanIndexForward: false
  }).promise();
  callback(null, utils.createResponse(200, result));
};

const getPublishedPosts = async (event, context, callback) => {
  const result = await dynamo.scan({
    TableName,
    IndexName: BLOG_TABLE_GSI3_PublishedPosts,
  }).promise();
  callback(null, utils.createResponse(200, result));
};

module.exports = {
  putUser,
  putPost,
  putComment,
  getUserProfile,
  getPostsByUser,
  getPostComments,
  getUserPostsByStatus,
  getPublishedPosts
};


