var express = require('express');
var app = express();
var logger= require('morgan');

app.set('port', (process.env.PORT || 5000));
app.use(logger('dev'));

app.use(express.static(__dirname = '/public'));

app.get('*', function(req, res) {
  res.send('Hello world.');
});
