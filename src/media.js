/** Konekti Plugin for media components (audio/video) */
class MediaPlugIn extends PlugIn{
	/** Creates a Plugin for media components */
	constructor(){ super('media') }
	
        /**
	 * Creates a client for the plugin's instance
	 * @param config Instance configuration
	 */
	client( config ){ return new Media(config) }
}

/**
 * A media manager.
 */
class Media extends MediaClient{
	/**
	 * Creates a media component
	 * @param config Media component configuration
	 */
	constructor( config ){
		super(config)
		this.media = this.vc()
		var x = this
		var media = this.media
		media.addEventListener('play', function(e){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client[x.listener[i]].play !== undefined )
					Konekti.client[x.listener[i]].play(x.id, media.currentTime) 
		})
		media.ontimeupdate = function(){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client[x.listener[i]].seek !== undefined )
					Konekti.client[x.listener[i]].seek(x.id, media.currentTime) 
		}
		media.addEventListener('pause', function(e){
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
	
	/**
	 * Associated html code
	 * @param config Client configuration
	 */
	html( config ){ 
		return "<"+config.media+" id='"+this.id+"' controls><source id='"+this.id+"Src' src='"+config.src+"' type='"+config.media+"/"+config.type+"'>Your browser does not support the audio element.</"+config.media+">" 
	}
	
	update( src ){
		this.vc('Src').src = src
	}
}

/** Media class */
if(Konekti.media===undefined) new MediaPlugIn()

/**
 * Creates a media config object
 * @method
 * mediaConfig
 * @param id Id of the media component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 * @param parent Parent component
 */
Konekti.mediaConfig = function(id, width, height, media, type, src, parent='KonektiMain'){ 
	return {"plugin":"media", "id":id, "media":media, "type":type, "src":src, 'width':width, 'height':height, 'parent':parent } 
}

/**
 * Associates/Adds a general media component
 * @method
 * media
 * @param id Id of the media component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 */
Konekti.media = function(id, width, height, media, type, src){
	return Konekti.build(Konekti.mediaConfig(id, width, height, media, type, src))
}

/**
 * Creates a video configuration object
 * @method
 * videoConfig
 * @param id Id of the video component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param type Type of video to connect
 * @param src url of video to connect
 * @param parent Parent component
 */
 Konekti.videoConfig = function(id, width, height, type, src, parent='KonektiMain'){
    return this.mediaConfig(container, width, height, "video", type, src, parent)
}

/**
 * Associates/Adds a general video component
 * @method
 * video
 * @param id Id of the video component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param type Type of video to connect
 * @param src url of video to connect
 */
 Konekti.video = function(id, width, height, type, src){
    return this.media(container, width, height, "video", type, src)
}

/**
 * Creates a mp4 video configuration object
 * @method
 * mp4Config
 * @param id Id of the mp4 component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src url of video to connect
 * @param parent Parent component
 */
 Konekti.mp4Config = function(id, width, height, src, parent='KonektiMain'){
    return this.mediaConfig(id, width, height, "video", "mp4", src, parent)
}

/**
 * Associates/Adds a mp4 video component
 * @method
 * mp4
 * @param id Id of the mp4 component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src url of video to connect
 */
 Konekti.mp4 = function(id, width, height, src){
    return this.media(id, width, height, "video", "mp4", src)
}

/**
 * Creates a general audio configuration object
 * @method
 * audioConfig
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 * @param parent Parent component
 */
 Konekti.audioConfig = function(id, type, src, parent='KonektiMain'){
    return this.mediaConfig(id, '', '', "audio", type, src, parent)
}

/**
 * Associates/Adds a general audio component
 * @method
 * audio
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 */
 Konekti.audio = function(id, type, src){
    return this.media(id, '', '', "audio", type, src)
}

/**
 * Associates/Adds a mp3 audio component
 * @method
 * mp4
 * @param id Id of the audio component
 * @param src url of audio to connect
 */
Konekti.mp3Config = function(id, src, parent='KonektiMain'){
    return this.audioConfig(id, "mp3", src, parent)
}

/** 
* Associates/Adds a mp3 audio component
* @method
* mp4
* @param id Id of the audio component
* @param src url of audio to connect
*/
Konekti.mp3 = function(id, src){
   return this.audio(id, "mp3", src)
}
