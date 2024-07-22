const { DataTypes } = require("sequelize");
const { Op } = require("sequelize");

const sequelize = require("../configs/sequelizeConfig");

const OTP = sequelize.define("OTP", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// New method to generate and store OTP
OTP.generateAndStoreOTP = async function (email) {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiration to 5 minutes

    await OTP.create({
        email,
        otp: generatedOTP,
        createdAt: new Date(),
        expires: otpExpiration
    });

    return generatedOTP;
};

// Method to remove expired OTP entries
OTP.removeExpiredEntries = async function () {
    await OTP.destroy({
        where: {
            expires: {
                [Op.lt]: new Date()
            }
        }
    });
};

module.exports = OTP;
