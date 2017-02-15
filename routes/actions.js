var express = require('express')
var router = express.Router();
var request = require('request');
var campaigns = require(__dirname + '/../campaigns');
var browserify = require('browserify-middleware');

router.use(function timeLog (req, res, next) {
  // this_url seems to get used a lot, so let's define it once per request.
  this_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.locals.this_url = this_url;
  console.log(Date.now() + ' ' + req.originalUrl);
  next();
});

// define the home page route
router.get('/', function (req, res) {
  all_campaign_data = campaigns.load();
  var campaign_list = {};
  for(var slug in all_campaign_data) {
    if(all_campaign_data.hasOwnProperty(slug)) {
      this_campaign = all_campaign_data[slug]
      campaign_list[slug] = {
        "title" : this_campaign.titles.form,
        "url" : "/" + slug
      };
    }
  }
  res.send(campaign_list);
});

// Disallow GET at the OSDI submission endpoint.
router.get('/submit', function(req, res) {
  res.sendStatus(405);
});

// Handle submitted data from a campaign.
router.post('/submit', function(req, res) {
  console.dir(req.body);

  // We're gonna submit objects like so:
  //{ "campaign" : "slug",
  //  "osdi_data" : { OSDI-compliant submission object } }

  // Should validate req.body.osdi_data against OSDI standard here.
  if( !(this_campaign = campaigns.load(req.body.campaign)) ) {
    console.log('Campaign not found.');
    res.sendStatus(404).end();
  } else {
    console.log('Campaign found');
    var endpoint = this_campaign.endpoint;
    if(endpoint.type == "osdi:record_submission_helper") {
      // POST the data to this particular campaign's endpoint.
      request.post(
        endpoint.url,
        { json: req.body.osdi_data },
        function optionalCallback(err, httpResponse, body) {
          if (err) {
            console.error('OSDI POST failed: ', err);
            // Pretty sure 502 is the right error code for this.
            res.send('It failed!').sendStatus(502);
          }
          console.log('OSDI POST successful! ', httpResponse.headers.status);
          res.send('It worked!');
        }
      );
    }
  }
});

//Provide some user scripts to the browser (soon to be deprecated).
router.get('/js/app.js', browserify(__dirname + '/../public/app/main.js'));

// Render individual campaigns
router.get('/:campaign', function(req, res) {
  if( !(this_campaign = campaigns.load(req.params.campaign)) ) {
    console.log('Campaign not found.');
    res.sendStatus(404).end();
  } else {
    console.log('Campaign found');
    res.render('campaign', {
      campaign: this_campaign,
      this_url: this_url,
      this_slug: req.params.campaign,
    });
  }
});



module.exports = router;
