/** Konekti plugin for media elements */
class MediaPlugin extends PlugIn{
	constructor(){ super('media') }

	/**
	 * Creates a media config object
	 * @param parent Parent component
	 * @param id Id of the media component
	 * @param media Type of media to connect (audio/video)
	 * @param type Type of media to connect
	 * @param src url of media to connect
	 * @param config Style of component
	 */
	 setup(parent, id, media, type, src, config={}){
		config.tag = media
		config.type = type 
		config.src = src
		config.extra ='controls'
		return super.setup(parent, id,'Your browser does not support the ' + media +' element.', config)
	}

	client(config){ return new Media(config) }
}

/** Adds the media plugin to Konekti */
new MediaPlugin()

/**
 * A media manager.
 */
class Media extends MediaClient{
	/**
	 * Creates a media component
	 */
	constructor(config){
		super(config)
		var x = this
		x.media = this.vc()
		x.media.addEventListener('play', function(e){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client[x.listener[i]].play !== undefined )
					Konekti.client[x.listener[i]].play(x.id, x.media.currentTime) 
		})
		x.media.ontimeupdate = function(){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client[x.listener[i]].seek !== undefined )
					Konekti.client[x.listener[i]].seek(x.id, x.media.currentTime) 
		}
		x.media.addEventListener('pause', function(e){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client[x.listener[i]].pause !== undefined )
					Konekti.client[x.listener[i]].pause(x.id) 
		})
	}

	/**
	 * Pauses the media component
	 */
	pause(){
		this.media.pause() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].pause !== undefined )
				Konekti.client[this.listener[i]].pause(this.id) 
	}

	/**
	 * Plays the media component
	 */
	play(){ 
		this.media.play() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].play !== undefined )
				Konekti.client[this.listener[i]].play(this.id) 
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		this.media.currentTime = time
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client[this.listener[i]].seek !== undefined )
				Konekti.client[this.listener[i]].seek(this.id,time) 
	}
	
	update( src ){
		this.vc('Src').src = src
		this.vc().load()
	}
}

/**
 * Associates/Adds a general media component
 * @method
 * media
 * @param parent Parent component
 * @param id Id of the media component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 * @param config Style of the media
 * @param callback Function called when the media is ready
 */
Konekti.media = function(parent, id, media, type, src, config, callback){ 
	var args = []
	for(var i=0; i<arguments.length; i++) args[i] = arguments[i]
	if(args.length==5) args[5] = {}
	if(args.length==6) args[6] = function(){}
	Konekti.add('media', ...args)
}

/**
 * Associates/Adds a general video component
 * @method
 * video
 * @param parent Parent component
 * @param id Id of the video component
 * @param type Type of video to connect
 * @param src url of video to connect
 * @param config Style of the video
 * @param callback Function called when the video is ready
 */
 Konekti.video = function(parent, id, width, height, type, src, config, callback){ return this.media(parent, id, "video", type, src, config, callback) }

/**
 * Associates/Adds a mp4 video component
 * @method
 * mp4
 * @param parent Parent component
 * @param id Id of the mp4 component
 * @param src url of video to connect
 * @param config Style of the mp4
 * @param callback Function called when the mp4 is ready
 */
 Konekti.mp4 = function(parent, id, src, config, callback){ return Konekti.media(parent, id, "video", "mp4", src, config, callback) }

/**
 * Associates/Adds a general audio component
 * @method
 * audio
 * @param parent Parent component
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 * @param config Style of the audio
 * @param callback Function called when the audio is ready
 */
 Konekti.audio = function(parent, id, type, src, config, callback){ return Konekti.media(parent, id, "audio", type, src, config, callback) }

/** 
 * Associates/Adds a mp3 audio component
 * @method
 * mp4
 * @param parent Parent component
 * @param id Id of the audio component
 * @param src url of audio to connect
 * @param config Style of the mp3
 * @param callback Function called when the mp3 is ready
 */
Konekti.mp3 = function(parent, id, src, config, callback){ return Konekti.audio(parent, id, "mp3", src, config, callback) }
