/**  Using the youtube api */
Konekti.resource.script(null,'https://www.youtube.com/iframe_api', null)

/** Function that is called when the youtube module is loaded */
window.onYouTubeIframeAPIReady = function(){ new YoutubePlugin() }

/** Konekti plugin for youtube elements */
class YoutubePlugin extends PlugIn{
	constructor(){ super('youtube') }

	/**
	 * Creates a Youtube video configuration object
	 * @param parent Parent component
	 * @param video youtube id of the video
	 * @param config Style of the youtube container
	 */
	 setup(parent, video, config={}){
		return super.setup(parent, video, "", config)
	}

	client(config){ return new Youtube(config) }
}

/**
 * A youtube client.
 */
class Youtube extends MediaClient{
	/**
	 * Creates a Youtube video 
	 */
	constructor(config){ 
		super(config)	
		var x = this
		Konekti.daemon( function(){ return x.vc()!==undefined && x.vc()!==null }, function(){ x.load() } )		
	}

	/**
	 * Loads a Youtube player
	 */
	load(){
		var x = this
		function onPlayerReady(event){  window.dispatchEvent(new Event('resize'))  }

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
		window[x.id] = new YT.Player(x.id, {
			videoId: x.id,
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
 * @param parent Parent component
 * @param video youtube id of the video
 * @param config Style of the youtube container
 * @param callback Function called when the youtube video is ready
 */
Konekti.youtube = function(video, config={}, callback=function(){}){ 
	Konekti.add({'plugin':'youtube', 'setup':['body', video, config]}, callback)
}