# Document Management System API.

Document Management System provides a restful API for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT.
## Technologies Used
- JavaScript (ES6)
- Node.js
- Express
- Postgresql
- Sequelize ORM.  
## Local Development
### Prerequisites includes
- [Postgresql](https://www.postgresql.org/) and
-  [Node.js](http://nodejs.org/) >= v6.8.0.
### Procedure
1. Clone this repository from a terminal `git clone git@github.com:andela-emurphy/dmc.git`.
1. Move into the project directory `cd dmc`
1. Install project dependencies `npm install`
1. Create Postgresql database and run migrations `npm run db:migrations`.
1. Start the express server `npm start`.
1. Run test `npm test`.
### Postman Collection
[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/5d2d19a09620ac0f65ff)
Create a Postman environment and set `url` and `token` variables or download and import a production environment from this [link][postman-env-link]
## Deployment
Deploy this project to Heroku by clicking the button below.
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-uenabulele/document-magement-system)
Set a `SECRET_TOKEN` environmet variable, and create a Postgresql add-on.
---
# API Documentation
The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.
## Authentication
Users are assigned a token when signup or signin. This token is needed for subsequent HTTP requests to the API for authentication and can be attached as values to the header's `authorization` and the api key attached to a bearer `Bearer api_key` key. API requests made without authentication will fail with the status code `401: Unauthorized Access`.
## Below are the API endpoints and their functions
EndPoint                      |   Functionality
------------------------------|------------------------
POST /users/login             |   Logs a user in.
POST /users/logout            |   Logs a user out.
POST /users/                  |   Creates a new user.
GET /users/                   |   Find matching instances of user.
GET /users?q=name             |   search the users base on the query param 
GET /users?limit=2            |   limits the users return, maximum of ten
GET /users?q=limit&offset=2   |   sets the next users to get 
GET /users/<id>               |   gets a single user.
PUT /users/<id>               |   Update user.
DELETE /users/<id>            |   Delete user.
POST /documents/              |   Creates a new document instance.
GET /documents/               |   Find matching instances of document.
GET /documents?q=name         |   search the documents base on the query param 
GET /documents?limit=2        |   limits the documents return, maximum of ten
GET /documents?q=limit&offset=2   |   sets the next documents to get 
GET /documents/<id>           |   Find document.
PUT /documents/<id>           |   Update document attributes.
DELETE /documents/<id>        |   Delete document.
POST /roles/                  |   Creates a new user.
GET /roles/                   |   Find matching instances of role.
GET /roles?q=name             |   search the roles base on the query param 
GET /roles?limit=2            |   limits the roles return, maximum of ten
GET /roles?q=limit&offset=2   |   sets the next role to get 
GET /roles/<id>               |   gets a single role.
PUT /roles/<id>               |   Update role.
DELETE /roles/<id>            |   Delete role.

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
- Endpoint: GET: `/roles`
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
- Endpoint: POST: `users`
- Body `(application/json)`
```json
{
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "role": "regular",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjE0MSwiUm9sZUlkIjoxLCJpYXQiOjE0ODc1MjU2NjAsImV4cCI6MTQ4NzY5ODQ2MH0.ddCQXZB2_woJ32xZNHqPBhNXfjBRg6T3ZsSmF8GCplA",

}
```
#### Response
- Status: `201: Created`
- Body `(application/json)`
```json
{
  "data": {
    "id": 141,
    "username": "uniqueuser",
    "fullNames": "Unique User",
    "email": "uniqueuser@unique.com",
    "role": "regular",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjE0MSwiUm9sZUlkIjoxLCJpYXQiOjE0ODc1MjU2NjAsImV4cCI6MTQ4NzY5ODQ2MH0.ddCQXZB2_woJ32xZNHqPBhNXfjBRg6T3ZsSmF8GCplA",
}
```
### Get Users
#### Request
- Endpoint: GET: `users`
- Requires: Authentication, Admin Role
#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "goku",
  "fullNames": "wui2AH",
  "email": "saitama@naruto.com",
  "role": "regular",
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "role": "regular",
}]
```
## Documents
Endpoint for document API.
### Get All Documents
#### Request
- Endpoint: GET: `/documents`
- Requires: Authentication, Admin Role
#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "public": "Public",
    "OwnerId": 29,
    "editable": 1,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "public": "1",
    "editable": 0,
    "OwnerId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```
### Create Document
#### Request
- Endpoint: POST: `/documents`
- Requires: Authentication
- Body `(application/json)`
```json
{
  "title": "Just a Title",
  "content": "This placeholder should not always be a lorem generated document",
  "public": "Public",
  "OwnerId": 29,
  "editable": 1,
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
  "public": 0,
  "editable": 1,
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```
### Get Document
#### Request
- Endpoint: GET: `/documents/:id`
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
  "public": 0,
  "editable": 1,
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```
### Edit Document
#### Request
- Endpoint: PUT: `/documents/:id`
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
    "public": 0,
    "editable": 1,
    "createdAt": "2017-02-05T05:51:51.217Z",
    "updatedAt": "2016-02-05T05:51:51.217Z"
  }
```
### Delete Document
#### Request
- Endpoint: DELETE: `/documents/:id`
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
- Endpoint: GET: `/documents?q=moyo`
- Requires: Authentication
#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "public": 0,
    "editable": 1,
    "OwnerId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "public": 0,
    "editable": 1,
    "OwnerId": 1,
  }]
```
### Users
#### Request
- Endpoint: GET: `/users?q=andela`
- Requires: Authentication, Admin Role
#### Response
- Status: `200: OK`
- Body `(application/json)`
```json
[{
  "id": 140,
  "username": "luffy",
  "fullNames": "luffy D",
  "email": "luffy@gmail.com",
  "role": "regular",
},
{
  "id": 141,
  "username": "uniqueuser",
  "fullNames": "Unique User",
  "email": "uniqueuser@unique.com",
  "role": "regular",
  "
}]
```