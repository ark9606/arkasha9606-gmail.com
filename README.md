# Description
This an example of serverless approach in developing backend with AWS.

Project includes next technologies:
- [Serverless](https://serverless.com)
- API Gateway
- AWS lambda
- DynamoDB
- Cognito

### Setting project up
#### Prerequisites:
- node
- npm

1 Install AWS CLI from [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

2 Configure your AWS account as described [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-set-up-credentials.html)

```
$ aws configure
> AWS Access Key ID [None]: your_access_key_id
> AWS Secret Access Key [None]: your_secret_access_key
```
3 Install a serverless framework:

    `npm install -g serverless`
    
4 Deploy infrastructure - this will create instances of used services:

    `sls deploy`


#### Scripts

- deploy lambda

    `sls deploy`

- run lambda locally - get all items

    `serverless invoke local --function getAllItems`
