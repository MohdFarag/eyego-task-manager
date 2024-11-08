const User = require('./userSchema')

function validUsername(username){
    return /^[a-zA-Z0-9]{5,20}$/.test(username);
}

function isUsernameExist(username){
    let user = User.findOne({ username: username });
    return user ? true : false;
}


function validName(name){
    return /^[a-zA-Z]+$/.test(name);
}

function validEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmailExist(email){
    let user = User.findOne({ email: email });
    return user ? true : false;
}

function validPassword(password){
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
}


module.exports = {
    validUsername,
    isUsernameExist,
    validName,
    validEmail,
    isEmailExist,
    validPassword,
};