var express = require('express');
var cors = require('cors');
var app = express();
var path = require('path');

app.set('port', 4201);

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next){
  res.status(404);
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Listening on port ' + port);
});