var pastSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

function renderSearches() {
    $("#pastSearches").empty()

    for (i = 0; i < pastSearches.length; i++) {

        $("#pastSearches").append($("<li class='list-group-item city'>").text(pastSearches[i]))
    }
}

$("#cityForm").on("submit", function (event) {
    event.preventDefault();

    var city = $("#newCity").val().trim();
    // console.log(city)
    pastSearches.push(city);

    localStorage.setItem("searchHistory", JSON.stringify(pastSearches));

    $("#newCity").val("");
    
    console.log(pastSearches)

    console.log(JSON.parse(localStorage.getItem("searchHistory")))

    renderSearches()
});

$(document).on("click", ".city", function(){
    var targetCity = $(this).text();
    console.log(targetCity)
    
})



renderSearches()