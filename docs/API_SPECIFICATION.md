# Gamify REST API Specification

This document provides a comprehensive overview of the REST API endpoints exposed by the Gamify backend server.

## Base URL
Default local development URL: `http://localhost:5000`

---

## Authentication Endpoints

### 1. Register User
* **URL**: `/api/auth/register`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
* **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60d000000000000000000001",
      "username": "exampleUser",
      "email": "user@example.com",
      "role": "Member"
    }
  }
  ```
* **Validation & Rate Limits**: 
  - Max 5 registrations per hour.
  - Returns `429 Too Many Requests` when limits are exceeded.

### 2. Login User
* **URL**: `/api/auth/login`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
* **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60d000000000000000000001",
      "username": "exampleUser",
      "email": "user@example.com",
      "role": "Member"
    }
  }
  ```

---

## User Management Endpoints

### 1. Get Logged In User Profile
* **URL**: `/api/users/profile`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "60d000000000000000000001",
      "username": "exampleUser",
      "email": "user@example.com",
      "role": "Member",
      "points": 120,
      "level": 1
    }
  }
  ```

### 2. List All Users (Moderator+)
* **URL**: `/api/users`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "60d000000000000000000001",
        "username": "exampleUser",
        "email": "user@example.com",
        "role": "Member",
        "points": 120,
        "level": 1
      }
    ]
  }
  ```

---

## Tasks & Submissions Endpoints

### 1. List Active Tasks
* **URL**: `/api/tasks`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response**: `200 OK`

### 2. Submit Task Submission
* **URL**: `/api/tasks/:taskId/submissions`
* **Method**: `POST`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "content": "Link to submission or text proof description."
  }
  ```

---

## Error Response Structure
All failed requests follow a standard response model:
```json
{
  "success": false,
  "message": "Specific details explaining why the operation failed."
}
```
Common Status Codes:
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Token missing or invalid.
- `403 Forbidden`: Insufficient role permissions.
- `404 Not Found`: Target resource does not exist.
- `429 Too Many Requests`: Rate limit threshold exceeded.
- `500 Internal Server Error`: Backend database or system exception.
