$(document).ready(function(){
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
});