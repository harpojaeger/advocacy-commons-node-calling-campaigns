// Load campaign data for templating
fs = require('fs');

module.exports = {
  load: function(slug) {
    try {
			var doc = JSON.parse(fs.readFileSync('campaigns.json', 'utf8'));
      if(slug) {
  			if (doc[slug]) return doc[slug];
  			return false;
      } else {
        return doc;
      }
		} catch (e) {
			console.log(e);
		}
  }
};
