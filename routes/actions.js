var express = require('express')
var router = express.Router();
var request = require('request');
var campaigns = require(__dirname + '/../campaigns');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  // this_url seems to get used a lot, so let's define it once per request.
  this_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(Date.now() + ' ' + req.originalUrl);
  next();
})
// define the home page route
router.get('/', function (req, res) {
  res.send('List of available actions.');
})

// Handle individual campaigns
router.get('/:campaign', function(req, res) {
  var this_campaign = campaigns.load(req.params.campaign);
  if( this_campaign ) {
    res.render('campaign', {
      campaign: this_campaign,
      this_url: this_url,
    });
  } else {
    res.sendStatus(404);
  }
});

// Handle submitted data from a campaign – flexibly.
router.post('/:campaign', function(req, res) {
  console.dir(req.body);

  // We're gonna submit objects like so:
  //{ "campaign" : "slug",
  //  "osdi_data" : { OSDI-compliant submission object } }
  // For example:
  OSDIBody = {
    'person' : {
      'given_name' : 'Harpo',
      'family_name' : 'Jaeger',
      'email_addresses' : [
        {
          'address' : 'harpo.jaeger@gmail.com',
          'status' : 'subscribed'
        }
      ],
      'phone_number' : '4132308454',
      'postal_addresses' : [
        { 'postal_code' : '85701' }
      ]
    },
    "triggers": {
      "autoresponse": {
        "enabled": true
      }
    },
    'action_network:referrer_data' : {
      'source' : null,
      'referrer' : null,
      'website' : 'http://www.advocacycommons.org'
    },
    'custom_fields' : {
      'sms_opt_in' : '1'
    }
  };
  // Validate req.body.data against OSDI standard.  Return a 400 error if bad?
  //if(bad_request) get_angry;

  //Assuming we have OSDI-compliant data:
  var this_campaign = campaigns.load(req.params.campaign);

  // Make sure an endpoint is specified for this campaign in campaigns.json
  if ( endpoint = this_campaign.endpoint ) {
    console.log('Got endpoint for ' + req.originalUrl);

    // This might be unnecessary if we've already validated the data.
    if(endpoint.type == "osdi:record_submission_helper") {

      // POST the data to this particular campaign's endpoint.
      request.post(

        // The endpoint URL from campaigns.json
        endpoint.url,

        // The OSDI data submitted.
        { json: req.body.osdi_data },
        function optionalCallback(err, httpResponse, body) {
          if (err) {
            return console.error('OSDI POST failed: ', err);
            res.send('It failed!');
          }
          console.log('OSDI POST successful! ', httpResponse.headers.status);
          res.send('It worked!');
        }
      );
    }
  } else {
    console.log('No endpoint found for ' + req.originalUrl);
  }
});
module.exports = router;