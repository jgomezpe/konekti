//  Using the youtube api
Konekti.resource.script(null,'https://www.youtube.com/iframe_api', null)
let youtube_ready = false
window.onYouTubeIframeAPIReady = function(){ youtube_ready=true }

/**
 * A youtube media manager.
 */
class Youtube extends MediaClient{
	/**
	 * Creates a Youtube video configuration object
	 * @param id Id of the youtube component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param video youtube id of the video
	 * @param parent Parent component
	 */
	setup(id, width, height, video, parent='KonektiMain'){
		return {'plugin':'youtube', 'id':id, 'video':video, 'width':width, 'height':height, 'parent':parent}
	}

	/**
	 * Creates a Youtube video 
	 * @param id Id of the youtube component
	 * @param width Width of the split component
	 * @param height Height of the split component
	 * @param video youtube id of the video
	 * @param parent Parent component
	 */
	constructor(id, width, height, video, parent='KonektiMain'){ 
		super(...arguments)
		var x = this
		function check(){
			if(youtube_ready) x.load()
			else setTimeout(check,100)
		}
		check()
	}

	/**
	 * Associated html code
	 */
	html(){ return "<div id='"+this.id+"'><div id='"+this.config.video+"' style='width:100%;height:100%;'></div></div>" }

	/**
	 * Loads a Youtube player
	 */
	load(){
		var x = this
		function onPlayerReady(event){}

		function onPlayerStateChange(event){
			var comp = Konekti.vc(event.target.playerInfo.videoData.video_id)
			if (event.data == YT.PlayerState.PLAYING) {
				function updatePlaying() {
					if (YT.PlayerState.PLAYING) {
						for( var i=0; i<x.listener.length; i++ )
							if( Konekti.client[x.listener[i]].seek !== undefined )
								Konekti.client[x.listener[i]].seek(x.id, event.target.playerInfo.currentTime) 
						comp.setAttribute('timeout', setTimeout(updatePlaying,100))
					}
				}
				updatePlaying()
			}else{
				clearTimeout(comp.getAttribute('timeout'))
				for( var i=0; i<x.listener.length; i++ )
					if( Konekti.client[x.listener[i]].pause !== undefined )
						Konekti.client[x.listener[i]].pause(x.id) 
			}
		}
		window[x.id] = new YT.Player(x.config.video, {
			videoId: x.config.video,
			playerVars: {rel: 0, fs:0, modestbranding:1},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	/**
	 * Pauses the media component
	 */
	pause(){ 
		window[this.id].pauseVideo()
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].pause !== undefined )
				Konekti.client[this.listener[i]].pause(this.id)
	}

	/**
	 * Plays the media component
	 */
	play(){
		window[this.id].playVideo() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].play !== undefined )
				Konekti.client[this.listener[i]].play(this.id) 
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		window[this.id].seekTo(time,true) 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].seek !== undefined )
				Konekti.client[this.listener[i]].seek(this.id,time) 
	}
}

/**
 * Associates/Adds a youtube video component
 * @method
 * youtube
 * @param id Id of the youtube component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param video youtube id of the video
 * @param parent Parent component
 */
Konekti.youtube = function(id, width, height, video, parent='KonektiMain'){ return new Youtube(id, width, height, video, parent) }