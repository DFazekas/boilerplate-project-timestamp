// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



// No timestamp provided - use current time. 
app.get("/api/timestamp/", function(request, response, next) {
  request.utc = new Date().toUTCString();
  request.unix = new Date(request.utc).getTime();
  
  printDate(request, response);
  next();
});


// Timestamp provided - use given.
app.get("/api/timestamp/:time", function(request, response, next) {
  var time = request.params.time;
  
  if ( !isNaN(Date.parse(time)) ) {
    // Unix timestamp acquired.
    request.unix = Date.parse(time);
    
    // Get UTC timestamp.
    request.utc = new Date(time).toUTCString();
  } 
  
  else {
    // NOT Unix - try UTC.
    time *= 1000;
    
    if ( (!isNaN(new Date(time))) ) {
      // UTC timestamp acquired.
      request.utc = new Date(time).toUTCString();
      
      // Get Unix timestamp.
      request.unix = time;
    }
    
    else {
      // Neither Unix or UTC - invalid date.
      request.errMsg = "Invalid Date";
    }
  }
  
  printDate(request, response);
  next();
});

var printDate = function(request, response) {
  if (!request.hasOwnProperty("errMsg")) {
    // Print date.
    response.json({
      "unix": request.unix,
      "utc" : request.utc 
    });
  } 
  
  else {
    // Print error message.
    response.json({
      "error": request.errMsg
    });
  }
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});





module.exports = app;
