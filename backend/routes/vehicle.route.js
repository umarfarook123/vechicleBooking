// NPM
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, res, cb) => {
        cb(null, Date.now())
    }
})


// CONTROLLERS

const { isOriginVerify, authenticateJWT } = require('../helpers/origin_check');
const { vehicleData, vehicleSeed, bookVehicle } = require('../controller/vehicle.controller');


router.get('/vehicle-seed', vehicleSeed);

router.get(['/active-wheels', '/active-vehicle-types/:wheelType', '/active-models/:vehicleType'], vehicleData);

router.post('/book-vehicle', bookVehicle);


module.exports = router;