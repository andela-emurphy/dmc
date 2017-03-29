[![Code Climate](https://lima.codeclimate.com/github/andela-emurphy/dms/badges/gpa.svg)](https://lima.codeclimate.com/github/andela-emurphy/dms)   [![Coverage Status](https://coveralls.io/repos/github/andela-emurphy/dms/badge.svg?branch=feature%2F140554371%2Frefactor-code)](https://coveralls.io/github/andela-emurphy/dms?branch=feature%2F140554371%2Frefactor-code)  [![Build Status](https://travis-ci.org/andela-emurphy/dms.svg?branch=feature%2F140554363%2Fdocument-endpoint)](https://travis-ci.org/andela-emurphy/dms)

Document Management System provides a restful API for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT.

## API Documentation
-----
The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.
#### API Features

The following features make up the Document Management System API:

###### Authentication

- It uses JSON Web Token (JWT) for authentication.  

- It generates a token on successful login or account creation and returns it to the consumer.  

- It verifies the token to ensures a user is authenticated to access protected endpoints.

###### Users

- It allows users to be created.  

- It allows users to login and obtain a token 

- It allows authenticated users to retrieve and update their information.  

- It allows the admin to manage users.

###### Roles

- It ensures roles can be created, retrieved, updated and deleted by an admin user.
- A non-admin user cannot create, retrieve, modify, or delete roles.  
- it allows for assignment of roles to users

###### Documents

- It allows new documents to be created by authenticated users.  

- It ensures all documents are accessible based on the permission specified.  

- It allows admin users to create, retrieve, modify, and delete documents.


- It ensures users can delete, edit and update documents that they own.  

- It allows users to retrieve all documents they own as well as public documents.

###### Search

- It allows users to search public documents for a specified search term.
- It allows admin to retrieve all documents that matches search term.
- It allows admin to search users based on a specified search term
- it allows admin to search roles based in a specified search term.


## Hosted App on Heroku
[Heroku Link](https://udms.herokuapp.com/)

---


## Below are the API endpoints and their functions
EndPoint                                |   Functionality
----------------------------------------|------------------------
POST /users/login                		    |Logs a user in.
POST /users/logout               		    |Logs a user out.
POST /users                       		|Creates a new user.
GET /users                        		 |Find matching instances of user.
GET /users?search=:word             		|Search the users base on search query param 
GET /users?limit=:num                 		|Limits the users return, defaults to ten
GET /users?limit=:limit=:num&offset=:num     		|Sets the next users to get 
GET /users/:id                         	|Gets a single user.
PUT /users/:id                         	|Update user.
DELETE /users/:id                      |Delete user.
POST /documents                    	|Creates a new document instance.
GET /documents               			|Find matching instances of document.
GET /documents?search=:word         		|Search the documents base on the query param 
GET /documents?limit=:num                 	|Limits the documents return, defaults to ten
GET /documents?limit=:num&offset=:num     	|Sets the next documents to get 
GET /documents/:id            			|Find document.
PUT /documents/:id            			|Update document attributes.
DELETE /documents/:id        			|Delete document.
POST /roles                  			|Creates a new user.
GET /roles/                   			|Find matching instances of role.
GET /roles?search=:word             		|Search the roles base on the query param 
GET /roles?limit=:limit            			|limits the roles return, maximum of ten
GET /roles?limit=:num&offset=:num     		|Sets the next role to get 
GET /roles/:title               			|Gets a single role.
PUT /roles/:title               			|Update role.
DELETE /roles/:title            			|Delete role.

The following are some sample request and response from the API.

- [Roles](#roles)
  - [Get roles](#get-roles)

- [Users](#users)
  - [Create user](#create-user)
  - [Get user](#get-user)

- [Documents](#documents)
  - [Get All documents](#get-all-documents)
  - [Create document](#create-document)
  - [Get document](#get-document)
  - [Edit document](#edit-document)
  - [Delete document](#delete-document)

- [Search](#search)
  - [Search Documents](#search-documents)
  - [Search Users] (#search-users)


## Roles
Endpoint for Roles API.

### Get Roles

#### Request
- Endpoint: GET: `/api/roles`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[
  {
    "id": 1,
    "title": "Admin",
    "createdAt": "2016-12-06T06:44:54.792Z",
    "updatedAt": "2016-12-06T06:44:54.792Z"
  }, {
    "id": 2,
    "title": "Registered",
    "createdAt": "2016-12-06T06:44:54.792Z",
    "updatedAt": "2016-12-06T06:44:54.792Z"
  }
]
```

## Users
Endpoint for Users API.

### Create User

#### Request
- Endpoint: POST: `api/users`
- Body `(application/json)`
```json
{
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "password"
}
```

#### Response
- Status: `201: Created`
- Body `(application/json)`
```json
{
  "user": {
    "id": 141,
    "username": "uniqueuser",
    "fullNames": "Unique User",
    "email": "uniqueuser@unique.com",
    "RoleId": 1,
    "createdAt": "2017-02-19T17:34:19.992Z",
    "updatedAt": "2017-02-19T17:34:19.992Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjE0MSwiUm9sZUlkIjoxLCJpYXQiOjE0ODc1MjU2NjAsImV4cCI6MTQ4NzY5ODQ2MH0.ddCQXZB2_woJ32xZNHqPBhNXfjBRg6T3ZsSmF8GCplA",
  "expiresIn": "2 days"
}
```

### Get Users

#### Request
- Endpoint: GET: `api/users`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "fed",
  "fullNames": "ddasddas",
  "email": "fed@fed.com",
  "RoleId": 1,
  "password": "$2a$08$ErbiyXkXAXsGXLoG2VOIIucUwzaCXGJz.d5YKkL/0SQIM3xhdbib2",
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "$2a$08$eggCuipNKnau7CJcxGVaUeEssqo5OjbQedfV1.gGNT2GNTyloD6MS",
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```

## Documents
Endpoint for document API.

### Get All Documents

#### Request
- Endpoint: GET: `/api/documents`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "permission": "Public",
    "OwnerId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "permission": "1",
    "OwnerId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

### Create Document

#### Request
- Endpoint: POST: `/api/documents`
- Requires: Authentication
- Body `(application/json)`
```json
{
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem generated document",
  "OwnerId": 1,
  "permission": "private"
}
```

#### Response
- Status: `201: Created`
- Body `(application/json)`
```json
{
  "id": 1,
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "OwnerId": 1,
  "permission": "private",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```


### Get Document

#### Request
- Endpoint: GET: `/api/documents/:id`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
{
  "id": 1,
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "OwnerId": 1,
  "permission": "private",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```

### Edit Document

#### Request
- Endpoint: PUT: `/api/documents/:id`
- Requires: Authentication
- Body `(application/json)`:
```json
{
  "title": "Updated Title",
}
```

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
  {
    "id": 1,
    "title": "Updated Title",
    "content": "This placeholder should not always be a lorem ipsum generated document",
    "OwnerId": 1,
    "permission": "private",
    "createdAt": "2017-02-05T05:51:51.217Z",
    "updatedAt": "2016-02-05T05:51:51.217Z"
  }
```

### Delete Document

#### Request
- Endpoint: DELETE: `/api/documents/:id`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
{
  "message": "Deleted Document with id:42"
}
```


### Search
#### Documents

#### Request
- Endpoint: GET: `/search/documents/?search=searchterm`
- Requires: Authentication

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "permission": "Public",
    "OwnerId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "permission": "1",
    "OwnerId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

### Users

#### Request
- Endpoint: GET: `/search/users/?search=searchterm`
- Requires: Authentication, Admin Role

#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "goku",
  "fullNames": "gokuasas",
  "email": "goku@goku.com",
  "RoleId": 1,
  "password": "$2a$08$ErbiyXkXAXsGXLoG2VOIIucUwzaCXGJz.d5YKkL/0SQIM3xhdbib2",
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "$2a$08$eggCuipNKnau7CJcxGVaUeEssqo5OjbQedfV1.gGNT2GNTyloD6MS",
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```
---
## Technologies Used
- JavaScript (ES6)
- Node.js
- Express
- Postgresql
- Sequelize ORM.  


## Contribute
### Prerequisites includes
- [Postgresql](https://www.postgresql.org/) and
-  [Node.js](http://nodejs.org/) >= v6.8.0.

### Procedure
1. Clone this repository from a terminal `git clone git@github.com:andela-emurphy/dms.git`.
1. Move into the project directory `cd dms`
1. Install project dependencies `npm install`
1. Create Postgresql database and run migrations `npm run migrate`.
1. Start the express server `npm start`.
1. Run test `npm test`.
2. Make changes and commit your changes
4. git push and make a pull request to my repo

### Postman Collection
Create a Postman environment and set `url` and `token` variables or download and import a production environment from this

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/5d2d19a09620ac0f65ff)


## Deployment
Deploy this project to Heroku by clicking the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-emurphy/dms.git)

Set a `SECRET_KEY` environmet variable, and create a Postgresql add-on.

### How to Contribute
----------------------
* Fork or clone the repo to your folder.
* Change directory: cd dms
* Run npm install
* Create a feature branch and work on it.
* Push to the remote branch.
* Open a Pull Request to development branch.
