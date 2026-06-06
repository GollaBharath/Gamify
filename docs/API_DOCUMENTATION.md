# Gamify API Documentation

Welcome to the Gamify Server API documentation. The server is built using **Express** and connects to a **MongoDB** database. It exposes standard REST endpoints for managing authentication, user profiles, points, events, tasks, shop items, and leaderboard standings.

---

## Base URL
- Local Development: `http://localhost:5000` or `http://localhost:5173` (depending on configuration)
- API Path: All routes are prefixed with `/api`

---

## Global Headers

| Header Name | Type | Value / Purpose |
| :--- | :--- | :--- |
| `Content-Type` | String | `application/json` (Required for POST/PUT requests) |
| `Authorization` | String | `Bearer <JWT_TOKEN>` (Required for protected routes) |

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
- **Route:** `POST /api/auth/register`
- **Description:** Registers a new user account.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOi..."
  }
  ```

### 2. Login User
- **Route:** `POST /api/auth/login`
- **Description:** Logs in an existing user.
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "token": "eyJhbGciOi..."
  }
  ```

---

## User Endpoints (`/api/users`)

### 1. Get Current User Profile
- **Route:** `GET /api/users/profile`
- **Authentication:** Protected (Requires JWT token)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "603d4a...",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "points": 150,
      "role": "Member"
    }
  }
  ```

---

## Tasks Endpoints (`/api/tasks`)

### 1. List All Active Tasks
- **Route:** `GET /api/tasks`
- **Authentication:** Protected (Requires JWT token)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "task_1",
        "title": "Complete Profile Setup",
        "description": "Add details to your profile to finish setup.",
        "rewardPoints": 50,
        "completed": false
      }
    ]
  }
  ```

---

## Error Response Structure
All error payloads follow a unified schema structure:
```json
{
  "success": false,
  "message": "Descriptive error message indicating the failure reason.",
  "errors": null,
  "timestamp": "2026-06-06T18:30:00.000Z"
}
```
