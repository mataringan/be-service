const express = require("express");
const mongoose = require("mongoose");
const apiRouters = require("./src/routes/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const seedData = require("./src/utils/seedData");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/", apiRouters);
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
    })
    .then(() => {
        seedData();
        app.listen(9000, () => {
            console.log("Connection Success");
        });
    })
    .catch((err) => console.log(err));
