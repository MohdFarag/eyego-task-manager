const bcrypt = require('bcrypt');
const User = require('./userSchema');
const express = require('express');
const Response = require('../../helper/response');

const { validUsername, isUsernameExist, validName, validEmail, validPassword } = require('./validation');
const { parseDateFromString } = require('../../helper/date');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let username = req.body.username;
        if (!validUsername(username)) {
            return res.status(400).send(Response.fail({
                message: 'Invalid Username',
            }));
        }

        if (!isUsernameExist(username)) {
            return res.status(400).send(Response.fail({
                message: 'Username already exists',
            }));
        }


        let firstName = req.body.firstName;
        if (!validName(firstName)) {
            return res.status(400).send(Response.fail({
                message: 'Invalid First Name',
            }));
        }
                
        let lastName = req.body.lastName;
        if (!validName(lastName)) {
            return res.status(400).send(Response.fail({
                message: 'Invalid Last Name',
            }));
        }

        let email = req.body.email;
        if (!validEmail(email)) {
            return res.status(400).send(Response.fail({
                message: 'Invalid Email',
            }));
        }

        if (!isEmailExist(email)) {
            return res.status(400).send(Response.fail({
                message: 'Email already exists',
            }));
        }

        var password = req.body.password;
        if (!validPassword(password)) {
            return res.status(400).send(Response.fail({
                message: 'Invalid Password',
            }));
        }

        let salt = await bcrypt.genSalt(10);
        let hasshedPassword = await bcrypt.hash (password, salt);

        let birthDate = parseDateFromString(req.body.birthDate);

        let user = new User({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hasshedPassword,
            birthDate: birthDate,
        });

        user.save();

        return res.status(201).send(Response.success({ 
            message: 'User Registered Successfully!',
        }));    
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

module.exports = router;