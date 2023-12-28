const Transaction = require("../models/transaction");

module.exports = {
    async getTransactionUserId(req, res) {
        try {
            const userId = req.user._id;

            const transaction = await Transaction.find({
                userId,
            });

            res.status(200).json({
                status: "success",
                message: "get transaction by user id successfully",
                data: transaction,
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
};
