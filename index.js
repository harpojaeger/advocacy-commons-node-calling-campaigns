var express = require('express');
var app = express();

var campaign = require('./campaign');

yaml = require('js-yaml');
fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'));

app.get('/call/:campaign', function(req, res) {
  this_campaign = campaign.loadJSON(req.params.campaign);
  console.dir(this_campaign);
  if( typeof this_campaign === 'undefined' )
    { campaign_title = 'Default title' }
  else
    { campaign_title = this_campaign.title; }
  
  res.render('campaign_full', { title: campaign_title })
});

app.get('*', function(req, res) {
  res.send('Hello world.');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});