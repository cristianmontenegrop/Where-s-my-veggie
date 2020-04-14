document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems);

});

// zipSearch returns data in the JSONP format, in this example searchResultsHandler is the name of the callback method;

// searchResultsHandler(
// {
//    "results": [
//      {"id":"1002192", "marketname":"1.7 Ballston FRESHFARM Market"},
//      {"id":"22008839", "marketname":"1.9 Ballston Farmers Market"},
//      {"id":"1002291", "marketname":"2.1 Four Mile Run Farmers & Artisans Market"},
//      ...
//      {"id":"1002181", "marketname":"4.4 Dupont Circle FRESHFARM Market"}
//    ]
// }
// );

// the id can be used to retrieve detailed information about the market.  The number before the market name is the distance in miles the market is from the center of the zip code that was passed in


// mktDetail returns data in the JSONP format, in this example detailResultHandler is the name of the callback method;

// detailResultHandler(
// {
//    "marketdetails": {
//      "GoogleLink":"http://maps.google.com/?q=38.881112%2C%20-77.112179%20(%22Ballston+FRESHFARM+Market%22)",
//      "Address":"901 N Taylor St, Ballston, Virginia, 22203",
//      "Schedule":"June - October Thursday 3:00 PM to 7:00 PM",
//      "Products":"Baked goods; Cheese and/or dairy products; Eggs; Fresh fruit and vegetables; Fresh and/or dried herbs; Honey; Meat; Poultry"
//    }
// }
// );



$("#search-button").on("click", "getUsdaAPIData");
var zip = 98103;

// Function that runs a search on nearby markets based on Zip code or Coordinates
function getResults(zip) {
    console.log(zip);
    // or
    // function getResults(lat, lng) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service zipSearch or locSearch.
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
        // or
        // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
        dataType: 'jsonp',
        jsonpCallback: 'searchResultsHandler'
    }).then(searchResultsHandler);

}
//iterate through the JSON result object.
function searchResultsHandler(searchResults) {
    // console.log(searchResults)
    for (var key in searchResults) {
        console.log(searchResults.results[0])
        // alert(key);
        var id = searchResults.results[0].id;
        getDetails(id)
        var results = searchResults[key];
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            // console.log(result);
            for (var key in result) {
                // console.log(result[key])
                //only do an alert on the first search result
                if (i == 0) {
                    // console.log(result.id)
                    // alert(result[key]);
                }
            }
        }
    }
}


// Function that gets detail Farmer's market Data
function getDetails(id) {
    console.log(id);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service mktDetail.
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
        dataType: 'jsonp',
        jsonpCallback: 'detailResultHandler'
    }).then(detailResultHandler);
}
// iterate through the JSON result object.
function detailResultHandler(detailresults) {
    for (var key in detailresults) {
        console.log(detailresults);
        var results = detailresults[key];
        console.log(results['GoogleLink']);
    }
}
getResults(zip);