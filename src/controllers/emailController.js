const nodemailer = require("nodemailer");

module.exports = {
    async sendTransactionDataByEmail(email, htmlData) {
        // Konfigurasi transporter Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "barokah.t.sejahtera@gmail.com",
                pass: "pauloeaxyzztaihq",
            },
        });

        // Buat opsi email
        const mailOptions = {
            from: "barokah.t.sejahtera@gmail.com",
            to: email,
            subject: "Transaction Data",
            html: htmlData,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
    },
};
