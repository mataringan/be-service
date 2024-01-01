const Information = require("../models/information");
const { v4: uuid } = require("uuid");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createInformation(req, res) {
        try {
            const { title, description, date } = req.body;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can create information",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "information",
                    },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        const information = await Information.create({
                            _id: uuid(),
                            title,
                            image: result.url,
                            description,
                            date,
                        });
                        res.status(201).json({
                            status: "success",
                            message: "create information successfully",
                            data: information,
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

    async getAllInformation(req, res) {
        try {
            const information = await Information.find();

            res.status(200).json({
                status: "success",
                message: "get All information successfully",
                data: information,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getInformationById(req, res) {
        try {
            const _id = req.params.id;

            const information = await Information.findOne({ _id });

            res.status(200).json({
                status: "success",
                message: "get information by id successfully",
                data: information,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateInformation(req, res) {
        try {
            const _id = req.params.id;
            const { title, description, date } = req.body;
            const information = await Information.findOne({ _id });

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can update information",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "information-update" },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        information._id = information._id;
                        information.title = title;
                        information.description = description;
                        information.image = result.url;
                        information.date = date;

                        await information.save();

                        res.status(200).json({
                            status: "success",
                            message: "information update successfully",
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

    async deleteInformation(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete information",
                });
            }
            const _id = req.params.id;

            const information = await Information.findById(_id);

            if (!information) {
                return res.status(404).json({
                    status: "error",
                    message: "information not found",
                });
            }

            await Information.findByIdAndDelete(_id);

            res.status(200).json({
                status: "success",
                message: "delete information successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
