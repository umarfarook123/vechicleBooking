const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResponse = require("../helpers/send_response");
const fs = require('fs');
const path = require('path');
const common = require("../helpers/common");
const {
    create,
    find,
    findOne,
    updateOne,
    deleteOne, aggregation,
    countDocuments, insertmany
} = require("../helpers/query_helper");
const async = require('async');

const config = require('../config/config')


exports.vehicleSeed = async (req, res) => {

    try {

        let seedWheelTypeData = await fs.readFileSync('./SeedData/wheelType.json', 'utf8');
        let seedVehicleTypeData = await fs.readFileSync('./SeedData/vehicleType.json', 'utf8');
        let seedVehicleData = await fs.readFileSync('./SeedData/vehicle.json', 'utf8');

        if (!seedWheelTypeData.length || !seedVehicleTypeData.length || !seedVehicleData.length) return sendResponse(res, false, '', 'Error Occured in seed data')
        seedWheelTypeData = JSON.parse(seedWheelTypeData);
        seedVehicleTypeData = JSON.parse(seedVehicleTypeData);
        seedVehicleData = JSON.parse(seedVehicleData);


        let { data: vechicleExist } = await findOne('VEHICLE', {}, { _id: 1 });
        if (vechicleExist) return sendResponse(res, false, '', 'Data already Seeded');

        let { status: status1, message: message1, data: vehicleTypeData } = await insertmany('VEHICLE_TYPE', seedVehicleTypeData);
        if (!status1) return sendResponse(res, false, '', "Something wrong!", "", message1);

        let { status: status2, message: message2, data: wheelTypeData } = await insertmany('WHEEL', seedWheelTypeData);
        if (!status2) return sendResponse(res, false, '', "Something wrong!", "", message2);

        let { status: status3, message: message3, data: vehicleData } = await insertmany('VEHICLE', seedVehicleData);
        if (!status3) return sendResponse(res, false, '', "Something wrong!", "", message3);

        return sendResponse(res, true, '', "Vehicle data Seeded Succesfully!")
    }
    catch (err) {
        return sendResponse(res, false, '', 'Error Occured1' + err.message)
    }

}

exports.vehicleData = async (req, res) => {

    let api = req.originalUrl;
    let { count, wheelType, vehicleType } = req.params;
    try {

        if (api == '/active-wheels') {

            let { data: wheelData } = await find('WHEEL', { status: true }, { wheelType: 1 });
            if (!wheelData.length) return sendResponse(res, false, "", "No Wheels Found!");
            wheelData = wheelData.map(wheel => wheel.wheelType);
            return sendResponse(res, true, wheelData);

        }
        else if (api.includes('/active-vehicle-types')) {
            console.log("innnn")
            let validator = await common.validateField(['wheelType'], req.params);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);


            let { data: wheelExist } = await findOne('WHEEL', { wheelType, status: true });
            if (!wheelExist) return sendResponse(res, false, "", "No wheel type Found!");
            let { data: vehicleTypeData } = await find('VEHICLE_TYPE', { status: true, wheelType }, { vehicleType: 1 });

            if (!vehicleTypeData.length) return sendResponse(res, false, "", "No Wheels Found!");
            vehicleTypeData = vehicleTypeData.map(vehicleType => vehicleType.vehicleType);
            return sendResponse(res, true, vehicleTypeData);

        }
        else if (api.includes('/active-models')) {

            let validator = await common.validateField(['vehicleType'], req.params);
            if (!validator.status) return sendResponse(res, false, '', validator.message, '', validator.errors);

            let { data: vehicleTypeExist } = await findOne('VEHICLE_TYPE', { vehicleType, status: true });
            if (!vehicleTypeExist) return sendResponse(res, false, "", "No Vehicle type Found!");

            let { data: vehicleData } = await find('VEHICLE', { vehicleType }, { model: 1 });
            console.log("vehicleData", vehicleData)

            if (!vehicleData.length) return sendResponse(res, false, "", "No Model Found!");
            return sendResponse(res, true, vehicleData);

        }



    } catch (err) {

        return sendResponse(res, false, "", err.message);

    }

}

exports.bookVehicle = async (req, res) => {

    let { firstName, lastName, vehicleID, startDate, endDate } = req.body;

    let findQuery = {
        $and: [{ vehicleID }, {
            $or: [
                { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
                { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
                { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
            ]
        }]
    };

    try {


        let validator = await common.validateField(['firstName', 'lastName', 'vehicleID', 'startDate', 'endDate'], req.body);
        if (!validator.status) return sendResponse(res, 472, '', validator.message, '', validator.errors);

        if (new Date(startDate) >= new Date(endDate)) return sendResponse(res, false, "", "Start date must before the end date");

        let { data: vehicleExist } = await findOne('VEHICLE', { _id: vehicleID });
        if (!vehicleExist) return sendResponse(res, false, "", "Model not found");

        let { data: overLapingData } = await findOne('BOOKING', findQuery);
        if (overLapingData) return sendResponse(res, false, "", "Model not avalaible at this date");

        let { status, data: bookingCreate } = await create('BOOKING', { firstName, lastName, vehicleID, startDate, endDate });
        if (!status) return sendResponse(res, false, '', "Something wrong!");

        let { status: updStatus, data: bookUpd } = await updateOne('VEHICLE', { _id: vehicleID }, { $set: { bookingEndDate: endDate } });
        if (!updStatus) return sendResponse(res, false, '', "Something wrong!");

        return sendResponse(res, true, '', "Booking completed successfully!");

    } catch (err) {

        return sendResponse(res, false, "", err.message);
    }

}
