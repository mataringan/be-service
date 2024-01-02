const Contact = require("../models/contact");
const { v4: uuid } = require("uuid");

module.exports = {
    async createContact(req, res) {
        try {
            const { name, email, typeservice, message } = req.body;

            const contact = await Contact.create({
                _id: uuid(),
                name,
                email,
                typeservice,
                message,
            });
            res.status(201).json({
                status: "success",
                message: "create contact successfully",
                data: contact,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getAllContact(req, res) {
        try {
            const contact = await Contact.find();

            res.status(200).json({
                status: "success",
                message: "get All contact successfully",
                data: contact,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
