$(document).ready(function () {
  var temperature = 0;
  // Get date
  var date = new Date();
  var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  $(".date").html(date.toLocaleString('en-US', options));

  // Get weather in Celcius initially.
  getWeather("c");

  // Set click handler for switch.
  $(".switch").on("click", function () {
    $(this).toggleClass("farenheit");
    if ($(this).hasClass('farenheit')) {
      temperature = convertToFarenheit(temperature);
      $(".temp").html(temperature + "&deg;");
      //getWeather('f');
    }
    else {
      temperature = convertToCelcius(temperature);
      $(".temp").html(temperature + "&deg;");
      //getWeather('c');
    }

  });
  // Gets the weather info.
  // Location data from http://ip-api.com/
  // Weather info from OpenWeatherMap, http://openweathermap.org/
  function getWeather(scaleType) {
    var key = "5bba3b5982f6dffaa404f6489e277b78";
    var units = "";
    var type = "";

    if (scaleType === "c") {
      units = "metric";
      type = " C";
    } else if (scaleType === "f") {
      units = "imperial";
      type = " F";
    }
    // Get the location.
    $.getJSON('http://ip-api.com/json/?callback=?', function (data) {
      var lat = data.lat;
      var lon = data.lon;

      // Now get the current weather data for the location.
      var baseUrl = "http://api.openweathermap.org/data/2.5/";
      
      var weatherUrl = baseUrl + "weather?" + "lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=" + key;
      var forecastUrl = baseUrl + "/forecast/daily?" + "lat=" + lat + "&lon=" + lon + "&cnt=" + 3 + "&units=" + units + "&APPID=" + key;

      $.getJSON(weatherUrl, function (data) {
        //console.log(data);
        var name = data.name;
        var temp = Math.round(parseFloat(data.main.temp));
        var description = data.weather[0].main;
        var icon = data.weather[0].icon;
        var imageUrl = "http://openweathermap.org/img/w/";
        // Populate current weather html elements.
        $(".city").html(name);
        $(".icon").html('<img src=' + imageUrl + icon + '.png>');
        $(".temp").html(temp + "&deg;");
        $(".description").html(description);
        // Set the global variable temp.
        temperature =  temp;
      });

      // Get three day forecast.
      $.getJSON(forecastUrl, function (data) {
        var daysData = (data.list).map(function(item) {
          var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
          var rObj = {};
          rObj.date = new Date(item.dt * 1000).toLocaleString('en-US', options);
          rObj.max = Math.round(item.temp.max);
          rObj.min = Math.round(item.temp.min);
          return rObj;
        });
        console.log(daysData);
      });
    });
  } // end getWeather();

}); // end document.ready();


// Utility functions.
function convertToCelcius(temp) {
  return Math.round((+temp - 32) * 5 / 9);
}

function convertToFarenheit(temp) {
  return Math.round((+temp * 9 / 5) + 32);
}

