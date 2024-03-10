const mongoose = require("mongoose");
const dbPrefix = require('../config/config').dbPrefix;

const wheel = new mongoose.Schema({

    wheelType: { type: Number, required: true, index: 1},
    status: { type: Boolean,  index: 1,default:false},

}, { "versionKey": false }, { timestamps: true });

module.exports = mongoose.model(dbPrefix + 'wheel', wheel, dbPrefix + 'wheel');