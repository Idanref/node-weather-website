const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=ccebc939ed19a2a5de384da3f76596cb&query=${longitude},${latitude}&units=m`;

  request({ url, json: true }, (error, { body }) => {
    const current = body.current;
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      callback(
        undefined,
        `It is currently ${current.temperature}° and it feels like ${current.feelslike}°. The humidity is ${current.humidity}%. 
        Location Coordinates Are: ${longitude}, ${latitude}`
      );
    }
  });
};

module.exports = forecast;
