
var key = "5bba3b5982f6dffaa404f6489e277b78";
var units = "metric";
var lat;
var lon;
// Location data from http://ip-api.com/
// Weather info from OpenWeatherMap, http://openweathermap.org/
var locationServiceUrl = "https://freegeoip.net/json/";
var baseUrl = "http://api.openweathermap.org/data/2.5/";

var temperature = 0;

// Shorthand for document.querySelector.
var qs = function (selector, context) {
    this.context = context || document;
    return this.context.querySelector(selector);
};
var qsAll = function (selector, context) {
    this.context = context || document;
    return this.context.querySelectorAll(selector);
};

// Get date
var date = new Date();
var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
// Display the date.
qs(".date").innerHTML = date.toLocaleString('en-US', options);

// Set click handler for celcius/farenheit switch.
qs(".switch").onclick = function (event) {
    var temp = qs(".temp", document);
    if (this.classList.contains("farenheit")) {
        this.classList.remove("farenheit");
        temperature = convertToCelcius(temperature);
    } else {
        this.classList.add("farenheit");
        temperature = convertToFarenheit(temperature);
    }
    qs(".temp").innerHTML = temperature + "&deg;";
};

// Set click handler for .forecast .day divs.
qsAll(".day").forEach(function (day) {
    day.onclick = function (event) {
        qsAll(".day").forEach(function (item) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            }
        });
        day.classList.add("active");
    };
});


// Get location, then current weather, then forecast.
getLocation().then(function (result) {
    console.log(result);
    lat = JSON.parse(result).latitude;
    lon = JSON.parse(result).longitude;
    return getCurrent(lat, lon);
}).then(function (result) {
    console.log(result);
    renderCurrent(JSON.parse(result));
    return getForecast(lat, lon);
}).then(function (result) {
    console.log(result);
    renderForecast(JSON.parse(result));
    showPage();
}).catch(function (error) {
    console.log(error);
});

// The core functions.
function getLocation() {
    var url = locationServiceUrl;
    return ajax(url);
};

function getCurrent(lat, lon) {
    var url = baseUrl + "weather?" + "lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=" + key;
    return ajax(url);
};

function getForecast(lat, lon) {
    var url = baseUrl + "/forecast/daily?" + "lat=" + lat + "&lon=" + lon + "&cnt=" + 3 + "&units=" + units + "&APPID=" + key;
    return ajax(url);
};

function renderCurrent(data) {
    var name = data.name;
    var temp = Math.round(parseFloat(data.main.temp));
    var description = data.weather[0].main;
    var icon = data.weather[0].icon;
    var imageUrl = "http://openweathermap.org/img/w/";
    // Populate current weather html elements.
    qs(".city").innerHTML = name;;
    qs(".icon").innerHTML = '<img src=' + imageUrl + icon + '.png>';
    qs(".temp").innerHTML = "<span class='tight'>" + temp + "</span>" + "<span class='deg'>&deg;</span>";
    qs(".description").innerHTML = description;
    // Set the global variable temp.
    temperature = temp;
}

function renderForecast(data) {
    var imageUrl = "http://openweathermap.org/img/w/";
    // Put data for each day into an object. Put the object into daysData array.
    var daysData = (data.list).map(function (item) {
        var options = { weekday: 'short', day: 'numeric' };
        var obj = {};
        // Here I'm organizing the datestring format to my liking.
        var temp = new Date(item.dt * 1000).toLocaleString('en-US', options);
        obj.date = temp.split(" ")[1] + " " + temp.split(" ")[0];
        obj.icon = item.weather[0].icon;
        obj.max = Math.round(item.temp.max);
        obj.min = Math.round(item.temp.min);
        obj.description = item.weather[0].description;
        return obj;
    });
    // Get an array of all the .day divs in the forecast section of the html.
    var dayDivs = Array.from(qsAll(".day"));

    // Populate the .day divs with data from the daysData array.
    for (var i = 0; i < dayDivs.length; i++) {
        qs(".date", dayDivs[i]).innerHTML = daysData[i].date;
        qs(".icon", dayDivs[i]).innerHTML = '<img src=' + imageUrl + daysData[i].icon + '.png>';
        qs(".max", dayDivs[i]).innerHTML = daysData[i].max + '&deg;';
        qs(".min", dayDivs[i]).innerHTML = daysData[i].min + '&deg;';
        var description = daysData[i].description;
        qs(".description", dayDivs[i]).innerHTML = description[0].toUpperCase() + description.slice(1);
    }
}

// Utility functions.
function ajax(url) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onload = function () {
            // According to https://developers.google.com/web/fundamentals/getting-started/primers/promises
            // this is called even on 404 etc, so check status.
            if (request.status == 200) {
                resolve(this.responseText);
            } else {
                reject(Error(request.statusText))
            }
        };
        request.onerror = function () {
            reject(Error('Network error'));
        };
        request.open('GET', url);
        request.send();
    });
}

function convertToCelcius(temp) {
    return Math.round((+temp - 32) * 5 / 9);
}

function convertToFarenheit(temp) {
    return Math.round((+temp * 9 / 5) + 32);
}

function showPage() {
    qs(".container").style.opacity = 1;
    qs(".spinner").style.display = "none";
}

// Render details.
function renderDetails(data) {

}




