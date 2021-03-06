/** Konekti Plugin for Youtube */
class YoutubePlugIn extends PlugIn{
	/** Creates a Plugin for Youtube */
	constructor(){
		super('youtube') 
		this.video = []
		this.ready = false
	}
    
	/**
	 * Connects components as soon as the Youtube library is loaded
	 */
	done(){
		this.ready=true
		while( this.video.length > 0 ){
			var thing = this.video[0]
			this.video.shift()
			Konekti.client(thing.id).load( thing )
		}
	}
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ 
		var yt = new Youtube(thing) 
		if( this.ready ) yt.load(thing)
		else this.video.push( thing )
		return yt
	}

	/**
	 * 
	 * @param id Id of the youtube component
	 * @param video youtube id of the video
	 */
	config(id, video){
		return {"id":id, "video":video}
	}
}

class Youtube extends MediaClient{
	constructor(thing){ super(thing) }

	/**
	 * Loads a Youtube palyer
	 * @param thing Youtube configuration
	 */
	load(thing){
		var x = this
		function onPlayerReady(event){}

		function onPlayerStateChange(event){
			var comp = Konekti.vc(event.target.playerInfo.videoData.video_id)
			if (event.data == YT.PlayerState.PLAYING) {
				function updatePlaying() {
					if (YT.PlayerState.PLAYING) {
						for( var i=0; i<x.listener.length; i++ )
							if( Konekti.client(x.listener[i]).seek !== undefined )
								Konekti.client(x.listener[i]).seek(x.id, event.target.playerInfo.currentTime) 
						comp.setAttribute('timeout', setTimeout(updatePlaying,100))
					}
				}
				updatePlaying()
			}else{
				clearTimeout(comp.getAttribute('timeout'))
				for( var i=0; i<x.listener.length; i++ )
					if( Konekti.client(x.listener[i]).pause !== undefined )
						Konekti.client(x.listener[i]).pause(x.id) 
			}
		}
		window[x.id] = new YT.Player(thing.video, {
			videoId: thing.video,
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
			if( Konekti.client(this.listener[i]).pause !== undefined )
				Konekti.client(this.listener[i]).pause(this.id)
	}

	/**
	 * Plays the media component
	 */
	play(){
		window[this.id].playVideo() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client(this.listener[i]).play !== undefined )
				Konekti.client(this.listener[i]).play(this.id) 
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		window[this.id].seekTo(time,true) 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client(this.listener[i]).seek !== undefined )
				Konekti.client(this.listener[i]).seek(this.id,time) 
	}
}

/** Youtube class */
if(Konekti.youtube===undefined) new YoutubePlugIn()

//  Using the youtube api
window.onYouTubeIframeAPIReady = function(){ Konekti.plugins.youtube.done() }
Konekti.resource.script(null,'https://www.youtube.com/iframe_api', null)

/**
 * Associates/Adds a youtube video component
 * @method
 * youtube
 * @param id Id/Confiiguration of the youtube component
 * @param video youtube id of the video
 */
Konekti.youtube = function(id, video){
	if(typeof id === 'string') id=Konekti.plugins.youtube.config(id,video)
	return Konekti.plugins.youtube.connect(id)
}
