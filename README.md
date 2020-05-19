# sls-dynamo-cognito
sls-dynamo-cognito

Practice of using technologies:

- [serverless](https://serverless.com)
- AWS lambda
- DynamoDB

### Scripts

- deploy lambda

    `sls deploy`

- run lambda locally

    saveItem:

    `serverless invoke local --function saveItem --data '{ "body": "{ \"thing\": \"Carpet\" }" }'`

    getItems:

    `serverless invoke local --function getItems`
    
    getItem:
    
    `serverless invoke local --function getItem --data '{ "pathParameters": { "itemId": "xxx" } }'`
    
    deleteItem:
    
    `serverless invoke local --function deleteItem --data '{ "pathParameters": { "itemId": "xxx" } }'`
    
    saveItem:
    
    `serverless invoke local -f updateItem -d '{ "pathParameters": { "itemId": "xxx" }, "body": "{ \"paramName\": \"thing\", \"paramValue\": \"Water\" }" }'`
