# QuickNotes API Design

## API Overview

The QuickNotes backend will provide a RESTful API for creating, retrieving, updating, and deleting notes, as well as managing users and tags.

Base URL:

`https://api.quicknotes.example.com/v1`

## REST Endpoints

| Method | Path | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | List notes belonging to the authenticated user | 200 OK |
| GET | `/notes/{id}` | Retrieve one note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PUT | `/notes/{id}` | Replace an existing note | 200 OK |
| PATCH | `/notes/{id}` | Partially update an existing note | 200 OK |
| DELETE | `/notes/{id}` | Delete a note | 204 No Content |
| GET | `/tags` | List the user's tags | 200 OK |
| POST | `/tags` | Create a new tag | 201 Created |

## Create a Note

### Request

`POST /notes`

```json
{
  "title": "Meeting notes",
  "body": "Discuss the QuickNotes project architecture.",
  "tagIds": [1, 3]
}
```

### Response

Status: `201 Created`

```json
{
  "id": 101,
  "userId": 7,
  "title": "Meeting notes",
  "body": "Discuss the QuickNotes project architecture.",
  "createdAt": "2026-10-08T09:30:00Z",
  "updatedAt": "2026-10-08T09:30:00Z",
  "tags": [
    {
      "id": 1,
      "name": "work"
    },
    {
      "id": 3,
      "name": "project"
    }
  ]
}
```

## List Notes

### Request

`GET /notes?limit=20&offset=0`

### Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": 101,
      "userId": 7,
      "title": "Meeting notes",
      "body": "Discuss the QuickNotes project architecture.",
      "createdAt": "2026-10-08T09:30:00Z",
      "updatedAt": "2026-10-08T09:30:00Z"
    },
    {
      "id": 102,
      "userId": 7,
      "title": "Shopping list",
      "body": "Milk, bread and fruit.",
      "createdAt": "2026-10-08T10:00:00Z",
      "updatedAt": "2026-10-08T10:00:00Z"
    }
  ],
  "limit": 20,
  "offset": 0,
  "total": 2
}
```

## Authentication

The API uses secure authentication. Requests that require a signed-in user must include a valid access token.

Example:

```text
Authorization: Bearer <access-token>
```

## Error Status Codes

| Status | Meaning |
|---|---|
| 400 Bad Request | The request contains invalid data |
| 401 Unauthorized | Authentication is missing or invalid |
| 403 Forbidden | The user is authenticated but is not allowed to perform the action |
| 404 Not Found | The requested resource does not exist |
| 500 Internal Server Error | An unexpected server-side error occurred |

### Example Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required and must not exceed 100 characters."
  }
}
```

## API Design Principles

The API follows REST principles by using HTTP methods according to the operation being performed. Resources are represented using nouns such as `notes` and `tags`, while HTTP status codes communicate the result of each request.

Authentication and authorization are required for protected resources, and users can only access notes belonging to their account.