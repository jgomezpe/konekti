/** Konekti Plugin for Youtube */
class YoutubePlugIn extends KonektiPlugIn{
    /** Creates a Plugin for Youtube */
    constructor(){
        super('youtube') 
        this.video = []
        this.APILoaded = false
    }
    
    /**
     * Connects components as soon as the Youtube library is loaded
     */
    done(){
        this.APILoaded=true
        while( this.video.length > 0 ){
            var thing = this.video[0]
            this.video.shift()
            this.connect( thing )
        }
    }
    
	/**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client(thing){ 
		var yt = new YoutubeMedia(thing) 
		if( this.APILoaded ) yt.load(thing)
		else this.video.push( thing )
		return yt
	}
}

new YoutubePlugIn()

//  Using the youtube api
Konekti.core.resource.script(null,'https://www.youtube.com/iframe_api', null)

window.onYouTubeIframeAPIReady = function(){ Konekti.plugin.youtube.done() }


class YoutubeMedia extends KonektiMedia{
	constructor(thing){ super(thing) }

	/**
	 * Loads a Youtube palyer
	 * @param thing Youtube configuration
	 */
	load(thing){
		var id = thing.id
		function onPlayerReady(event){ new YoutubeMedia(thing.id, thing.client) }

		function onPlayerStateChange(event){
			var video = event.target.playerInfo.videoData.video_id
			var comp = Konekti.vc(video)
			var client = Konekti.client(thing.id).client
			if( client != null ){
				if (event.data == YT.PlayerState.PLAYING) {
					function updatePlaying() {
						if (YT.PlayerState.PLAYING) {
							if( client.play !== null ) client.seek(id, event.target.playerInfo.currentTime)
							comp.setAttribute('timeout', setTimeout(updatePlaying,100))
						}
					}
					updatePlaying()
				}else{
					clearTimeout(comp.getAttribute('timeout'))
					if( client.pause !== null ) client.pause(id)
				}
			}
		}
		window[id] = new YT.Player(thing.video, {
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
		var c = this.client
		if( c!==null && c.pause !== undefined ) c.pause(this.id)
	}

	/**
	 * Plays the media component
	 */
	play(){
		window[this.id].playVideo() 
		var c = this.client
		if( c!==null && c.play !== undefined ) c.play(this.id)
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		window[this.id].seekTo(time,true) 
		var c = this.client
		if( c!==null && c.seek !== undefined ) c.seek(this.id, time)
	}
}

/**
 * @function
 * Konekti youtube
 * @param id Id of the youtube component
 * @param video youtube id of the video
 * @param client Client of the latex component
 */
Konekti.youtube = function(id, video, client='client'){
	return Konekti.plugin.youtube.connect({"id":id, "video":video, 'client':client})
}
