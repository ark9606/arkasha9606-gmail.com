## Blog table

#### 1. Create database ERD
![image](dynamodb-assets/dynamodb_erd.png)

#### 2. Define access patterns (questions to database)
1. get user profile (user info and hobbies)
2. get posts for user
3. get single post with comments
4. get posts for user by status
5. get published posts
    
#### 3. Define primary and sort keys

| Entities        | PK                          | SK                               |
| --------------- |:----------------------------|:---------------------------------|
| user            | USER#&lt;userId&gt;         | PROFILE#&lt;userId&gt;           |
| user hobby      | -                           | -                                |
| post            | USER#&lt;userId&gt;         | POST#&lt;postId&gt;              |
| comment         | COMMENT#&lt;commentId&gt;   | POST#&lt;postId&gt;              |


##### One-to-many patterns:
 - denormalization (attribute)
 - Primary key + query
 - A secondary index (ex. inverted) + query
 
##### Filtering access patterns:
- composite sort key: combine two attributes + query 
- sparse index: add unique attribute to item -> make it PK -> query 

 
##### Many-to-many:
- some pattern






#### Choosing a secondary index in DynamoDB

Sometimes it's hard to define which type of index should be used.
Following schema displays how to choose index type:

![image](https://user-images.githubusercontent.com/6509926/72526710-a66b7c80-382c-11ea-8923-dbb9c9589881.png)
[Link to source](https://www.dynamodbguide.com/local-or-global-choosing-a-secondary-index-type-in-dynamo-db)
