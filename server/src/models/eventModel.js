const { DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelizeConfig");

const Event = sequelize.define("Event", {
  eventId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventHost: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventSchedStart: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  eventSchedEnd: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  eventLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  eventRemarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  reasonPosponedCancelled: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  invitedEmails: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  approvedEventStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  needRD: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needARD: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needLGMED: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needLGCDD: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needORD: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needFAD: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needPDMU: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needRICTU: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  needLEGAL: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Event;
