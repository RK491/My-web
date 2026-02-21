const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Path to JSON database
const dataFilePath = path.join(__dirname, 'data', 'data.json');

// API: Get Public Data
app.get('/api/data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading data' });
        
        const parsedData = JSON.parse(data);
        // Return everything except the password
        const publicData = {
            profile: parsedData.profile,
            links: parsedData.links
        };
        res.json(publicData);
    });
});

// API: Update Data (Protected)
app.post('/api/update', (req, res) => {
    const { password, profile, links } = req.body;

    // Read current data to verify password
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        const currentData = JSON.parse(data);

        // Simple Password Check
        if (password !== currentData.adminPassword) {
            return res.status(401).json({ success: false, message: 'Invalid Password' });
        }

        // Update data
        currentData.profile = profile;
        currentData.links = links;

        // Save to file
        fs.writeFile(dataFilePath, JSON.stringify(currentData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving data' });
            res.json({ success: true, message: 'Profile updated successfully!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
