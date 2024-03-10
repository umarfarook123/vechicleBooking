const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const VEHICLE_TYPE = new mongoose.Schema({

    wheelType: { type: Number, required: true,  index: 1},
    vehicleType: { type: String, required: true, index: 1,lowercase:true},
    status: { type: Boolean,  index: 1,default:false},

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'VEHICLE_TYPE', VEHICLE_TYPE, dbPrefix + 'VEHICLE_TYPE');