/** Konekti Plugin for media components (audio/video) */
class MediaPlugIn extends PlugIn{
    /** Creates a Plugin for media components */
    constructor(){ super('media') }
	/**
	 * Fills the html template with the specific media information
	 * @param thing Button information
	 * @return Html code associated to the button component
	 */
	fillLayout(thing){
		thing.style = thing.media=='video'?'width:100%;height:100%':''
		return Konekti.dom.fromTemplate(this.htmlTemplate, thing)
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Media(thing) }

	/**
	 * Creates a config object from parameters
	 * @param id Id of the media component
	 * @param media Type of media to connect (audio/video)
	 * @param type Type of media to connect
	 * @param src url of media to connect
	 */
	config(id, media, type, src){ return {"id":id, "media":media, "type":type, "src":src} }
}

/**
 * A media manager.
 */
class Media extends MediaClient{
	/**
	 * Creates a media component
	 * @param thing Media component configuration
	 */
	constructor( thing ){
		super(thing)
		this.media = this.vc('Content')
		var x = this
		var media = this.media
		media.addEventListener('play', function(e){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client(x.listener[i]).play !== undefined )
					Konekti.client(x.listener[i]).play(x.id, media.currentTime) 
		})
		media.ontimeupdate = function(){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client(x.listener[i]).seek !== undefined )
					Konekti.client(x.listener[i]).seek(x.id, media.currentTime) 
		}
		media.addEventListener('pause', function(e){
			for( var i=0; i<x.listener.length; i++ )
				if( Konekti.client(x.listener[i]).pause !== undefined )
					Konekti.client(x.listener[i]).pause(x.id) 
		})
	}

	/**
	 * Pauses the media component
	 */
	pause(){
		this.media.pause() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client(this.listener[i]).pause !== undefined )
				Konekti.client(this.listener[i]).pause(this.id) 
	}

	/**
	 * Plays the media component
	 */
	play(){ 
		this.media.play() 
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client(this.listener[i]).play !== undefined )
				Konekti.client(this.listener[i]).play(this.id) 
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		this.media.currentTime = time
		for( var i=0; i<this.listener.length; i++ )
			if( Konekti.client(this.listener[i]).seek !== undefined )
				Konekti.client(this.listener[i]).seek(this.id,time) 
	}
}

/** Media class */
if(Konekti.media===undefined) new MediaPlugIn()

/**
 * Associates/Adds a general media component
 * @method
 * media
 * @param id Id of the media component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 */
Konekti.media = function(id, media, type, src){
	if(typeof id==='string') id=Konekti.plugins.media.config(id,media,type,src)
	return Konekti.plugins.media.connect(id)
}

/**
 * Associates/Adds a general video component
 * @method
 * video
 * @param id Id of the video component
 * @param type Type of video to connect
 * @param src url of video to connect
 */
Konekti.video = function(id, type, src){
    return this.media(container, "video", type, src)
}

/**
 * Associates/Adds a mp4 video component
 * @method
 * mp4
 * @param id Id of the mp4 component
 * @param src url of video to connect
 */
Konekti.mp4 = function(id, src){
    return this.media(id, "video", "mp4", src)
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
    return this.media(id, "audio", type, src)
}

/**
 * Associates/Adds a mp3 audio component
 * @method
 * mp4
 * @param id Id of the audio component
 * @param src url of audio to connect
 */
Konekti.mp3 = function(id, src){
    return this.media(id, "audio", "mp3", src)
}

