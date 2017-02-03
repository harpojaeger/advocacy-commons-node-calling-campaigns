var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'));

app.get('/call/:campaign(*)??', function(req, res) {
  res.render('campaign_full', { title: 'A campaign page', message: 'This is the page for the ' + req.params.campaign + ' campaign.' })
});

app.get('*', function(req, res) {
  res.send('Hello world.');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});