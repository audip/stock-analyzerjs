var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var forecast = require('nostradamus');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));
app.use(express.static('files'));
// app.use('/css', express.static(__dirname + '/public'));
var routes = require("./routes.js")(app);
var data_test = 20;
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
