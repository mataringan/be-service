const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const User = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiration: {
        type: String,
    },
});

module.exports = mongoose.model("User", User);
