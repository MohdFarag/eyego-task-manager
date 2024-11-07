const bcrypt = require('bcrypt');
const User = require('./userSchema');
const express = require('express');
const Response = require('../../helper/response');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user =  await User.findOne({ 
            $or: [ 
                { username: req.body.identifier }, 
                { email: req.body.identifier } 
            ]});

        if (!user){
            return res.status(400).send(Response.fail({
                message: 'Invalid Email or Username.'
            }));
        } 

        const validPassword = await bcrypt.compare(req.body.password , user.password);
        if (!validPassword) {
            return res.status(400).send(Response.fail({
                message: 'Invalid Password.'
            }));
        }
            
        const token = user.generateJWT();
        
        return res.status(200).header('x-auth-token', token).send(Response.success({
            message:'User Login Successfully!',
            userId: user._id,            
            'x-auth-token': token
        }));   
    } catch (error) {
        return res.status(500).send(Response.error(error.message));
    }
});

module.exports = router;