var pastSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Creating global variables for manipulation, lon and lat needed for uv index.
var targetCity = "";

var cityLon = "";
var cityLat = "";
var queryURLuv = "http://api.openweathermap.org/data/2.5/uvi?appid=4e48182efcaca931751b0b92eccfb27d&lat=" + cityLat + "&lon=" + cityLon
// Render stored city data, called at refresh and when a new city is added.
function renderSearches() {
  $("#pastSearches").empty();

  for (i = 0; i < pastSearches.length; i++) {
    $("#pastSearches").append(
      $("<li class='list-group-item city bg-dark text-light'>").text(pastSearches[i])
    );
  }
}

// Displays weather data for the selected city, called when a new city is added and when a stored city is selected
function displayWeather(city) {
    // var apiKey = "4e48182efcaca931751b0b92eccfb27d"
    var queryURLmain = "https://api.openweathermap.org/data/2.5/weather?appid=4e48182efcaca931751b0b92eccfb27d&units=imperial&q=" + city


    // Populates main Weather Chart
    $.ajax({
        url: queryURLmain,
        method: "GET"
    }).then(function(response){
        // console.log(response)
        $("#cityName").text(response.name)
        $("#date").text("  " + moment().format("L"))
        $("#temp").text(response.main.temp.toFixed(1))
        $("#humid").text(response.main.humidity)
        $("#windSpeed").text(response.wind.speed)
        cityLon = response.coord.lon
        cityLat = response.coord.lat
        // console.log(cityLat + ", " + cityLon)

        // Takes lat and lon from previous object and finds the UV Index.
        
        queryURLuv = "https://api.openweathermap.org/data/2.5/uvi?appid=4e48182efcaca931751b0b92eccfb27d&lat=" + cityLat + "&lon=" + cityLon
        
        $.ajax({
            url: queryURLuv,
            method: "GET"
        }).then(function(response) {
            // console.log(response)
            indexNumber = response.value.toFixed(2)
            $("#uvIndex").text(indexNumber)
            $("#uvIndex").attr("class", "")
            if (indexNumber < 3) {
                $("#uvIndex").addClass("bg-success p-2 rounded-pill text-light font-weight-bold")
            } else if (indexNumber < 6) {
                $("#uvIndex").addClass("bg-warning p-2 rounded-pill font-weight-bold")
            } else {
                $("#uvIndex").addClass("bg-danger p-2 rounded-pill text-light font-weight-bold")
            }
        })

    })

    // Calls for 5 day forecast information and populates chart.
    var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?appid=4e48182efcaca931751b0b92eccfb27d&units=imperial&q=" + city

    $.ajax ({
        url: queryURLforecast,
        method: "GET"
    }).then(function(response) {
        // console.log(response)

        // Runs 5 times, one for each box
        for (i=0; i<5; i++) {
            $("#forecast"+i).empty()
            var foreDate = moment().add(i+1, 'days').format("L")
            $("#forecast"+i).append($("<h5>").text(foreDate))
            
            // gives us a search value for the incoming API array.
            var newIndex = i * 8 + 6;
            // console.log(response.list[newIndex])
            $("#forecast"+i).append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[newIndex].weather[0].icon + "@2x.png"))
            $("#forecast"+i).append($("<p>").text("Temp: " + response.list[newIndex].main.temp + "°F"))
            $("#forecast"+i).append($("<p>").text("Humidity: " + response.list[newIndex].main.humidity + "%"))

            // console.log(response.list[newIndex].main.temp)
        }

    })

}

// Adds a new city
$("#cityForm").on("submit", function (event) {
  event.preventDefault();

  if ($("#newCity").val() !== "") {
    var city = $("#newCity").val().trim();
    // console.log(city)
    pastSearches.push(city);

    localStorage.setItem("searchHistory", JSON.stringify(pastSearches));

    $("#newCity").val("");

    // console.log(pastSearches);

    // console.log(JSON.parse(localStorage.getItem("searchHistory")));

    renderSearches();

    displayWeather(city);
  }
});

$(document).on("click", ".city", function () {
  targetCity = $(this).text();
  console.log(targetCity);
  displayWeather(targetCity);
});

renderSearches();

if (pastSearches[0] !== null) {
    displayWeather(pastSearches[0])
}