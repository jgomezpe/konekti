
window.plugin.media.connect = function( dictionary ){
	if( dictionary.client != null ){
		var id = dictionary.id

		client = window[dictionary.client]
		function playing(e) { client.playing(id, media.currentTime) }

		function stop(e) { client.paused(id) }

		var media = document.getElementById(id+'-inner');
		media.addEventListener('play', playing);
		media.addEventListener('pause', stop);
		media.ontimeupdate = function(){ client.playing(id, media.currentTime) };

		client.pause(id, function(){ media.pause() } ) 
		client.play(id, function(){ media.play() })
		client.seek(id, function(time){ media.currentTime = time })

	}
   
}
