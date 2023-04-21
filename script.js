/*jslint browser */

// CS 3312, spring 2023
// Exam 2
// YOUR NAME: Kyle Bunger

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Create a function that takes an angle in degrees and converts it to
   // one of the sixteen points of a wind compass.
   const convertDegreesToDirection = function (degrees) {
      if (!Number.isFinite(degrees)) {
         return '';
      }
      const directions = [
         'N', 'NNE', 'NE', 'ENE',
         'E', 'ESE', 'SE', 'SSE',
         'S', 'SSW', 'SW', 'WSW',
         'W', 'WNW', 'NW', 'NNW'
      ];
      return directions[
         Math.round(
            (
               degrees / 360 - Math.floor(degrees / 360)
            ) * directions.length
         ) % directions.length
      ];
   };

   // Create a function that uses the fetch API to make an Ajax request for
   // weather data and updates the page.
   const refreshWeather = function () {

      // Use the latitude and longitude inputs from the page to form a
      // request URI according to a free weather API.
      const weatherRequestUri = (
         'https://api.openweathermap.org/data/2.5/weather?'
         + 'units=imperial&appid=d833ff1752de5f96f228248d5e24059c'
         + '&lat=' + document.querySelector('#latitude').value
         + '&lon=' + document.querySelector('#longitude').value
      );

      fetch(
         // Use the request URI to create a fetch request.
         weatherRequestUri
      ).then(
         // Take the JSON response and create a JavaScript object out of it.
         function (response) {
            return response.json();
         }
      ).then(
         // Use the response object to update the page.
         function (weatherResponse) {
            if (typeof weatherResponse.message === 'string') {
               // If any message is returned (likely because of an error),
               // display it.
               document.querySelector('#message').textContent = (
                  weatherResponse.message
               );
            } else {
               // Otherwise, clear the error message.
               document.querySelector('#message').textContent = '';
            }

            // If everything went well, use the properties of the
            // weatherResponse object to output the data.
            if (weatherResponse.cod === 200) { // HTTP status code 200 means OK

               // Output the city and country.
               document.querySelector('#location').textContent = (
                  weatherResponse.name + ', ' + weatherResponse.sys.country
               );

               // Create a new Date object with the date and time of the
               // weather data.
               const weatherTime = new Date(
                  weatherResponse.dt * 1000 // from seconds to milliseconds
               );

               // Output the time of day.
               document.querySelector('#time').textContent = (
                  weatherTime.toTimeString()
               );

               // Output today's date
               document.querySelector('#date').textContent = (
                  weatherTime.toDateString()
               );

               // Output the broad sky condition (Clear, Clouds, Rain, etc.).
               document.querySelector('#sky-data').textContent = (
                  weatherResponse.weather[0].main
               );

               // Output the specific sky condition
               document.querySelector('#sky-desc-data').textContent = (
                  weatherResponse.weather[0].description
               );

               // Output percentage of cloud cover
               document.querySelector('#cloud-data').textContent = (
                  weatherResponse.clouds.all + '%'
               );

               // Show an icon to match the sky condition.
               document.querySelector('#sky-icon').src = (
                  'https://openweathermap.org/img/w/'
                  + weatherResponse.weather[0].icon + '.png'
               );

               // Output the wind direction and speed.
               document.querySelector('#wind-data').textContent = (
                  convertDegreesToDirection(weatherResponse.wind.deg)
                  + ' ' + weatherResponse.wind.speed
               );

               // Output the barometric pressure, converted to inches of
               // mercury.
               document.querySelector('#pressure-data').textContent = (
                  weatherResponse.main.pressure / 33.8638815789
               ).toFixed(2);

               // Output the humidity as a percentage.
               document.querySelector('#humidity-data').textContent = (
                  weatherResponse.main.humidity + '%'
               );

               // STEP 5: Output temperature data
               document.querySelector('#temperature-data').textContent = (
                  weatherResponse.main.temp
               );
            }
         }
      );
   };

   // Set the default location to San Angelo.
   document.querySelector('#latitude').value = '31.5'; // 31.5 degrees north
   document.querySelector('#longitude').value = '-100.5'; // 100.5 degrees west

   // Get the current weather when the refresh button is clicked.
   document.querySelector('#refresh-weather').addEventListener(
      'click',
      refreshWeather
   );

   // Get the current weather when the page is first loaded.
   refreshWeather();

});
