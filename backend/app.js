// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToDatabase = require('./config/database');
require('dotenv').config();

// Initialize the Express application
const app = express();

// Connect to the database
connectToDatabase();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('Task Manager API is running...');
});

baseUrl = '/api/v1';
// Routes
app.use(`${baseUrl}/tasks`, require('./routes/task/tasks'));
app.use(`${baseUrl}/users`, require('./routes/user/users'));

module.exports = app;
