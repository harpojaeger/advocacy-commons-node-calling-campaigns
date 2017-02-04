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
  if( this_campaign ) {
    res.render('campaign_full', { 
      campaign: this_campaign,
      titles: this_campaign.titles,
      metadata: this_campaign.metadata,
      text: this_campaign.text,
    });
  } else {
    res.sendStatus(404);
  }
  
  
});

app.get('*', function(req, res) {
  res.send('Hello world.');
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});