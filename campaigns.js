// Load campaign data for templating
fs = require('fs');

module.exports = {
  load: function(slug) {
    try {
			var doc = JSON.parse(fs.readFileSync('campaigns.json', 'utf8'));
			if (doc[slug]) return doc[slug];
			return false;
		} catch (e) {
			console.log(e);
		}
  }
};
