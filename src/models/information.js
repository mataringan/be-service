const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Information = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        title: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Information", Information);
