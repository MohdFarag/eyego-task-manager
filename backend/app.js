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

// Base URL
const baseUrl = process.env.BASE_URL;

// Routes
app.use(`${baseUrl}/tasks`, require('./routes/task/tasks'));
app.use(`${baseUrl}/login`, require('./routes/user/login'));
app.use(`${baseUrl}/signup`, require('./routes/user/signup'));

module.exports = app;
