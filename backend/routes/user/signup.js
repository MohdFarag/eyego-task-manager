const bcrypt = require('bcrypt');
const User = require('./userSchema');
const express = require('express');
const Response = require('../../helper/response');
const { isUsernameValid, doesUsernameExist, isNameValid, isEmailValid, isPasswordValid, doesEmailExist } = require('./validation');
const { parseDateFromString } = require('../../helper/date');

const router = express.Router();

// Constants
const STATUS_BAD_REQUEST = 400;
const STATUS_SUCCESS = 201;
const STATUS_SERVER_ERROR = 500;

// Utility function for responding with a validation error
const respondWithValidationError = (res, message) => 
    res.status(STATUS_BAD_REQUEST).send(Response.fail({ message }));

// Utility function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Register New User
router.post('/', async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, birthDate: birthDateStr } = req.body;

        // Validate Username
        if (!isUsernameValid(username)) {
            return respondWithValidationError(res, 'Invalid Username');
        }

        if (await doesUsernameExist(username)) {
            return respondWithValidationError(res, 'Username already exists');
        }

        // Validate First and Last Name
        if (!isNameValid(firstName)) {
            return respondWithValidationError(res, 'Invalid First Name');
        }
        
        if (!isNameValid(lastName)) {
            return respondWithValidationError(res, 'Invalid Last Name');
        }

        // Validate Email
        if (!isEmailValid(email)) {
            return respondWithValidationError(res, 'Invalid Email');
        }

        if (await doesEmailExist(email)) {
            return respondWithValidationError(res, 'Email already exists');
        }

        // Validate Password
        if (!isPasswordValid(password)) {
            return respondWithValidationError(res, 'Invalid Password');
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);
        
        // Parse birth date
        const birthDate = parseDateFromString(birthDateStr);

        // Create and save the new user
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthDate,
        });

        await user.save();

        return res.status(STATUS_SUCCESS).send(Response.success({ message: 'User Registered Successfully!' }));
    } catch (error) {
        return res.status(STATUS_SERVER_ERROR).send(Response.error(error.message));
    }
});

module.exports = router;
