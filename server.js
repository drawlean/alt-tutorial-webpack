var express = require('express')
var path = require('path')

var app = express()

let locations = [
  { id: 0, name: 'Abu Dhabi' },
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bogota' },
  { id: 3, name: 'Buenos Aires' },
  { id: 4, name: 'Cairo' },
  { id: 5, name: 'Chicago' },
  { id: 6, name: 'Lima' },
  { id: 7, name: 'London' },
  { id: 8, name: 'Miami' },
  { id: 9, name: 'Moscow' },
  { id: 10, name: 'Mumbai' },
  { id: 11, name: 'Paris' },
  { id: 12, name: 'San Francisco' }
];

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

app.get("/api/locations", function(req,res) {

  new Promise(function (resolve, reject) {
    // simulate an asynchronous flow
    setTimeout(function () {

      // change this to `false` to see the error action being handled.
      if (true) {
        // resolve with some mock data
        res.send(locations);
        resolve();
      } else {
        reject('Things have broken');
      }
    }, 1000);
  });

})

// send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})



var PORT = 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})