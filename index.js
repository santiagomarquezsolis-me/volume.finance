import express from 'express';

const app = express();
const port = 8080;

app.use(express.json());

/**
 * Function to calculate the complete flight path from unordered flight segments.
 * @param {Array} flights - A list of flight segments, each represented by a pair [origin, destination].
 * @returns {Array|String} - The ordered flight path from the initial origin to the final destination, or an error message.
 */
const calculateFlightPath = (flights) => {
    const flightMap = new Map();
    const startPoints = new Set();
    const endPoints = new Set();

    // Create a map of flight segments and sets of start and end points
    flights.forEach(([start, end]) => {
        flightMap.set(start, end);
        startPoints.add(start);
        endPoints.add(end);
    });

    // Find the starting point (origin airport) which is not a destination in any segment
    let start = [...startPoints].find(point => !endPoints.has(point));

    // If there's no unique start point, it's impossible to construct a valid path
    if (!start) {
        return "Impossible to construct a valid flight path.";
    }

    const path = [];
    const visited = new Set();

    // Build the complete path by following the segments from the starting point
    while (start) {
        if (visited.has(start)) {
            return "Cycle detected in the flight segments.";
        }
        path.push(start);
        visited.add(start);
        start = flightMap.get(start);
    }

    // If there is no ending point or if the last point doesn't match the expected endpoint, it means disconnected segments
    if (path.length !== flights.length + 1) {
        return "Disconnected segments detected in the flight segments.";
    }

    return path;
};

// Define the POST /calculate endpoint to process flight path calculation requests
app.post('/calculate', (req, res) => {
    const flights = req.body;

    // Validate the input format
    if (!Array.isArray(flights) || flights.some(f => !Array.isArray(f) || f.length !== 2)) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    // Calculate the flight path
    const result = calculateFlightPath(flights);
    // Check if the result is an error message
    if (typeof result === 'string') {
        return res.status(400).json({ error: result });
    }

    // Return the flight path as a JSON response
    res.json(result);
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
