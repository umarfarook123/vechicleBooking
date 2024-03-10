const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const vehicle = new mongoose.Schema({

    wheelType: { type: Number, required: true, index: 1},
    vehicleType: { type: String, required: true, index: 1,lowercase:true},
    model: { type: String, required: true, index: 1},

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'VEHICLE', vehicle, dbPrefix + 'VEHICLE');