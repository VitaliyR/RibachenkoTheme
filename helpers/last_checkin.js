/* env node */

var hbs = require('express-hbs');
var fs = require('fs');
var request = require('request');

var customDataFile = './customData.json';

module.exports = function() {
  /**
   * Checkin helper
   */
  (function() {
    var dataFile = fs.readFileSync(customDataFile, { encoding: 'utf-8' });
    var token = JSON.parse(dataFile).tokens.foursquare;

    var apiURL = 'https://api.foursquare.com/v2/users/self/checkins?limit=1&v=20160211&oauth_token=' + token;
    var userID = '14010500';
    var cacheTime = 1000 * 60 * 10;

    hbs.registerAsyncHelper('last_checkin', function(o, helperCB) {
      fs.readFile(customDataFile, function(err, data) {
        if (err) {
          throw err;
        }

        data = JSON.parse(data);

        if (!data.checkin) {
          data.checkin = {
            executed: 0
          };
        }

        var replyToHelper = function(checkinData) {
          helperCB(o.fn(checkinData));
        };

        var now = Date.now();
        if ((now - cacheTime) > data.checkin.executed) {
          request(apiURL, function(_, res, resData) {
            if (!res) {
              return replyToHelper(data.checkin.data);
            }

            resData = JSON.parse(resData);

            data.checkin.data = resData.response.checkins.items[0];
            data.checkin.data.userId = userID;
            data.checkin.executed = now;

            fs.writeFile(customDataFile, JSON.stringify(data), function() {
              replyToHelper(data.checkin.data);
            });
          });
        } else {
          replyToHelper(data.checkin.data);
        }
      });
    });
  })();
};
