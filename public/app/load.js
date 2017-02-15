var $ = require('jquery');
var parsley = require('parsleyjs');
var request = require('request');
module.exports = {
	excitingFormElements: function(){
		$('a#terms_link').click(function(){
			alert("Advocacy Commons SMS Terms & Conditions:\nBy signing up and entering my telephone number, I consent to receive and authorize Advocacy Commons to send (i) SMS text messages, (ii) prerecorded audio messages (including calls to cellular phones), or (iii) other communications sent by an autodialer to my mobile device.");
		});
		$('a#reveal_email_subscription_preferences').click(function(){
		  $('div#email_subscription_preferences').slideToggle();
		});
		//The '(show full description)' link in the form text doesn't exist right now, but here's how it would work if it did!
		var toggle_pos = 1;
		var toggle_texts = [ 'show' , 'hide' ]
		$('a#show_full_form_desc').click(function(){
			$('div#form_full_desc').slideToggle();
			$(this).text('(' + toggle_texts[toggle_pos] + ' full description)');
			toggle_pos ^= 1;
		});
	},
	parsleyCustomValidators: function() {
		parsley.addValidator('zipcode', {
			requirementType: 'string',
			validateString: function(value) {
				return value.length == 5  && parseInt(value);
			},
			messages: {
				en: 'Please enter a valid ZIP code.'
			}
		});
		parsley.addValidator('phone', {
		  requirementType: 'string',
		  validateString: function(value) {
			  console.log('received value ' + value + ' to validate as phone');
		    value = value.replace(/[^0-9]/g, '')
				if (value.substring(0, 1) != '1') value = '1' + value;
				if (value.length == 11) return value;
				return false;
		  },
		  messages: {
		    en: 'Please enter a valid phone number.'
		  }
		});
	},
	parsleyValidationActions: function() {

		//Function to return URL query values
		function getParameterByName(name) {
	    url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    try {
				var retval = decodeURIComponent(results[2].replace(/\+/g, " "));
			} catch(e) {
			  console.log(e);
			  var retval = '';
			}
	    return retval;
		}
		form = $('form#caller_data');
		$(form).on('submit', function(e) {
			e.preventDefault();
		});
		var parsley_instance = $(form).parsley();
		parsley_instance
		.on('form:success',function() {
		  console.log('Form validated.');
		  var email_subscription_status='subscribed';
		  if(!$('input#email_opt_in_check').prop('checked')) email_subscription_status='unsubscribed';

		  var OSDIBody = {
		    'person' : {
		      'given_name' : $('input#given_name').val(),
					'family_name' : $('input#family_name').val(),
		      'email_addresses' : [
		        {
		          'address' : $('input#email_address').val(),
		          'status' : email_subscription_status
		        }
		      ],
					'phone_number' : $('input#phone_number').val(),
					'postal_addresses' : [
						{ 'postal_code' : $('input#postal_code').val() }
					]
				},
		    "triggers": {
					"autoresponse": {
						"enabled": true
					}
				},
				'action_network:referrer_data' : {
		      'source' : getParameterByName('source'),
		      'referrer' : getParameterByName('referrer'),
		      'website' : 'http://www.advocacycommons.org'
		    },
		    'custom_fields' : {
					'sms_opt_in' : $('input#sms_opt_in_checkbox').prop('checked')
		    }
		  };
			var request_body = {
				'campaign' : $('input#hidden_campaign_slug').val(),
				'osdi_data' : OSDIBody
			}

		  console.log(request_body);
			request.post(
				'https://ac-node-calling-campaigns.herokuapp.com/actions/submit',
				{ json: request_body },
				function optionalCallBack(err, httpResponse, body) {
					if (err) {
						console.error('POST to internal endpoint failed!');
						alert('Uh oh, there was an error submitting your info.  Try reloading the page and filling out the form again.');
					} else {
						console.log('POST to internal endpoint succeeded!');
						res.send('It worked!');
						$('div#form_teaser, div#form_full_desc').slideUp();
						$('div.after-submit-reveal').slideDown();
						$('div#form_container')
						  .fadeTo(500,0.2)
						  .addClass('disabled');
						$('input').attr('disabled','true');
					}
				}
			);



			// $(form)
			// .osdi({
			// 	endpoint: 'http://ac-node-calling-campaigns.herokuapp.com/actions/submit',
			// 	body: request_body,
			// 	immediate: true,
			// 	done: function(data, status) {
			// 		console.log('Submitted data.');
			// 		$('div#form_teaser, div#form_full_desc').slideUp();
			// 		$('div.after-submit-reveal').slideDown();
			// 		$('div#form_container')
			// 		  .fadeTo(500,0.2)
			// 		  .addClass('disabled');
			// 		$('input').attr('disabled','true');
			// 	},
			// 	fail : function(jqXHR, textStatus, errorThrown) {
			// 		console.log('Error ' + errorThrown + ' ' + textStatus);
			// 		console.log(jqXHR);
			// 		alert('Uh oh, there was an error submitting your info.  Try reloading the page and filling out the form again.');
			// 	}
			// });
		})
		.on('form:error',function(){
		  console.log('Validation errors: form not submitted.');
		});
	}
};
