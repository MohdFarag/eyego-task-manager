const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
const userSchema = require('./userSchema')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Test route
router.get('/', (req, res) => {
    res.send('User route is working...');
});

// Export the router
module.exports = router;
