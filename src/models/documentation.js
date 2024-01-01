const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Documentation = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        address: {
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

module.exports = mongoose.model("Documentation", Documentation);
