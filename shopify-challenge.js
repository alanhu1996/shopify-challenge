/*
	A program I wrote to help me determine the answer.
*/
var async = require('async');


var http = require("https");

var totalOrders = [];
var availableCookies = 0;

// I examined the pages and the orders fill up 3 pages.
// Grabbing data from these 3 pages.
async.waterfall([function(callback) {
	var options = {
	  "method": "GET",
	  "hostname": "backend-challenge-fall-2017.herokuapp.com",
	  "port": null,
	  "path": "/orders.json?page=1",
	  "headers": {
	    "cache-control": "no-cache"
	  }
	};

	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on("end", function () {
	    var body = Buffer.concat(chunks);
	    var jsonFormatBody = JSON.parse(body);
	    var totalPages = jsonFormatBody.pagination.total;
	    availableCookies = jsonFormatBody.available_cookies;

	    totalOrders = totalOrders.concat(jsonFormatBody.orders);
	    callback(null);

	  });
	});
	req.end();
},
function(callback) {
	options = {
	  "method": "GET",
	  "hostname": "backend-challenge-fall-2017.herokuapp.com",
	  "port": null,
	  "path": "/orders.json?page=2",
	  "headers": {
	    "cache-control": "no-cache"
	  }

	};
	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on("end", function () {
	    var body = Buffer.concat(chunks);
	    var jsonFormatBody = JSON.parse(body);
	    var totalPages = jsonFormatBody.pagination.total;

	    totalOrders = totalOrders.concat(jsonFormatBody.orders);
	    callback(null);

	  });
	});


	req.end();
},
function(callback) {

	options = {
	  "method": "GET",
	  "hostname": "backend-challenge-fall-2017.herokuapp.com",
	  "port": null,
	  "path": "/orders.json?page=3",
	  "headers": {
	    "cache-control": "no-cache"
	  }

	};
	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on("end", function () {
	    var body = Buffer.concat(chunks);
	    var jsonFormatBody = JSON.parse(body);
	    var totalPages = jsonFormatBody.pagination.total;

	    totalOrders = totalOrders.concat(jsonFormatBody.orders);
	    callback(null);


	  });
	});



	req.end();
}], function(err) {
	// Parsing the order data. Applying the conditions listed in the question.

	var ordersWithCookies = totalOrders.filter(function(item) {
		return item.products.filter(function(i) {
			return i.title === "Cookie" && i.amount <= availableCookies;

		}).length !== 0;

		
	});

	var cookieAmountList = ordersWithCookies.map(function(item) {
		return {amount: item.products.filter(function(i) {
			return i.title === "Cookie";
		})[0].amount, 
		id: item.id};
	}).sort(function(a, b) {
		return a.amount < b.amount;
	});

	var unfulfilledOrders = [];
	for(var i = 0; i < cookieAmountList.length; i++) {
		if(availableCookies - cookieAmountList[i].amount < 0) {
			unfulfilledOrders.push(cookieAmountList[i].id);
		} else {
			availableCookies -= cookieAmountList[i].amount;
		}
	}
	var finalAnswer = {
		remaining_cookies: availableCookies,
		unfulfilled_orders: unfulfilledOrders.sort(function(a, b) {
			return a - b;
		})
	};
	// Outputting the final answer.
	console.log(finalAnswer);

} );
