var express = require('express')
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log(Date.now() + ' ' + req.originalUrl);
  next();
})
// define the home page route
router.get('/', function (req, res) {
  res.send('List of calling campaigns');
})

// Handle individual campaigns
router.get('/:campaign', function(req, res) {
  try {
    var doc = JSON.parse(fs.readFileSync('./campaigns.json', 'utf8'));
    if (doc[req.params.campaign]) {
      var this_campaign = doc[req.params.campaign];
    } else {
      var this_vampaign = false;
    }
  } catch (e) {
    console.log(e);
  }
  var this_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  if( this_campaign ) {
    res.render('campaign', {
      campaign: this_campaign,
      this_url: this_url,
    });
  } else {
    res.sendStatus(404);
  }
});
module.exports = router
