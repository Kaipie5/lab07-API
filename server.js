'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());

// allows us to get real data
const superagent = require('superagent');

const PORT = process.env.PORT;

let currentLat = 0;
let currentLng = 0;

app.get('/', (request, response) => {
    console.log("HELLLOOOOOOOO")
    response.send("Hello from the back side");
    // console.log(city);
    // let locationObj = searchLatToLong(city);
    // responseObj = {
    //     "search_query": city,
    //     "formatted_query": city,
    //     "latitude": locationObj.latitude,
    //     "longitude": locationObj.longitude
    // }
})



app.get('/location', (request, response) => {
    console.log(" ALSO HELLOOOOOO")

    try{  
        createResponseObjLocation(request, response);      
    }
    catch(error){
        console.error(error); // will turn the error message red if the environment supports it

        response.status(500).send('Sorry something went wrong');
    }

    
})

function createResponseObjLocation(request, response) {
    // const geoData = require('./data/geo.json');
    const city = request.query.data;
    console.log(city)

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url)
    .then(results => {
        console.log(results.body.results[0])

        let locationObj = new Location(city, results.body.results[0]);
        console.log(locationObj)
        currentLat = locationObj.latitude
        currentLng = locationObj.longitude

        console.log("RESPONSE LOCATION", locationObj);
        response.send(locationObj);
        
    
    });
}

app.get('/weather', (request, response) => {

    console.log(" Weather HELLOOOOOO")
    // console.log(request)

    try{
        
    
        createResponseObjWeather(request, response);
    
        
    }
    catch(error){
        console.error(error); // will turn the error message red if the environment supports it

        response.status(500).send('Sorry something went wrong');
    }
    

})

function createResponseObjWeather(request, response) {
    // const weatherData = require('./data/darksky.json');
    console.log("LAT LNG", currentLat, currentLng)
    let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${currentLat},${currentLng}`;

  superagent.get(url)
    .then(results => {

        let weatherObjList = results.body.daily.data.map( (dayForecast) => {
            return new Weather(dayForecast)
        });

        console.log("WEATHER OBJ", weatherObjList)


        console.log("RESPONSE WEATHER", weatherObjList);
        response.send(weatherObjList);
        
    });

}

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

function Location(city, geoDataResults){
    this.search_query = city;
    this.formatted_query = geoDataResults.formatted_address;
    this.latitude = geoDataResults.geometry.location.lat;
    this.longitude = geoDataResults.geometry.location.lng;
  }

  function Weather(darkSkyDataResults){
    this.forecast = darkSkyDataResults.summary;
    let date = new Date(darkSkyDataResults.time * 1000)
    this.time = date.toString();
  }