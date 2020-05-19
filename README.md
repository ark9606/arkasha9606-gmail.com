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

    save:

    `serverless invoke local --function saveItem --data '{ "body": "{ \"thing\": \"Carpet\" }" }'`

    get all:

    `serverless invoke local --function getItems`
    
    get one:
    
    `serverless invoke local --function getItem --data '{ "pathParameters": { "itemId": "xxx" } }'`
    
    delete:
    
    `serverless invoke local --function deleteItem --data '{ "pathParameters": { "itemId": "xxx" } }'`
    
    update:
    
    `serverless invoke local -f updateItem -d '{ "pathParameters": { "itemId": "xxx" }, "body": "{ \"paramName\": \"thing\", \"paramValue\": \"Water\" }" }'`
