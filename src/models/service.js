const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Service = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        name: {
            type: String,
            required: false,
        },
        typeservice: {
            type: String,
            required: false,
        },
        detailService: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Service", Service);
