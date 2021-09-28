const {validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const { schema } = require("../Models/userModel");

dotenv.config();                        // to use .env variables

// const User = require("../models/userModel");
var User = mongoose.model('User', schema);

//registration user route

exports.registarUser = async (req, res) => {

    const {Username, email, password, phone, userRole} = req.body;
    try {
        // if user already exist
        var user = await User.findOne({email});
        if(user) {
            return res.status(400).json({ msg: 'User already exists with provided email'});
        }
        // if new user
        user = new User({
            Username,
            email,
            password,
            phone,
            userRole
        })
        // password converting into hashed format
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).send("user created sucessfully");
        
    } catch (err) {
        res.status(500).json(err);
        // console.log(err);
    }
};

