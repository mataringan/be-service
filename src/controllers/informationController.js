const Information = require("../models/information");
const { v4: uuid } = require("uuid");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createInformation(req, res) {
        try {
            const { title, image, description, date } = req.body;

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
};
