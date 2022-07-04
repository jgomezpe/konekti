//  Using the youtube api
Konekti.resource.script(null,'https://www.youtube.com/iframe_api', null)
window.onYouTubeIframeAPIReady = function(){ Konekti.plugins.youtube.done() }

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
			Konekti.client[thing.id].load( thing )
		}
	}
    
	/**
	 * Creates a client for the plugin
	 * @param config Instance configuration
	 */
	client(config){ 
		var yt = new Youtube(config) 
		if( this.ready ) yt.load(config)
		else this.video.push( config )
		return yt
	}
}

/**
 * A youtube media manager.
 */
class Youtube extends MediaClient{
	/** 
	 * Creates a Split client
	 * @param config Split configuration
	 */
	constructor(config){ super(config) }

	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ return "<div id='"+this.id+"'><div id='"+config.video+"' style='width:100%;height:100%;'></div></div>" }

	/**
	 * Updates a Youtube player
	 * @param thing Youtube player configuration
	 */
	update(config){ 
		var ytp = Konekti.plugins.youtube
		var i=0
		while( i<ytp.video.length && ytp.video[i].id != this.id ) i++
		if( i<ytp.video.length ) ytp.video[i].video.slice(i,i+1)

		Konekti.youtube(this.id, config.video)
	}

	/**
	 * Loads a Youtube player
	 * @param config Youtube configuration
	 */
	load(config){
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
		window[x.id] = new YT.Player(config.video, {
			videoId: config.video,
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

/** Youtube class */
if(Konekti.youtube===undefined) new YoutubePlugIn()

/**
 * Creates a Youtube video configuration object
 * @method
 * youtubeConfig
 * @param id Id of the youtube component
 * @param width Width of the split component
 * @param height Height of the split component
 * @param video youtube id of the video
 * @param parent Parent component
 */
Konekti.youtubeConfig = function(id, width, height, video, parent='KonektiMain'){
	return {'plugin':'youtube', 'id':id, 'video':video, 'width':width, 'height':height, 'parent':parent}
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
Konekti.youtube = function(id, width, height, video){
	return Konekti.build(Konekti.youtubeConfig(id, width, height, video))
}
