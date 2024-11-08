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

// Messages
const MESSAGES = {
    INVALID_USERNAME: 'Invalid Username.',
    USERNAME_EXISTS: 'Username already exists.',
    INVALID_FIRST_NAME: 'Invalid First Name.',
    INVALID_LAST_NAME: 'Invalid Last Name.',
    INVALID_EMAIL: 'Invalid Email.',
    EMAIL_EXISTS: 'Email already exists.',
    INVALID_PASSWORD: 'Invalid Password.',
    USER_REGISTERED: 'User Registered Successfully!',
};


const respondWithValidationError = (res, message) => 
    res.status(STATUS_BAD_REQUEST).send(Response.fail({ message }));

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
            return respondWithValidationError(res, MESSAGES.INVALID_USERNAME);
        }

        if (await doesUsernameExist(username)) {
            return respondWithValidationError(res, MESSAGES.USERNAME_EXISTS);
        }

        // Validate First and Last Name
        if (!isNameValid(firstName)) {
            return respondWithValidationError(res, MESSAGES.INVALID_FIRST_NAME);
        }
        
        if (!isNameValid(lastName)) {
            return respondWithValidationError(res, MESSAGES.INVALID_LAST_NAME);
        }

        // Validate Email
        if (!isEmailValid(email)) {
            return respondWithValidationError(res, MESSAGES.INVALID_EMAIL);
        }

        if (await doesEmailExist(email)) {
            return respondWithValidationError(res, MESSAGES.EMAIL_EXISTS);
        }

        // Validate Password
        if (!isPasswordValid(password)) {
            return respondWithValidationError(res, MESSAGES.INVALID_PASSWORD);
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

        return res.status(STATUS_SUCCESS).send(Response.success({ message: MESSAGES.USER_REGISTERED }));
    } catch (error) {
        return res.status(STATUS_SERVER_ERROR).send(Response.error(error.message));
    }
});

module.exports = router;
