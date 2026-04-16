# API Integration & Data Processing Assessment (HNG14 Stage 0 | Backend)

A robust Node.js API that integrates with the Genderize.io external service to classify names by gender. This project demonstrates backend integration, data processing logic, and strict error handling.

## Public API Base URL
https://hng14-stage0-vivian-api.onrender.com

## Features
- **Data Transformation**: Converts raw Genderize API data into a structured custom format.
- **Confidence Logic**: Implements specific business rules to determine prediction reliability.
- **Input Validation**: Includes checks for missing, empty, or invalid name formats (400 and 422 errors).
- **CORS Enabled**: Configured to allow cross-origin requests for seamless grading integration.

## API Endpoint

### Classify Name
`GET /api/classify?name=<name>`

**Example Request:**
`GET /api/classify?name=vivian`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "name": "vivian",
    "gender": "female",
    "probability": 0.98,
    "sample_size": 159550,
    "is_confident": true,
    "processed_at": "2026-04-16T12:00:00.000Z"
  }
}
