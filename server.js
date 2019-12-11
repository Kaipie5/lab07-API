'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.get('/', (request, response) => {
    console.log("HELLLOOOOOOOO")
    response.send("Hello from the back side");
    // let city = request.query.data;

    // console.log(city);
    // let locationObj = searchLatToLong(city);
    // responseObj = {
    //     "search_query": city,
    //     "formatted_query": city,
    //     "latitude": locationObj.latitude,
    //     "longitude": locationObj.longitude
    // }
    // console.log(responseObj);

    // response.send(responseObj);
})

app.get('/location', (request, response) => {
    console.log(" ALSO HELLOOOOOO")
    let city = request.query.data;

    console.log(city);
    let responseObject = createResponseObjLocation(city);
    
    console.log(responseObject);
    if (responseObject.status === errorResponse().status) {
        response.status(500).send(responseObject)
    } else {
        response.send(responseObject);
    }

    
})

function createResponseObjLocation(searchQuery) {
    const geoData = require('./data/geo.json');
    for (let i = 0; i < geoData.results.length; i++) {
        if (geoData.results[i].address_components[0].long_name.toLowerCase() === searchQuery.toLowerCase()) {
            
            let locationObj = new Location(searchQuery, geoData.results[i]);

            return locationObj
        }
    }
    console.log("FAILED TO FIND CITY")
    
    return errorResponse();

    // const locationObj = {
    //   "search_query": city,
    //   "formatted_query": geoDataResults.formatted_address,
    //   "latitude": geoDataResults.geometry.location.lat,
    //   "longitude": geoDataResults.geometry.location.lng
    // }
}

app.get('/weather', (request, response) => {
    /*[
  {
    "forecast": "Partly cloudy until afternoon.",
    "time": "Mon Jan 01 2001"
  },
  {
    "forecast": "Mostly cloudy in the morning.",
    "time": "Tue Jan 02 2001"
  },
  ...
]*/
    console.log(" Weather HELLOOOOOO")

    let responseObject = createResponseObjWeather();
    
    console.log(responseObject);

    response.send(responseObject);
    

})

function createResponseObjWeather() {
    const weatherData = require('./data/darksky.json');

    let weatherObjList = []
    for (let i = 0; i < weatherData.daily.data.length; i++) {
        weatherObjList.push(new Weather(weatherData.daily.data[i]));
    }
    return weatherObjList

}

function errorResponse() {
    return {
        "status": 500,
        "responseText": "Sorry something went wrong"
    }
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