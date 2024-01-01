const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Contact = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        typeservice: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Contact", Contact);
