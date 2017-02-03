function callMeMaybe(phone,zip) {
  //Could do a zip lookup here.
  $.get({
		data: {
			'party' : 'D',
			'chamber' : 'senate',
			'state' : 'MA'
		},
		url: 'https://congress.api.sunlightfoundation.com/legislators',
		dataType: 'json',
		success: function (res) {
			var senators = res.results;
			if (senators) {
				senators.forEach(function(el) {
					console.log('Found a senator:');
					console.log(el);
				});
			} else {
				console.log('No senators matching the criteria were found.');
			}
		}
	});
	
  //Call Power Bioguide ID targeting can go here.
	var data = {
		campaignId: 7,
		userPhone: phone,
		userLocation: zip,
	}
	console.log('Assembled call data.');
	console.log(data);
	$.get({
		data: data,
		url: 'https://advocacycommons.callpower.org/call/create',
		dataType: 'json',
		complete: function (res) {
			if (res.status == '200') {
				console.log('Got response 200 OK');
				targetHTML = res.responseJSON.script;
			} else {
				console.log('Got response ' + res.status + ' ' + res.statusText);
				targetHTML = 'Looks like there was an error with your call (' + res.status + ' ' + res.statusText + ').  Reload the page and give it another shot.'
			}
			//This is all outdated: it lives in validate.js now.  Replace if we start loading script from Call Power.
			$('div#form_teaser, div#form_full_desc').slideUp();
			$('div#script')
			  .html(targetHTML)
			  .slideDown();
			$('div#form_container').fadeTo(500,0.2);
			$('input').attr('disabled','true');
			
		}
	});
}