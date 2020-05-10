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

/*player.addEventListener("onStateChange", updateBar);

*/


// Youtube manager functions
youtube.connect = function( dictionary ){
	if( youtube.APILoaded ){
		var id = dictionary.id

		function onPlayerReady(event){
			video = event.target.playerInfo.videoData.video_id
			comp = document.getElementById(video)
			var clientId = comp.getAttribute('client')
			if( clientId != null ){
				var client = window[clientId]
				client.pause(id, function(){ window[id].pauseVideo() } ) 
				client.play(id, function(){ window[id].playVideo() })
				client.seek(id, function(time){ window[id].seekTo(time,true) })
			}
		}

		function onPlayerStateChange(event){ 
			video = event.target.playerInfo.videoData.video_id
			comp = document.getElementById(video)
			var client = comp.getAttribute('client')
			if( client != null ){
				if (event.data == YT.PlayerState.PLAYING) {
					function updatePlaying() {
					    if (YT.PlayerState.PLAYING) {
						window[client].playing(id, event.target.playerInfo.currentTime)
						comp.setAttribute('timeout', setTimeout(updatePlaying,100))
					    }
					}
					updatePlaying()
				}else{
					clearTimeout(comp.getAttribute('timeout'))
					window[client].paused(id)
				}
			}
		}

		window[id] = new YT.Player(dictionary.video, {
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
