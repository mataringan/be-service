const { v4: uuid } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const salt = 10;
const cloudinary = require("../middleware/cloudinary");

function encryptPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, encryptedPassword) => {
            if (!!err) {
                reject(err);
                return;
            }
            resolve(encryptedPassword);
        });
    });
}

function checkPassword(encryptedPassword, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(
            password,
            encryptedPassword,
            (err, isPasswordCorrect) => {
                if (!!err) {
                    reject(err);
                    return;
                }
                resolve(isPasswordCorrect);
            }
        );
    });
}

function generateOTP() {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

module.exports = {
    async sendOTPByEmail(email, otp) {
        try {
            // configure nodemailer transporter
            const transporter = nodemailer.createTransport({
                // host: "smtp.gmail.com",
                // port: 465,
                // secure: true,
                service: "gmail",
                auth: {
                    user: "barokah.t.sejahtera@gmail.com",
                    pass: "pauloeaxyzztaihq",
                },
            });

            // compose email message
            const mailOptions = {
                from: "barokah.t.sejahtera@gmail.com",
                to: email,
                subject: "OTP Verification",
                html: ` 
            <center>
            <h1 style="text-align: center; font-family: Arial, sans-serif; background-color: #DEC9FF;">Verification Code</h1>
            <p style="font-size: 17px; text-align: left; font-family: Arial, sans-serif";">To verify your account, enter this code below:</p>
            <p style="font-size: 26px; font-weight: bold; text-align: center; font-family: Arial, sans-serif;">${otp}</p>
            </center>`,
            };

            // send email
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
        }
    },

    async createUser(req, res) {
        try {
            const password = await encryptPassword(req.body.password);
            const { name, email, phone, role } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "Email and Password is required",
                });
            }

            // validator email format using regex
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: "error",
                    message: "Email format is invalid",
                });
            }

            const findEmail = await User.findOne({
                email,
            });

            if (findEmail) {
                return res.status(400).json({
                    status: "error",
                    message: "email already exist",
                    data: {},
                });
            }

            // Generate otp
            const otp = generateOTP();
            const otpExpirationValidity = 5; // Menentukan validitas kedaluwarsa OTP dalam menit
            const otpExpiration = new Date();
            otpExpiration.setMinutes(
                otpExpiration.getMinutes() + otpExpirationValidity
            ); // Menambahkan waktu kedaluwarsa OTP dalam menit

            if (req.user.role === "admin") {
                const addUser = await User.create({
                    _id: uuid(),
                    name,
                    email,
                    phone,
                    otp,
                    otpExpiration: otpExpiration.toISOString(),
                    verified: false,
                    role,
                    password,
                    image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                });

                res.status(201).json({
                    status: "success",
                    message: `create data user successfully, please check email for verify`,
                });

                module.exports.sendOTPByEmail(addUser.email, addUser.otp);
            } else {
                return res.status(403).json({
                    status: "failed",
                    message: "only admin or  admin create user",
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getUserByQuery(req, res) {
        try {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "forbidden",
                    message: "only admin can get user",
                });
            }

            const name = req.query.name ? req.query.name : "";
            const role = req.query.role ? req.query.role : "";

            const querySearch = {};

            let roleCondition;

            if (name) {
                querySearch.name = new RegExp(name, "i");
            }
            if (role) {
                // querySearch.role = new RegExp(role, "i");
                roleCondition = role;
            } else {
                roleCondition = ["karyawan", "user"];
            }

            const users = await User.find({
                ...querySearch,
                role: roleCondition,
            });

            if (users) {
                const data = users.map((user) => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                }));
                res.status(200).json({
                    status: "success",
                    message: "get all user by query successfully",
                    data: data,
                });
            }

            // res.status(200).json({
            //     status: "success",
            //     message: "get all user by query successfully",
            //     data: users,
            // });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getUserById(req, res) {
        try {
            const _id = req.params.id;
            if (req.user.role === "admin") {
                const data = await User.findOne({
                    _id,
                });

                if (data) {
                    dataUser = {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        role: data.role,
                    };
                }

                res.status(200).json({
                    status: "success",
                    message: "get user by id successfully",
                    data: dataUser,
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateUser(req, res) {
        try {
            const _id = req.params.id;
            const { name, email, phone, role } = req.body;
            if (req.user.role === "admin") {
                const user = await User.findOne({
                    _id,
                });

                user.name = name;
                user.email = email;
                user.phone = phone;
                user.role = role;

                await user.save();

                res.status(200).json({
                    status: "success",
                    message: "update user successfully",
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async updateUserWithToken(req, res) {
        try {
            const _id = req.user._id;
            const { name, email, phone } = req.body;

            const user = await User.findById(_id);

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found",
                });
            }

            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const file = `data:${req.file.mimetype};base64,${fileBase64}`;

                cloudinary.uploader.upload(
                    file,
                    {
                        folder: "user-service",
                    },
                    async function (err, result) {
                        if (!!err) {
                            res.status(400).json({
                                status: "upload fail",
                                message: err.message,
                            });
                        }

                        user.name = name;
                        user.email = email;
                        user.phone = phone;
                        user.image = result.url;

                        await user.save();

                        res.status(200).json({
                            status: "success",
                            message: "User updated successfully",
                        });
                    }
                );
            } else {
                user.name = name;
                user.email = email;
                user.phone = phone;

                await user.save();

                res.status(200).json({
                    status: "success",
                    message: "User updated successfully",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    async deleteUser(req, res) {
        try {
            const _id = req.params.id;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    status: "error",
                    message: "only admin can delete user",
                });
            }

            const user = await User.findByIdAndDelete({
                _id,
            });

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "user not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "user deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
