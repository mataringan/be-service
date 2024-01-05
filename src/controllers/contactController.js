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
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can get all contact",
                });
            }
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

    async deleteContact(req, res) {
        try {
            const _id = req.user.id;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete contact",
                });
            } else {
                await Contact.findByIdAndDelete(_id);
            }
            res.status(200).json({
                status: "success",
                message: "delete contact successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteAllContact(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete all contact",
                });
            } else {
                await Contact.deleteMany();
            }
            res.status(200).json({
                status: "success",
                message: "delete All Contact Successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
