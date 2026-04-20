const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CSV_PATH = path.join(__dirname, 'data.csv');

let csvData = [];

// 1. Pre-load data on startup for O(1) access during requests
function loadData() {
    console.log('Loading CSV into memory...');
    try {
        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        // Split by newline and filter out empty lines
        csvData = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
        console.log(`Loaded ${csvData.length} lines.`);
    } catch (err) {
        console.error('Error loading CSV:', err);
        process.exit(1);
    }
}

// 2. The Endpoint
app.get('/get-random-lines', (req, res) => {
    const count = parseInt(req.query.count);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Please provide a valid positive count.' });
    }

    // Ensure we don't request more lines than exist
    const actualCount = Math.min(count, csvData.length);
    const results = [];
    
    // Pick random indices
    for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(Math.random() * csvData.length);
        results.push(csvData[randomIndex]);
    }

    res.json({
        total_available: csvData.length,
        requested: count,
        data: results
    });
});

// Start Server
loadData();
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});