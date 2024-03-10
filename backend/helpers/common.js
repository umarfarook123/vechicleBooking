
var send_mail = require('./mail_model');
const geoip = require('geoip-lite');
const useragent = require('express-useragent');
const AWS = require("aws-sdk");
const fs = require("fs");



exports.getIPAddress = (request) => {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip[0];
}


exports.getIPAddressLocation = async (request) => {

    var agent = useragent.parse(request.headers['user-agent']);

    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"

    let geo = await geoip.lookup(ip[0]);
    let location = geo ? geo.country + ' | ' + geo.region + ' | ' + geo.city : null;

    return { ipAddress: ip[0], location, browser_name: agent.browser, os: agent.os.toString() };
}

exports.update_pass = (updateData) => {
    return new Promise((resolve, reject) => {
        userDB.updateOne({ _id: updateData._id }, { $set: updateData }, (err, updateRes) => {
        });
    });
}

exports.formatDate = (type, date) => {
    if (type == 'date') {
        return dateFormat.asString("dd-MM-yyyy", new Date(date));
    } else if (type == 'time') {
        return dateFormat.asString("hh:mm:ss", new Date(date));
    } else if (type == 'ym') {
        return dateFormat.asString("yyyyMMdd", new Date(date));
    } else if (type == "tradechart") {
        return new Date(dateFormat.asString("yyyy-MM-dd hh:mm", new Date(date))).getTime() / 1000;
    } else if (type == "order") {
        return dateFormat.asString("dd-MM-yyyy hh:mm:ss", new Date(date));
    } else if (type == 'liq_trade_chart') {
        return new Date(dateFormat.asString("yyyy-MM-dd hh:mm", date / 1000));
    } else {
        return dateFormat.asString("dd-MM-yyyy hh:mm:ss", new Date(date));
    }
}

exports.validateAddress = (address) => {
    return Web3.utils.isAddress(String(address).toLowerCase());
}

exports.makeIdEncrypted = (data, field, aggr) => {

    data = data.map(v => {
        let newObj;
        if (aggr) {
            newObj = { ...{}, ...v };
        } else {
            newObj = { ...{}, ...v._doc };
        }
        newObj["_id"] = encrypt_decrypt.encrypt_params(String(v._id).valueOf());

        // delete newObj._id;
        return newObj;
    });
    return data;
}

//


exports.jwtSign = (adminId) => {

    const token = jwt.sign({ user_id: adminId }, config.JWTtoken, { expiresIn: "1d" });

    return token;


}

//SEARCH PAGINATION HELPERS

exports.pagination = (data) => {

    let { page, size, sortBy, orderBy, searchBy } = data;

    page = Number(page), size = Number(size), orderBy = Number(orderBy);

    var skip = isNaN(page * size) ? 0 : page * size;
    var limit = size ? size : 10;
    orderBy = orderBy ? orderBy : -1;
    var sort = !sortBy || sortBy == 'null' ? { _id: orderBy } : { [sortBy]: orderBy }
    let options = { sort, skip, limit }

    return options;


}

exports.searchQuery = (defaultFind, searchField, reqBody) => {

    let containNum = searchField.some(item => item.includes("|Number"));
    let containEnc = searchField.some(item => item.includes("|Encrypted"));

    let { searchBy } = reqBody; let searchData;


    if (defaultFind && Object.keys(defaultFind).length) {

        if (searchBy && searchField.length && defaultFind) {


            if (!isNaN(searchBy) && containNum && !isAddress(searchBy)) {
                searchField = searchField.map(element => element.includes('|') ? element.split('|')[0].trim() : undefined).filter(element => element !== undefined);
                searchData = searchField.map(key => { return { [key]: Number(searchBy) } });
            }
            else if (containEnc && isEmail(searchBy)) {

                searchBy = encrypt_decrypt.encrypt(searchBy)
                searchField = searchField.map(element => element.includes('|') ? element.split('|')[0].trim() : undefined).filter(element => element !== undefined);
                searchData = searchField.map(key => { return { [key]: searchBy } });


            }
            else {
                searchField = searchField.filter(function (element) { return !element.includes('|') });
                searchData = searchField.map(key => { return { [key]: { $regex: new RegExp(searchBy, "i") } } });


            }

            return { $and: [defaultFind, { $or: searchData }] }
        }
        else {
            return defaultFind;
        }
    }
    else {

        if (searchBy && searchField.length) {


            if (!isNaN(searchBy) && containNum && !isAddress(searchBy)) {

                searchField = searchField.map(element => element.includes('|') ? element.split('|')[0].trim() : undefined).filter(element => element !== undefined);
                searchData = searchField.map(key => { return { [key]: Number(searchBy) } });

            }
            else if (containEnc && isEmail(searchBy)) {

                searchBy = encrypt_decrypt.encrypt(searchBy)
                searchField = searchField.map(element => element.includes('|') ? element.split('|')[0].trim() : undefined).filter(element => element !== undefined);
                searchData = searchField.map(key => { return { [key]: searchBy } });
            }

            else {

                searchField = searchField.filter(function (element) { return !element.includes('|') });
                searchData = searchField.map(key => { return { [key]: { $regex: new RegExp(searchBy.toString(), "i") } } });

            }

            return { $or: searchData };

        }
        else {
            return {}
        }

    }

}


exports.filterQuery = (findQuery, filter, filterFields, range, rangeFields) => {



    const filterObj = filter ? (Object.fromEntries(Object.keys(filter).map(key => {

        if (Array.isArray(filter[key]) && filter[key].length === 0 || !filterFields.includes(key)) {
            return null;
        }
        return [key, { "$in": filter[key] }];
    }).filter(Boolean))) : {};

    const rangeObj = range ? (Object.fromEntries(Object.keys(range).map(key => {
        if (Array.isArray(range[key]) && range[key].length === 0 || !rangeFields.includes(key)) {
            return null;
        }
        return [key, { "$gte": range[key][0], "$lte": range[key][1] }];
    }).filter(Boolean))) : {};


    if (findQuery.hasOwnProperty('$and')) {

        findQuery['$and'].splice(1, 0, filterObj, rangeObj);;
    }
    else {

        findQuery = { '$and': [filterObj, rangeObj, findQuery] };
    }
    return findQuery;

}


exports.s3SingleUpload = async (reqFile) => {

    try {


        const { mimetype, filename, path } = reqFile;
        let key = filename + '.' + mimetype.split("/")[1];
        const blob = fs.readFileSync(path);
        const uploadedImage = await s3bucket.upload({ Bucket: config.BUCKET_NAME, Key: key, Body: blob, ACL: 'public-read', ContentType: mimetype }).promise()
        const imgLink = uploadedImage.Location ? uploadedImage.Location : false;
        return imgLink;

    }
    catch (err) {

        return false;
    }

};

exports.s3MultipleUpload = async (reqFile) => {

    try {

        let files = {}


        const responses = await Promise.all(reqFile.map(async param => {
            const { mimetype, filename, path, fieldname } = param;

            let key = filename + '.' + mimetype.split("/")[1];

            const blob = fs.readFileSync(path)
            const uploadedImage = await s3bucket.upload({
                Bucket: config.BUCKET_NAME,
                Key: 'image/' + key,
                Body: blob,
                ACL: 'public-read',
                ContentType: mimetype,
            }).promise()

            imgLink = uploadedImage.Location ? uploadedImage.Location : false;

            files[fieldname] = imgLink

        }
        ))


        return files


    }
    catch (err) {

        return false;
    }

};



const { Validator } = require('node-input-validator');

exports.validateField = async (fields, reqBody) => {

    try {

        let checkFields = {}
        let data = fields.map(key => {
            checkFields[key] = key === 'email' ? 'required|email' : key === 'startDate' ? 'required|dateFormat:YYYY-MM-DD' : key === 'startDate' ? 'required|dateFormat:YYYY-MM-DD' : key === 'lastName' ? 'required|maxLength:10' : key === 'firstName' ? 'required|maxLength:10' : key === 'userName' ? 'required|maxLength:10' : key === 'count' ? 'required|numeric|integer|between:1,100' : 'required';
        });
        const v = new Validator(reqBody, checkFields);

        const checKFileds = await v.check().then((matched) => {
            if (!matched) {
                return { status: false, message: v.errors[Object.keys(v.errors)[0]].message, errors: v.errors }
            }
            else {
                return { status: true }
            }
        })
        return checKFileds

    }
    catch (err) {
        ("exports.validateField= ~ err:", err)
        return { status: false };
    }

};

const { create, find, findOne, updateOne, countDocuments, findOneNull, updateOneNull, insertmany, aggregation } = require('./query_helper');

const crypto = require('crypto');
const faker = require('faker');


exports.incStringNum = (lastNum, preString, initVal) => {

    lastNum = lastNum ? lastNum : initVal; // Initial value
    lastNum = isNaN(Number(lastNum)) ? parseInt(lastNum.replace(new RegExp(preString, 'g'), '',)) : lastNum;

    lastNum = (lastNum + 1).toString().padStart(3, '0');


    return lastNum = preString + lastNum;

}

exports.roundOf = (value, decimal) => {

    let roundedValue = +(Math.round(value + "e" + decimal) + "e" + - decimal);

    roundedValue = !isNaN(roundedValue) ? roundedValue : value;


    return +(Math.round(value + "e" + decimal) + "e" + - decimal);

}

exports.generateFakeData = () => {
    return {
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
        role: faker.random.arrayElement(['user', 'admin']),
        dob: faker.date.past(),

    };
}


exports.UserNameCheck = async (request, collection) => {

    const { email, userName } = request;
    try {

        let { data: userNameData } = await findOne(collection, { userName }, { userName: 1, email: 1 });
        if (!userNameData || userNameData['email'] == email) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        ("exports.UserNameCheck= ~ err:", err)
        return false;
    }
}

exports.pagination = (data) => {

    let { page, size, sortBy, orderBy, searchBy } = data;

    page = Number(page), size = Number(size), orderBy = Number(orderBy);

    var skip = isNaN(page * size) ? 0 : page * size;
    var limit = size ? size : 10;
    orderBy = orderBy ? orderBy : -1;
    var sort = !sortBy || sortBy == 'null' ? { _id: orderBy } : { [sortBy]: orderBy }
    let options = { sort, skip, limit }

    return options;


}
