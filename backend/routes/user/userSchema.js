
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        username:   { type: String, required: true,     trim: true },
        firstName:  { type: String, required: true,     trim: true },
        lastName:   { type: String, required: false,    trim: true },
        email:      { type: String, required: true,     trim: true, unique: true },
        password:   { type: String, required: true,     trim: true },
        birthDate:  { type: Date },
    },
    { timestamps: true }
);

userSchema.methods.generateJWT = function (){
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
        }, 
        process.env.JWT_SECRET_KEY,
        {expiresIn :'1d'});

    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User;