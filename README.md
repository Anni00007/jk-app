

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## create .env file and than copy data from env.example

## Create db and Seed admin data

```bash
$ npx prisma migrate dev
$ npx run seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# User Authentication, Document Management, and Ingestion Service

## Description

This backend service is built using [NestJS](https://github.com/nestjs/nest) with TypeScript to manage **user authentication**, **document management**, and **ingestion controls**. The service includes the following functionalities:

- **Authentication APIs**: Register, login, logout, and handle user roles (admin, editor, viewer).
- **User Management APIs**: Admin-only functionality for managing user roles and permissions.
- **Document Management APIs**: CRUD operations for documents, including the ability to upload documents.
- **Ingestion Trigger API**: Allows triggering the ingestion process in the Python backend via a webhook or API call.
- **Ingestion Management API**: Tracks and manages ongoing ingestion processes.

## Key APIs

1. **Authentication APIs**:
   - `POST /auth/register`: Register a new user.
   - `POST /auth/login`: Login and get an authentication token.
   - `POST /auth/logout`: Logout the user.

2. **User Management APIs (Admin Only)**:
   - `GET /admin/users`: List all users.
   - `POST /admin/users/{id}/roles`: Assign a role to a user (admin, editor, viewer).
   - `PUT /admin/users/{id}`: Update a user's details.
   - `DELETE /admin/users/{id}`: Delete a user.

3. **Document Management APIs**:
   - `POST /documents`: Upload a new document.
   - `GET /documents`: List all documents.
   - `GET /documents/{id}`: Retrieve a specific document by ID.
   - `DELETE /documents/{id}`: Delete a document.

4. **Ingestion Trigger API**:
   - `POST /ingestion/trigger`: Trigger the ingestion process in the Python backend.

5. **Ingestion Management API**:
   - `GET /ingestion/status`: Get the status of the ongoing ingestion processes.
