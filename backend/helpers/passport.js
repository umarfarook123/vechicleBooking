const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret, // Replace with your actual secret
};
const { findOne } = require("./query_helper");

const initializePassportJwtStrategy = (passport) => {
    passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {

        let { data: userData } = await findOne('employee', { _id: jwtPayload.userId }, { role: 1 });

        if (userData) {
            done(null, { id: userData._id, role: userData.role });
        } else {
            done(null, false);
        }
    }));
};

module.exports = initializePassportJwtStrategy;