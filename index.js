var express = require('express');
var app = express();

var calls = require('./routes/calls')
fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'));

app.use('/calls', calls)


app.get('*', function(req, res) {
  res.send('Hello world.');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
