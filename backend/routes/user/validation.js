const User = require('./userSchema')

function validUsername(username){
    return /^[a-zA-Z0-9]{5,20}$/.test(username);
}

function validName(name){
    return /^[a-zA-Z]+$/.test(name);
}

function validEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password){
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
}


module.exports = {
    validUsername,
    validName,
    validEmail,
    validPassword,
};