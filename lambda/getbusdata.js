var request = require("request");

exports.handler = function (event, context, callback) {
  console.log(event.queryStringParameters.rt);
  const routes = event.queryStringParameters.rt;
  const busLocationsUrl = `http://ctabustracker.com/bustime/api/v2/getvehicles?key=8rWBbYr4wbNziLJYRDvaJKK7n&format=json&rt=${routes}`;
  request.get(busLocationsUrl, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      callback(null, {
        statusCode: 200,
        body: body,
      });
    }
  });
};
