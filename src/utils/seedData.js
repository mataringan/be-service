const fs = require("fs");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const seedData = async () => {
    const usersData = JSON.parse(
        fs.readFileSync(`${__dirname}/../_seedData/users.json`, "utf-8")
    );

    try {
        for (const userData of usersData) {
            const existingUser = await User.findOne({ _id: userData._id });
            if (!existingUser) {
                // Hash password sebelum menyimpannya
                const hashedPassword = await bcrypt.hash(userData.password, 10); // Angka 10 adalah salt round

                // Ganti password dengan hashed password
                userData.password = hashedPassword;

                await User.create(userData);
                console.log(`Data berhasil diimpor: ${userData._id}`);
            }
        }

        console.log(`Semua data berhasil diimpor.`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = seedData;
