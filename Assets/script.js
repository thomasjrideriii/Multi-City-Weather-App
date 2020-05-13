var pastSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

var targetCity = "";

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
function displayWeather(city) {}

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
