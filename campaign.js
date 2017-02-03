// Load campaign data for templating
fs = require('fs');

module.exports = {
  load: function (slug) {
    console.log('campaign.load called with slug ' + slug);
    return {
      title: 'Campaign title',
      teaser: 'Campaign teaser',
      full_description: 'Full description goes here'
    }
  },
  loadJSON: function(slug) {
    try {
			var doc = JSON.parse(fs.readFileSync('campaigns/campaigns.json', 'utf8'));
			return doc;
		} catch (e) {
			console.log(e);
		}
  }
};