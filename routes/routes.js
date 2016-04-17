var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var forecast = require('nostradamus');

var appRouter = function(app) {
  app.get("/", function(req, res) {
    res.send("Hello World");
  });

  app.get("/api/stockanalysis", function(req, res){
      var stockQuotes = [];
      var nostroData = [];
      var predictions = [];
      var alpha = 0.5;
      var beta = 0;
      var gamma = 0;
      var period = 2;
      var m = 2;

      var url = "http://www.google.com/finance/getprices?i=900&p=5d&f=d,o,h,l,c,v&df=cpct&q=(ticker)";
      url = url.replace('(ticker)', 'AAPL');

      request({
        url: url,
        json: true
      }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var quotes = body.split("\n");
          var quoteItems = [];
          quotes.forEach(function(quote) {
            quoteItems = quote.split(",");
            if (isNaN(quoteItems[0]) == false && isNaN(quoteItems[1]) == false) {
              //console.log({'date': quoteItems[0], 'quote': quoteItems[1]});
              nostroData.push(parseFloat(quoteItems[1]));
            }
          });
          //console.log(nostroData.length);
          res.send(forecast(nostroData, alpha, beta, gamma, period, m));
        }
      })
  });

}

module.exports = appRouter;
