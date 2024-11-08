const User = require('./userSchema');

// Validates if the username meets specified criteria (5-20 alphanumeric characters).
function isUsernameValid(username) {
    return /^[a-zA-Z0-9]{5,20}$/.test(username);
}

// Checks if a user with the provided username already exists in the database.
async function doesUsernameExist(username) {
    const user = await User.findOne({ username });
    return !!user;  // Returns true if user exists, otherwise false
}

// Validates if the name contains only alphabetic characters.
function isNameValid(name) {
    return /^[a-zA-Z]+$/.test(name);
}

// Validates if the email is in a proper email format.
function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Checks if a user with the provided email already exists in the database.
async function doesEmailExist(email) {
    const user = await User.findOne({ email });
    return !!user;  // Returns true if user exists, otherwise false
}

// Validates if the password meets complexity requirements (6-20 characters with at least one digit, one lowercase, and one uppercase letter).
function isPasswordValid(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
}

module.exports = {
    isUsernameValid,
    doesUsernameExist,
    isNameValid,
    isEmailValid,
    doesEmailExist,
    isPasswordValid,
};
