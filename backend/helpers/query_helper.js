const db = require("../helpers/collections");

exports.find = async (collection, query, projection, options) => {
    if (!collection) return { status: false, message: "collection not found" };
    try {
        let data = await db[collection].find(query, projection, options);
        return { status: true, data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.findOne = async (collection, query, projection, options) => {

    if (!collection) return { status: false, message: "collection not found" };
    try {
        let data = await db[collection].findOne(query, projection, options);
        return { status: true, data };

    } catch (err) {
        console.error(err);
        return { status: false, message: err.message };
    }
};


exports.create = async (collection, info) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].create(info);
        return { status: true, data };
    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.updateOne = async (collection, query, updInfo) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].findOne(query);
        if (!data) return { status: false, message: "data not found" };

        let updData = await db[collection].updateOne(query,
            updInfo
        );
        return { status: true, updData };
    } catch (err) {

        return { status: false, message: err.message };
    }
};

exports.deleteOne = async (collection, query) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].findOne(query);

        if (!data) return { status: false, message: "data not found" };

        let deletedData = await db[collection].deleteOne({ _id: data._id });
        return { status: true, deletedData };

    } catch (err) {
        return { status: false, message: err.message };
    }
};

exports.countDocuments = async (collection, query) => {
    if (!collection) return { status: false, message: "collection not found" };

    try {
        let data = await db[collection].countDocuments(query);

        return data;

    } catch (err) {
        return { status: false, message: err.message };
    }
};


exports.insertmany = async (collection, data = []) => {
    console.log(data[0])
    try {

        if (!collection) return { status: false, message: "collection not found" };


        let updated = await db[collection].insertMany(data)
        if (!updated) return { status: false, message: "Something went wrong" };
        return { status: true, data: updated }


    } catch (err) {
console.log(err)
        return { status: false, message: "Something went wrong", err };

    }
}

exports.aggregation = async (collection, pipeline) => {

    try {

        if (!collection) return sendResponse(response, false, '', 'Collection not found')

        let result = await db[collection].aggregate(pipeline);

        if (result) {

            return result
        }
        else if (!result) {

            return false
        }

    } catch (err) {

        return false
    }
}