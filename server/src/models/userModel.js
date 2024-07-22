const { DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelizeConfig");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jobPosition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignedOffice: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
