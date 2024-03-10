const allowedOrigins = ["http://localhost:3000"];
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require('../config/config')

exports.isOriginVerify = (req, res, next) => {
  let origin = req.headers["origin"];

  var index = allowedOrigins.indexOf(origin);
  if (index > -1) {
    next();
  } else {
    return res.json({ status: 401, message: "Unauthorized Request" });
  }
};

exports.jwtVerify = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.json({ status: 401, message: "token is required" })

  try {
    req.userId = jwt.verify(token, "SECRETDKHDWK").userId;
    next()
  } catch (err) {

    return res.json({ status: false, message: "Invalid token" });
  }
};



exports.authenticateJWT = (roles = '') => (req, res, next) => {


  passport.authenticate('jwt', { session: false }, (err, user) => {

    if (err) {
      // Handle JWT authentication errors here
      if (err.name === 'TokenExpiredError') {
        return res.json({ status: false, message: "token is required" });
      }
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (!user) {
      return res.json({ status: false, message: "Unauthorized" });
    }

    if (roles == 'admin' && roles !== user.role) return res.json({ status: false, message: "you are not allowed" });


    req.user = user; 
    next();
  })(req, res, next);
};
