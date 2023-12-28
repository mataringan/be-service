const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuidv4");

const Transaction = new Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    userId: {
        type: String,
        default: uuidv4,
        ref: "User",
    },
    idBooking: {
        type: String,
        default: uuidv4,
        ref: "Booking",
    },
    proofOfTransfer: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Transaction", Transaction);
