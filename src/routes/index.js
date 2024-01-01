const express = require("express");
const { handleRoot } = require("../controllers/root");
const {
    register,
    login,
    verifyUser,
    resendOTP,
    whoami,
} = require("../controllers/authController");

const { authorize } = require("../middleware/authorize");

const validator = require("../middleware/validation");

const {
    createUser,
    getUserByQuery,
    getUserById,
    updateUser,
    updateUserWithToken,
    deleteUser,
} = require("../controllers/userController");
const { createBooking } = require("../controllers/bookingController");
const {
    getTransactionUserId,
    getTransactionById,
    getUnverifiedTransaction,
    getUnverifiedTransactionAdmin,
    updateTransactionUnverified,
    updateStatusTransaction,
    deleteTransaction,
    getPayTransactionUser,
    getPayTransactionAdmin,
    getPaymenTransactionDataUser,
} = require("../controllers/transactionController");
const {
    createInformation,
    getAllInformation,
} = require("../controllers/informationController");

const router = express.Router();

// Auth

router.get("/", handleRoot);

router.post("/register", register);

router.post("/login", login);

router.put("/verify-user", verifyUser);

router.post("/resend-otp", resendOTP);

router.post("/create-user", authorize, createUser);

router.get("/user", authorize, getUserByQuery);

router.get("/user/:id", authorize, getUserById);

router.put("/user/:id", authorize, updateUser);

router.put("/user", authorize, validator, updateUserWithToken);

router.delete("/user/:id", authorize, deleteUser);

router.get("/whoami", authorize, whoami);

// Booking

router.post("/booking", authorize, createBooking);

// Transaction

router.get("/transaction", authorize, getTransactionUserId);

router.get("/transaction/:id", authorize, getTransactionById);

router.get("/transaction-unverified", authorize, getUnverifiedTransaction);

router.get(
    "/transaction-unverified-admin",
    authorize,
    getUnverifiedTransactionAdmin
);

router.put(
    "/pay-transaction/:id",
    authorize,
    validator,
    updateTransactionUnverified
);

router.get("/admin-transaction", authorize, getPayTransactionAdmin);

router.get("/user-transaction", authorize, getPayTransactionUser);

router.get("/user-payment", authorize, getPaymenTransactionDataUser);

router.put("/update-status/:id", authorize, updateStatusTransaction);

router.delete("/transaction/:id", authorize, deleteTransaction);

// Information

router.post("/information", validator, authorize, createInformation);

router.get("/information", getAllInformation);

module.exports = router;
