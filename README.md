

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

``` 
$ copy envs from env.example

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
   - `POST /admin/users/{id}`: Assign a role to a user (admin, editor, viewer).
   - `PUT /admin/users/{id}`: Update a user's details.
   - `DELETE /admin/users/{id}`: Delete a user.

3. **Document Management APIs**:
   - `POST /documents`: Upload a new document.
   - `GET /documents/{id}`: Retrieve a specific document by ID.
   - `DELETE /documents/{id}`: Delete a document.

4. **Ingestion Trigger API**:
   - `POST /ingestion/trigger`: Trigger the ingestion process in the Python backend.

5. **Ingestion Management API**:
   - `GET /ingestion/status`: Get the status of the ongoing ingestion processes.


# NestJS Backend - User Management and Document Management

## Overview
The project is designed to create a backend service using **NestJS** that provides functionality for **user authentication**, **user management**, **document management**, and **ingestion controls**. This backend system includes APIs to manage user roles and permissions, handle document uploads, and manage an ingestion process that interacts with a Python backend service.

## System Architecture and Modules
The system is structured with the following modules, each encapsulating the respective logic:

### 1. **Authentication Module (Auth)**
   - **Functionality**: Handles user registration, login, and JWT-based authentication.
   - **APIs**:
     - `POST /auth/register`: Allows a new user to register.
     - `POST /auth/login`: Allows a user to log in and receive a JWT token.
   - **Tools**:
     - **Passport.js**: Used for handling JWT authentication.
     - **JWT**: Provides token-based authorization.
   - **Validation**:
     - **Joi**: Used for validating input during user registration and login to ensure data integrity.

### 2. **User Module**
   - **Functionality**: Admin can manage users, including assigning and updating roles and permissions.
   - **APIs**:
     - `GET /users`: Admin can retrieve a list of all users.
     - `POST /users/:userId/role`: Admin assigns or updates roles for a specific user.
     - `DELETE /users/:userId`: Admin can delete a user.
   - **Access Control**:
     - Only accessible by the **admin** user.
     - Role-based guards are implemented using NestJS guards to enforce access control at the API level.

### 3. **Role and Permission Module**
   - **Functionality**: Handles role assignments for users and manages permissions.
   - **APIs**:
     - `POST /roles`: Admin creates new roles (e.g., admin, editor, viewer).
     - Role-based authorization is implemented, where only users with specific roles can access certain resources.
     - Permissions management is planned for future enhancement.
   - **Role Guards**:
     - Role-based guards ensure that only users with the correct role (e.g., `admin`, `editor`, or `viewer`) can access restricted endpoints.

### 4. **Document Module**
   - **Functionality**: Manages document uploads and serves documents from the server.
   - **APIs**:
     - `POST /documents`: Upload a new document.
     - `GET /documents/{id}`: Retrieve a specific document by ID.
   - **Storage**:
     - Documents are stored in an asset folder and served as static files.
   - **Security**:
     - Documents are accessible only by authenticated and authorized users.
   - **File Upload Implementation**:
     - Uses a two-part interceptor approach:
       - `configuredFileInterceptor`: A configured instance of NestJS's `FileInterceptor` that handles the actual file upload, storage, and validation.
       - `FileUploadInterceptor`: A custom interceptor that logs file upload requests and provides additional processing.
     - File validation includes:
       - MIME type validation (only allows specific file types)
       - Filename pattern validation
       - File size limits

### 5. **Ingestion Module**
   - **Functionality**: Manages the ingestion process, allowing the triggering of ingestion processes and tracking their status.
   - **APIs**:
     - `POST /ingestion/start`: Triggers the ingestion process in the Python backend (via an API call or webhook).
     - `GET /ingestion/status`: Tracks the current status of the ingestion process (whether it is complete or ongoing).
   - **Microservice Integration**:
     - Uses the **Axios** library to communicate with other microservices (e.g., the Python backend) for ingestion purposes.
   
### 6. **Common Module**
   - **Purpose**: Contains reusable logic such as guards, decorators, and validation strategies.
   - **Components**:
     - **Guards**: Implemented for authentication and role-based access control.
     - **Decorators**: Custom decorators for authentication and role-based authorization.
     - **Validation**:
       - Uses **Joi** to validate incoming request payloads, ensuring that only valid data is processed by the system.

### 7. **Response Service**
   - **Functionality**: A service that provides consistent and structured responses for all API calls.
   - **Methods**:
     - A static function is used to generate standardized responses, improving the API's consistency and usability for client-side applications.

## Security and Authorization
- **JWT Authentication**: Ensures that API requests are secured and authenticated using JWT tokens.
- **Role-Based Access Control (RBAC)**: Implemented using **guards** to ensure that only users with appropriate roles (e.g., admin) can access specific APIs.
- **Guards**:
  - **Auth Guard**: Protects all routes by validating JWT tokens.
  - **Role Guard**: Ensures that the user has the necessary role to access a specific route.
  - **API Security**: Every route is secured using the appropriate guard to restrict access to authorized users only.

## Data Validation
- **Joi Validation**: Input data for various API requests is validated using **Joi**, ensuring data consistency and preventing invalid data from being processed.
  - Example: User registration and login requests are validated to ensure required fields (e.g., email, password) are provided and formatted correctly.

## API Interaction with Microservices
- The ingestion module interacts with the **Python backend** to trigger ingestion processes and monitor their status. This is achieved through HTTP API calls using the **Axios** library.
- Microservices architecture allows for scalable interaction between NestJS and other services.

## System Security Features
- **JWT and Passport.js**: Ensures secure authentication for users, with role-based authorization to control access to resources.
- **Role Guards**: Restrict access to APIs based on user roles, providing granular control over user permissions.

## API Summary

# Backend Api Documentation

## **General Info**
- **Title**: Backend Api
- **Description**: JK assignment APIs
- **Version**: 1.0

---

## **Authentication Endpoints**
### **POST /auth/create**
- **Operation ID**: AuthController_createUser
- **Summary**: Creates a new user and returns authentication details
- **Request Body**: 
    ```json
    {
      "email": "xyz@xyz.com",
      "password": "Pass@123",
      "firstName": "John",
      "lastName": "Doe"
    }
    ```
- **Response**:
  - **201**: Created

### **POST /auth/login**
- **Operation ID**: AuthController_login
- **Summary**: Login for an existing user and returns a token
- **Request Body**: 
    ```json
    {
      "email": "xyz@xyz.com",
      "password": "Pass@123"
    }
    ```
- **Response**:
  - **201**: Created

### **POST /auth/logout**
- **Operation ID**: AuthController_logOut
- **Summary**: Logout API
- **Security**: Bearer Token Required
- **Response**:
  - **201**: Created

---

## **Roles Endpoints**
### **GET /roles**
- **Operation ID**: RoleController_getRoles
- **Summary**: Get all roles
- **Security**: Bearer Token Required
- **Response**:
  - **200**: OK

### **PATCH /roles/{id}**
- **Operation ID**: RoleController_updateRole
- **Summary**: Update a role
- **Request Body**:
    ```json
    {
      "permissionIds": [1, 2, 3]
    }
    ```
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

### **DELETE /roles/{id}**
- **Operation ID**: RoleController_deleteRole
- **Summary**: Delete a role
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

---

## **Permissions Endpoints**
### **GET /permission**
- **Operation ID**: PermissionController_getAllPermissions
- **Summary**: Get all permissions
- **Security**: Bearer Token Required
- **Response**:
  - **200**: OK

### **GET /permission/{id}**
- **Operation ID**: PermissionController_getPermissionById
- **Summary**: Get permission by ID
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

### **DELETE /permission/{id}**
- **Operation ID**: PermissionController_deletePermission
- **Summary**: Delete permission
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

---

## **Document Endpoints**
### **POST /document/upload**
- **Operation ID**: DocumentController_uploadFile
- **Summary**: Upload a file
- **Request Body**: Multipart Form-Data (file)
- **Response**:
  - **201**: Created
    ```json
    {
      "data": {
        "id": 1,
        "fileName": "1234567890.pdf",
        "filePath": "/assets/1234567890.pdf",
        "url": "http://localhost:3000/assets/1234567890.pdf",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "message": "Success"
    }
    ```
- **Validation**:
  - File type must be one of: application/pdf, image/jpeg, image/png
  - File name must match pattern: alphanumeric characters, hyphens, underscores, and spaces
  - Maximum file size: 5MB
- **Security**: Bearer Token Required

### **GET /document/{id}**
- **Operation ID**: DocumentController_getFile
- **Summary**: Get a file by ID
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

### **DELETE /document/{id}**
- **Operation ID**: DocumentController_deleteFile
- **Summary**: Delete a file by ID
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

---

## **Ingestion Endpoints**
### **POST /ingestion/trigger**
- **Operation ID**: IngestionController_triggerIngestion
- **Summary**: Trigger ingestion process
- **Response**:
  - **201**: Created
- **Security**: Bearer Token Required

### **GET /ingestion/status/{ingestionId}**
- **Operation ID**: IngestionController_getIngestionStatus
- **Summary**: Get ingestion status by ingestion ID
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

---

## **Admin Endpoints**
### **GET /admin/users**
- **Operation ID**: UsereController_getAllUsers
- **Summary**: Get all users
- **Security**: Bearer Token Required
- **Response**:
  - **200**: OK

### **POST /admin/users/{id}**
- **Operation ID**: UsereController_updateUserRole
- **Summary**: Update role for a user
- **Request Body**:
    ```json
    {
      "roleId": 1
    }
    ```
- **Response**:
  - **201**: Created
- **Security**: Bearer Token Required

### **PUT /admin/users/{id}**
- **Operation ID**: UsereController_updateUser
- **Summary**: Update user
- **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe"
    }
    ```
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

### **DELETE /admin/users/{id}**
- **Operation ID**: UsereController_deleteUseer
- **Summary**: Delete a user
- **Response**:
  - **200**: OK
- **Security**: Bearer Token Required

---

## **Schemas**
### **CreateUserDto**
```json
{
  "email": "xyz@xyz.com",
  "password": "Pass@123",
  "firstName": "John",
  "lastName": "Doe"
}


