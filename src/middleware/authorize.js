const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    async authorize(req, res, next) {
        try {
            const bearerToken = req.headers.authorization;
            const token = bearerToken.split("Bearer ")[1];
            const tokenPayload = jwt.verify(
                token,
                process.env.JWT_SIGNATURE_KEY || "Rahasia"
            );
            req.user = await User.findById(tokenPayload._id);
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                status: "Unauthorized",
                message: error.message,
            });
        }
    },
};
