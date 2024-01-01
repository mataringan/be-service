const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const Booking = new Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        userId: {
            type: String,
            default: uuidv4,
            ref: "User",
        },
        name: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: false,
        },
        service: {
            type: String,
            required: false,
        },
        type_service: {
            type: String,
            required: false,
        },
        note: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Booking", Booking);
