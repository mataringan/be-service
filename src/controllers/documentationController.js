const Documentation = require("../models/documentation");
const { v4: uuid } = require("uuid");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createDocumentation(req, res) {
        try {
            const { address } = req.body;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can create documentation",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "documentation",
                    },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        const documentation = await Documentation.create({
                            _id: uuid(),
                            address,
                            image: result.url,
                        });
                        res.status(201).json({
                            status: "success",
                            message: "create documentation successfully",
                            data: documentation,
                        });
                    }
                );
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getAllDocumentation(req, res) {
        try {
            const address = req.query.address ? req.query.address : "";

            const querySearch = {
                address: { $regex: new RegExp(address, "i") },
            };

            const documentation = await Documentation.find(querySearch);

            res.status(200).json({
                status: "success",
                message: "get All documentation successfully",
                data: documentation,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getDocumentationById(req, res) {
        try {
            const _id = req.params.id;

            const documentation = await Documentation.findOne({ _id });

            res.status(200).json({
                status: "success",
                message: "get documentation by id successfully",
                data: documentation,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateDocumentation(req, res) {
        try {
            const _id = req.params.id;
            const { address } = req.body;
            const documentation = await Documentation.findOne({ _id });

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can update documentation",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "documentation-update" },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        documentation._id = documentation._id;
                        documentation.address = address;
                        documentation.image = result.url;

                        await documentation.save();

                        res.status(200).json({
                            status: "success",
                            message: "documentation update successfully",
                        });
                    }
                );
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteDocumentation(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete documentation",
                });
            }
            const _id = req.params.id;

            const documentation = await Documentation.findById(_id);

            if (!documentation) {
                return res.status(404).json({
                    status: "error",
                    message: "documentation not found",
                });
            }

            await Documentation.findByIdAndDelete(_id);

            res.status(200).json({
                status: "success",
                message: "delete documentation successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
