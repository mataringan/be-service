const Service = require("../models/service");
const { v4: uuid } = require("uuid");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    async createService(req, res) {
        try {
            const { name, typeservice, detailService } = req.body;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can create service",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "service",
                    },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        const service = await Service.create({
                            _id: uuid(),
                            name,
                            image: result.url,
                            typeservice,
                            detailService,
                        });
                        res.status(201).json({
                            status: "success",
                            message: "create service successfully",
                            data: service,
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

    async getAllService(req, res) {
        try {
            const typeservice = req.query.service ? req.query.service : "";

            const querySearch = {
                typeservice: { $regex: new RegExp(typeservice, "i") },
            };

            const service = await Service.find(querySearch);

            res.status(200).json({
                status: "success",
                message: "get All service successfully",
                data: service,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getServiceById(req, res) {
        try {
            const _id = req.params.id;

            const service = await Service.findOne({ _id });

            res.status(200).json({
                status: "success",
                message: "get service by id successfully",
                data: service,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateService(req, res) {
        try {
            const _id = req.params.id;
            const { name, typeservice, detailService } = req.body;
            const service = await Service.findOne({ _id });

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can update service",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "service-update" },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        service._id = service._id;
                        service.name = name;
                        service.typeservice = typeservice;
                        service.image = result.url;
                        service.detailService = detailService;

                        await service.save();

                        res.status(200).json({
                            status: "success",
                            message: "service update successfully",
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

    async deleteService(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete service",
                });
            }
            const _id = req.params.id;

            const service = await Service.findById(_id);

            if (!service) {
                return res.status(404).json({
                    status: "error",
                    message: "service not found",
                });
            }

            await Service.findByIdAndDelete(_id);

            res.status(200).json({
                status: "success",
                message: "delete service successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
