
# Flight Path Microservice

This microservice helps to determine a person's flight path by processing their flight records. The flight path is determined by sorting through unordered flight segments to form a complete path from the initial origin to the final destination.

## API Endpoint

### Calculate Flight Path

**URL:** `/calculate`

**Method:** `POST`

**Description:** This endpoint accepts a list of flight segments defined by source and destination airport codes, and returns the complete flight path from the initial origin to the final destination.

### Request Format

- **Content-Type:** `application/json`
- **Body:** An array of arrays, where each inner array represents a flight segment with two strings: the origin and the destination airport codes.

**Example Request:**

```json
[
    ["SFO", "ATL"],
    ["ATL", "EWR"]
]
```

### Response Format

- **Content-Type:** `application/json`
- **Body:** An array of strings representing the ordered flight path from the initial origin to the final destination, or an error message.

### Success Response

**Status Code:** `200 OK`

**Example Response:**

```json
["SFO", "ATL", "EWR"]
```

### Error Responses

**Invalid Input Format:**

**Status Code:** `400 Bad Request`

**Example Response:**

```json
{
    "error": "Invalid input format"
}
```

**Cycle Detected in the Flight Segments:**

**Status Code:** `400 Bad Request`

**Example Response:**

```json
{
    "error": "Cycle detected in the flight segments."
}
```

**Disconnected Segments Detected in the Flight Segments:**

**Status Code:** `400 Bad Request`

**Example Response:**

```json
{
    "error": "Disconnected segments detected in the flight segments."
}
```

**Impossible to Construct a Valid Flight Path:**

**Status Code:** `400 Bad Request`

**Example Response:**

```json
{
    "error": "Impossible to construct a valid flight path."
}
```

### Examples

#### Valid Request

**Request:**

```json
[
    ["SFO", "ATL"],
    ["ATL", "EWR"]
]
```

**Response:**

```json
["SFO", "ATL", "EWR"]
```

#### Invalid Request (Cycle Detected)

**Request:**

```json
[
    ["IND", "EWR"], 
    ["SFO", "SFO"], 
    ["GSO", "IND"], 
    ["ATL", "GSO"]
]
```

**Response:**

```json
{
    "error": "Cycle detected in the flight segments."
}
```

#### Invalid Request (Disconnected Segments)

**Request:**

```json
[
    ["IND", "EWR"], 
    ["SFO", "TTT"], 
    ["GSO", "IND"], 
    ["ATL", "GSO"]
]
```

**Response:**

```json
{
    "error": "Disconnected segments detected in the flight segments."
}
```

## Running the Server

To start the server, run:

```sh
node index.js
```

The server will listen on port 8080.

## Running the Tests

To run the tests, ensure the server is not already running and execute:

```sh
npm test
```

The tests will start the server, run the test cases, and stop the server automatically.

---

This documentation provides a clear and detailed description of the API endpoint, its usage, and the expected request and response formats. It should help users understand how to interact with the microservice and handle various scenarios.
