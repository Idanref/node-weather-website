const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Idan Refaeli',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Idan Refaeli',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text.',
    title: 'Help',
    name: 'Idan Refaeli',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'Address must be provided',
    });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }

    forecast(longitude, latitude, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      });
    });
  });
});

app.get('/products', (req, res) => {
  // console.log(req.query); // will show the data query of the URL search

  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term!',
    });
  }
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Idan Refaeli',
    errorMessage: 'Help Document Not Found! Error 404',
  });
});

app.get('*', (req, res) => {
  // '*' stands for - everything that hasn't been matched so far
  // this app.get should come after all other app.get
  res.render('404', {
    title: 404,
    name: 'Idan Refaeli',
    errorMessage: 'Page Not Found! Error Number: 404',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
