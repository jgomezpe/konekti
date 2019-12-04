/**
*
* youtube.js
* <P>A youtube video player for unalcol  
*
* Copyright (c) 2019 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/konekti">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/


// The youtube plugin
youtube = window.plugin.youtube


youtube.video = []
youtube.APILoaded = false

//  Using the youtube api
Script.load(null,"https://www.youtube.com/iframe_api", null)

function onYouTubeIframeAPIReady(){ 
	youtube.APILoaded=true
	while( youtube.video.length > 0 ){
		var dictionary = youtube.video[0]
		youtube.video.shift()
		youtube.connect( dictionary )
	}
}

function onPlayerReady(event){}
function onPlayerStateChange(event){ if (event.data == YT.PlayerState.PLAYING) {} }

// Youtube manager functions
youtube.connect = function( dictionary ){
	if( youtube.APILoaded ){
		window[dictionary.id] = new YT.Player(dictionary.id+'-inner', {
			videoId: dictionary.video,
			playerVars: {rel: 0, fs:0, modestbranding:1},
				events: {
		   		'onReady': onPlayerReady,
		   		'onStateChange': onPlayerStateChange
		 	}
		});
	}else youtube.video.push( dictionary )
}

//youtube.post = function( dictionary ){ youtube.connect(dictionary) }

