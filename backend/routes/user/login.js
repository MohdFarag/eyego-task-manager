const bcrypt = require('bcrypt');
const User = require('./userSchema');
const express = require('express');
const Response = require('../../helper/response');

const router = express.Router();

// Constants
const STATUS_BAD_REQUEST = 400;
const STATUS_SUCCESS = 200;
const STATUS_SERVER_ERROR = 500;

// Messages
const MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid Email or Username.',
    INVALID_PASSWORD: 'Invalid Password.',
    LOGIN_SUCCESS: 'User Login Successfully!'
};

router.post('/', async (req, res) => {
    try {
        const user =  await User.findOne({ 
            $or: [ 
                { username: req.body.identifier }, 
                { email: req.body.identifier } 
            ]});

        if (!user){
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({
                message: MESSAGES.INVALID_CREDENTIALS,
            }));
        } 

        const validPassword = await bcrypt.compare(req.body.password , user.password);
        if (!validPassword) {
            return res.status(STATUS_BAD_REQUEST).send(Response.fail({
                message: MESSAGES.INVALID_PASSWORD,
            }));
        }
            
        const token = user.generateJWT();
        
        return res.status(STATUS_SUCCESS).header('x-auth-token', token).send(Response.success({
            message: MESSAGES.LOGIN_SUCCESS,
            userId: user._id,            
            'x-auth-token': token
        }));   
    } catch (error) {
        return res.status(STATUS_SERVER_ERROR).send(Response.error(error.message));
    }
});

module.exports = router;