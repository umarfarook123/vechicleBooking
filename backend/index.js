const express = require('express');
const app = express();
const cors = require('cors');
const trimRequest = require('trim-request');

const fs = require('fs');
var https = require('https');
const passport = require('passport');

require('./DB_config/db');

if (process.env.NODE_ENV == 'local' || typeof process.env.NODE_ENV == 'undefined') {

    var config = require('./config/local.js');
    var http = require('http');
    var server = http.createServer(app);
    var port = config.port;

} else {
    var config = require('./config/prod.js');
    var options = {
        key: fs.readFileSync(''),
        cert: fs.readFileSync(''),
    };
    var server = https.createServer(options, app);
    var port = config.port;

}

app.use(express.json({
    limit: '50mb'
}));

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.clearCookie("__cfduid");
    return next();
});


app.use(trimRequest.all);

const passportConfig = require('./helpers/passport');
app.use(passport.initialize());
passportConfig(passport);
app.use('/', require('./routes/vehicle.route.js'));


server.listen(port, () => console.log(`Express server running on port ` + port));


