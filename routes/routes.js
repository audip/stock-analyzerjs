var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var forecast = require('nostradamus');
var regex = require('regex');
var sentiment = require('sentiment');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'YvkutpGKLE5GF7tTgj6C6Rl2N',
  consumer_secret: 'S4X411AEQTkageVCDkkJ1gubLofTwOn8wf2ls9O78EpxKCorTZ',
  access_token_key: '69119995-zW2hPiy02doO1MEF7FcOu16k8GTqyp49BhNACiYG1',
  access_token_secret: 'U8qdm7Z83W3mzIYPQ12RW2x9wKVuALYxEjzgb3xTpfRKD'
});

var appRouter = function(app) {
    app.get("/", function(req, res, next) {
      res.statusCode = 200;
      res.send("This is an API server.");
    });

    app.get("/api/stockanalysis/:stock", function(req, res, next) {
      var stockQuotes = [];
      var nostroData = [];
      var predictions = [];
      var alpha = 0.5;
      var beta = 0;
      var gamma = 0;
      var period = 2;
      var m = 2;
      var count = 1;

      var url = "http://www.google.com/finance/getprices?i=900&p=5d&f=d,o,h,l,c,v&df=cpct&q=(ticker)";
      url = url.replace('(ticker)', req.params.stock);

      request({
        url: url,
        json: true
      }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var quotes = body.split("\n");
          var quoteItems = [];
          quotes.forEach(function(quote) {
            quoteItems = quote.split(",");
            if (isNaN(quoteItems[0]) === false && isNaN(quoteItems[1]) === false) {
              //console.log({'date': quoteItems[0], 'quote': quoteItems[1]});
              count += 1;
              nostroData.push(parseFloat(quoteItems[1]));
            }
          });
          console.log(nostroData.length);
          if (nostroData.length % m !== 0)
              nostroData.splice(0, 0, 0);
          res.send(forecast(nostroData, alpha, beta, gamma, period, m));

        }
      });
    });

    app.get("/api/twittersentiment/:stock", function(req, res) {

      client.get('search/tweets', {
        q: req.params.stock,
        lang: "en",
        count: 1000
      }, function(error, tweets, response) {
        results = [];

        var positive = 0;
        var negative = 0;
        var probs = 0.5;

        for (var i = 0; i < tweets.statuses.length; i++) {
          var text = tweets.statuses[i].text;
          var cleansedURL = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
          var analyse = sentiment(cleansedURL);

          if (analyse.score > 0) {
            positive += 1;
          } else if (analyse.score < 0) {
            negative += 1;
          }
          probs += analyse.comparative * analyse.score;
        }
        var prediction = "";

        if ((positive - negative) > (0.33 * (positive + negative))) {
          prediction += "BUY, ";
        } else if ((negative - positive) > (0.10 * (positive + negative))) {
          prediction += "SELL, ";
        } else {
          prediction += "HOLD, ";
        }

        var highest = 0;
        var lowest = 0;

        if (positive >= negative) {
          highest = positive;
          lowest = negative;
        } else {
          highest = negative;
          lowest = positive;
        }

        var percent = 100 * Math.abs(highest - lowest) / highest;
        var prob = (probs / (positive + negative));
        prob = prob.toFixed(2);
        prediction += prob+", "+positive+", "+negative+", ";
        prediction += Math.round(percent * 100)/100;

        res.send({
          positive: positive,
          negative: negative,
          probabilities: prob,
          prediction: prediction
        });
      });
    });
}

module.exports = appRouter;
