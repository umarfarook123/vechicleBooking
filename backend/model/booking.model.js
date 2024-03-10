const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const BOOKING_HSTRY = new mongoose.Schema({

    vehicleID: { type: mongoose.Schema.Types.ObjectId, required: true, index: 1 },
    startDate: { type: Date, index: 1 },
    endDate: { type: Date, index: 1 },
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'BOOKING_HSTRY', BOOKING_HSTRY, dbPrefix + 'BOOKING_HSTRY');