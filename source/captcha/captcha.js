/**
*
* captcha.js
* <P>A captcha component  
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

// Captcha manager plugin
var captcha = window.plugin.captcha

// Google recaptcha API
captchaCallback = function() {
	captcha.loaded = true 
	while( captcha.view.length > 0 ){
		var dictionary = captcha.view[0]
		captcha.view.shift()
		captcha.connect( dictionary )
	}
}

captchaVerify = function(response){
	//response = nsgl.server.nsgl('login', 'captcha', response, nsgl.client.run) // @TODO Check this
}

captcha.loaded = false
Script.loadJS("https://www.google.com/recaptcha/api.js?onload=captchaCallback&render=explicit")

// Captcha manager methods
captcha.view = []

captcha.connect = function( dictionary ){
	if( captcha.loaded ) grecaptcha.render(dictionary.id, { 'sitekey' : dictionary.key, 'callback' : captchaVerify } ) 
	else captcha.view.push(dictionary)
}

// testing the make process 
//captcha.make( {id:'container-id', key:}, trace )

