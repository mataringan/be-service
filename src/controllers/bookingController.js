const Booking = require("../models/booking");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { v4: uuid } = require("uuid");
const { sendTransactionDataByEmail } = require("./emailController");

module.exports = {
    async createBooking(req, res) {
        try {
            const userId = req.user.id;

            const { name, phone, address, date, service, type_service, note } =
                req.body;

            const user = await User.findById(userId);

            const booking = await Booking.create({
                _id: uuid(),
                userId,
                name,
                phone,
                address,
                date,
                service,
                type_service,
                note,
            });

            const transaction = await Transaction.create({
                _id: uuid(),
                userId,
                idBooking: booking._id,
                status: "Belum Terverifikasi",
                proofOfTransfer: "",
            });

            const htmlData = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h1 {
            color: #333;
        }

        .booking-details, .transaction-details {
            border: 1px solid #ccc;
            padding: 15px;
            margin-bottom: 20px;
        }

        .booking-details p, .transaction-details p {
            margin-bottom: 10px;
        }

        .booking-details strong, .transaction-details strong {
            font-weight: bold;
        }

        .booking-details p:last-child, .transaction-details p:last-child {
            margin-bottom: 0;
        }

        .booking-status {
            color: #4CAF50; /* Green color for confirmed status */
            font-weight: bold;
        }

        .cancelled-status {
            color: #FF0000; /* Red color for cancelled status */
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Booking Confirmation</h1>
    
    <div class="booking-details">
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>No.Hp:</strong> ${phone}</p>
        <p><strong>Servis:</strong> ${service}</p>
        <p><strong>Tanggal Servis:</strong> ${date}</p>
        <p><strong>Alamat Servis:</strong> ${address}</p>
        <p><strong>Tipe Servis:</strong> ${type_service}</p>
        <p><strong>Catatan:</strong> ${note}</p>
         <p><strong>Status:</strong> 
            <span class="${
                transaction.status === "Belum Terverifikasi"
                    ? "cancelled-status"
                    : "booking-status"
            }">
                ${transaction.status}
            </span>
        </p>
    </div>
</body>
</html>
`;
            sendTransactionDataByEmail(user.email, htmlData);

            res.status(201).json({
                status: "success",
                message: "create booking successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
