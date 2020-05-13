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
      $("<li class='list-group-item city'>").text(pastSearches[i])
    );
  }
}

// Displays weather data for the selected city, called when a new city is added and when a stored city is selected
function displayWeather(city) {
    // var apiKey = "4e48182efcaca931751b0b92eccfb27d"
    var queryURLmain = "https://api.openweathermap.org/data/2.5/weather?appid=4e48182efcaca931751b0b92eccfb27d&units=imperial&q=" + city

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
        queryURLuv = "http://api.openweathermap.org/data/2.5/uvi?appid=4e48182efcaca931751b0b92eccfb27d&lat=" + cityLat + "&lon=" + cityLon

        $.ajax({
            url: queryURLuv,
            method: "GET"
        }).then(function(response) {
            // console.log(response)
            indexNumber = response.value.toFixed(2)
            $("#uvIndex").text(indexNumber)
            if (indexNumber <= 3) {
                $("#uvIndex").addClass("bg-success p-2 rounded-pill text-light")
            } else if (indexNumber <= 6) {
                $("#uvIndex").addClass("bg-warning p-2 rounded-pill")
            } else {
                $("#uvIndex").addClass("bg-danger p-2 rounded-pill text-light")
            }
        })

    })

    var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?appid=4e48182efcaca931751b0b92eccfb27d&q=" + city

    $.ajax ({
        url: queryURLforecast,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        for (i=0; i<5; i++) {
            var foreDate = moment().add(i+1, 'days').format("L")
            $("#forecast"+i).append($("<h5>").text(foreDate))
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

    console.log(pastSearches);

    console.log(JSON.parse(localStorage.getItem("searchHistory")));

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
