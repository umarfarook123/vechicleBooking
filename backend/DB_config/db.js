var mongoose = require('mongoose');

if (process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'undefined') {
  var config = require('./../config/local.js');
  var DBconnection =config.DBconnection;
  console.log(process.env.NODE_ENV,"DBconnection", DBconnection)



}
else {


  var config = require('./../config/prod.js');
  var DBconnection =config.DBconnection;


}


module.exports = config;
function connectDB() {
  mongoose.connect(DBconnection, {
    useUnifiedTopology: true, useNewUrlParser: true
  }).then((res) => { console.log('Mongo DB connected') }).catch(error => console.log("mongo connection error----------->", error));
}



connectDB();



mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to DATE' + new Date());
});

// If the connection throws an error

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
  connectDB();
});

// When the connection is disconnected

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected', new Date());
  connectDB();
});

// If the Node process ends, close the Mongoose connection

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
     
    process.exit(0);
  });
});


