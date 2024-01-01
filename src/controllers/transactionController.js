const Transaction = require("../models/transaction");
const User = require("../models/user");
const cloudinary = require("../middleware/cloudinary");
const { sendTransactionDataByEmail } = require("./emailController");

module.exports = {
    async getTransactionUserId(req, res) {
        try {
            const userId = req.user._id;

            const transaction = await Transaction.find({
                userId,
            })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = transaction.map((transaction) => ({
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                status: transaction.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get transaction by user id successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getPaymenTransactionDataUser(req, res) {
        try {
            const userId = req.user._id;

            const transaction = await Transaction.find({
                userId,
                image: { $ne: "" },
            })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = transaction.map((transaction) => ({
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                status: transaction.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get transaction by user id successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getTransactionById(req, res) {
        try {
            const _id = req.params.id;

            const transaction = await Transaction.findOne({ _id })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = {
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                status: transaction.status,
            };

            res.status(200).json({
                status: "success",
                message: "get transaction by id successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getUnverifiedTransaction(req, res) {
        try {
            const userId = req.user._id;
            const transaction = await Transaction.find({
                userId,
                status: "Belum Terverifikasi",
            })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = transaction.map((transaction) => ({
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                status: transaction.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get transaction unverified successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getUnverifiedTransactionAdmin(req, res) {
        try {
            if (req.user.role !== "admin" && req.user.role !== "super admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message:
                        "only admin or super admin can get all unverified transaction",
                });
            }
            const transaction = await Transaction.find({
                status: "Belum Terverifikasi",
            })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = transaction.map((transaction) => ({
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                status: transaction.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get All Transaction Unverified Admin",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateTransactionUnverified(req, res) {
        try {
            const _id = req.params.id;

            const transaction = await Transaction.findOne({
                _id,
                // status: "Belum Terverifikasi",
            });

            if (!transaction) {
                return res.status(404).json({
                    status: "error",
                    message: "data transaction not found",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    { folder: "transaction" },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }
                        transaction._id = transaction._id;
                        transaction.userId = transaction.userId;
                        transaction.idBooking = transaction.idBooking;
                        transaction.image = result.url;
                        transaction.status = "Belum Terverifikasi";

                        await transaction.save();

                        res.status(200).json({
                            status: "success",
                            message: "transaction update successfully",
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

    async getPayTransactionAdmin(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can get pay transaction",
                });
            }

            // Use Mongoose query to find transactions with non-empty images
            const transaction = await Transaction.find({ image: { $ne: "" } });

            res.status(200).json({
                status: "success",
                message: "get data pay transaction successfully",
                data: transaction,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getPayTransactionUser(req, res) {
        try {
            const userId = req.user._id;

            // Use Mongoose query to find transactions with non-empty images
            const transaction = await Transaction.find({
                userId,
                image: { $in: "" },
            })
                .populate({
                    path: "idBooking",
                    select: "name phone address date service type_service note",
                })
                .select("status");

            const formattedData = transaction.map((transaction) => ({
                _id: transaction._id,
                booking: {
                    _id: transaction.idBooking._id,
                    name: transaction.idBooking.name,
                    address: transaction.idBooking.address,
                    date: transaction.idBooking.date,
                    service: transaction.idBooking.service,
                    type_service: transaction.idBooking.type_service,
                    note: transaction.idBooking.note,
                },
                image: transaction.image,
                status: transaction.status,
            }));

            res.status(200).json({
                status: "success",
                message: "get data pay transaction successfully",
                data: formattedData,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateStatusTransaction(req, res) {
        try {
            const _id = req.params.id;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can update status transaction",
                });
            }

            const transaction = await Transaction.findById(_id);

            const user = await User.findOne({ _id: transaction.userId });

            transaction.status = "Diverifikasi";
            await transaction.save();

            const htmlData = `
            <html>
                <head>
                    <title>Status Pembayaran Diverifikasi</title>
                </head>
                <body>
                    <h1>Selamat!</h1>
                    <p>Pembayaran Anda untuk transaksi dengan ID ${_id} telah diverifikasi.</p>
                </body>
            </html>
        `;
            sendTransactionDataByEmail(user.email, htmlData);

            res.status(200).json({
                status: "success",
                message: "update status transaction successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async deleteTransaction(req, res) {
        try {
            const _id = req.params.id;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can delete transaction",
                });
            }
            const transaction = await Transaction.findById(_id);

            if (!transaction) {
                return res.status(404).json({
                    status: "error",
                    message: "transaction not found",
                });
            }

            await Transaction.findByIdAndDelete(_id);

            res.status(200).json({
                status: "success",
                message: "delete transaction successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
