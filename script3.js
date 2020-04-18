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





// Pseudocode: 
// get the API from location IQ 
// The response of Location IQ API gets put into the USDA API through function getUSDAResultsZip or getUSDAResultsAddress
// getUsdaResults runs and retrieves a list of 10 results
// Those 10 results get sent to getUsdaDetails
// The Ajax call gets looped through the whole list of results to get the detail from the whole list
// those details get appended into Markets page. 


$("#search-address-button").on("click", "getCoordinatesFromAddress");

function convertUsdaResultsZip() {

    var searchZip = "98103";
    $.ajax({
        type: "GET",
        url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&postalcode=" + searchZip + "&format=json"
    }).then(function (addressResponse) {
        console.log(addressResponse)
        console.log(addressResponse[0].lat, addressResponse[0].lon)
    });
};

function convertUsdaResultsAddress() {

    var country = "USA";
    var city = "Seattle";
    var zip = 98102;
    var address = "1202 e thomas st";
    $.ajax({
        type: "GET",
        url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&street=" + address + "&city=" + city + "&postalcode=" + zip + "&format=json"
    }).then(function (addressResponse) {
        console.log(addressResponse);
        var lat = addressResponse[0].lat
        var lng = addressResponse[0].lon
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
            dataType: 'jsonp',
            jsonpCallback: 'searchResultsHandler'
        }).then(function (usdaResponse) {

            console.log(usdaResponse);

            var results = usdaResponse.results;
            var myIdArr = [];
            var marketNameArr = [];
            var ix = 0;

            for (var i = 0; i < results.length; i++) {

                var item = results[i]
                myIdArr.push(item.id);
                marketNameArr.push(item.marketname.substring(4));
            }

            var timer = setInterval(function () {
                ix;
                var myIdUsda = myIdArr[ix]
                var marketName = marketNameArr[ix];

                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + myIdUsda,
                    dataType: 'jsonp',
                }).then(function (detail) {
                    var usdaMarketAddress = detail.marketdetails.Address;
                    $.ajax({
                        type: "GET",
                        url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&q=" + usdaMarketAddress + "&format=json"
                    }).then(function (addressResponse) {
                        var lat = addressResponse[0].lat
                        var lng = addressResponse[0].lon
                        addMarker(lat, lng, marketName, ix)
                        ix = ix + 1
                    });
                });

                if (ix == 4) {
                    clearInterval(timer);
                };
            }, 550);

            // append html
            // !!!!!!!!
            // REfresh along with the search button.

        });
    });
};



function addMarker(lat, lng, marketName, ix) {

    console.log(lat);
    console.log(lng);
    console.log(marketName);
    console.log(ix);
}

function searchResultsHandler(searchResults) {

    var results = searchResults.results;

    for (var i = 0; i < results.length; i++) {

        var item = results[i]
        var myId = item.id;
        var marketName = item.marketname.substring(4);

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + myId,
            dataType: 'jsonp',
        }).then(function (detail) {

            generalResults.push(detail);
        });
    };
};


// function renderMarketData(detail, marketName) {


//     $("#opener").text(marketName);


// }


function getMarketCoordinates(addresses) {
    console.log("WHAT!!")
    // var yay = JSON.parse(addresses);
    var arr = $.makeArray(addresses);

    // console.log(yay);
    // console.log(yoy);
    // console.log(arr);

    $(arr).map(function () {
        // console.log(address)
        // Call to get the Coordinates of each Market
        $.ajax({
            type: "GET",
            url: "https://us1.locationiq.com/v1/search.php?key=3968761b6c52cf&q=" + address + "&format=json"
        }).then(function (addressResponse) {
            // var count = detail.unshift(addressResponse);
            console.log(addressResponse)
            console.log(addressResponse[0].lat, addressResponse[0].lon)
        });


    });
}

// Function that gets detail Farmer's market Data
function getUsdaDetails(id) {
    console.log(id);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service mktDetail.
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
        dataType: 'jsonp',
        jsonpCallback: 'detailResultHandler'
    }).then(function detailResultHandler(detailResult) {
        console.log(detailResult)
    });
}

// iterate through the JSON result object.
// function detailResultHandler(detailResult) {
// console.log(detailResult)
// for (var key in detailresults) {
// console.log(detailresults);
// var results = detailresults[key];
// console.log(results['GoogleLink']);
// }
// }
convertUsdaResultsAddress();

// console.log(detail);