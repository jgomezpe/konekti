/** Konekti Plugin for media components */
class MediaPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for media components */
    constructor(){ super('media') }
	/**
	 * Fills the html template with the specific media information
	 * @param thing Button information
	 * @return Html code associated to the button component
	 */
	fillLayout(thing){
		thing.style = thing.media=='video'?'height:100%;width:auto':''
		return Konekti.core.fromTemplate(this.htmlTemplate, thing)
	}

        /**
	 * Creates a client for the plugin's instance
	 * @param thing Instance configuration
	 */
	client( thing ){ return new Media(thing) }
}

new MediaPlugIn()

/**
 * @function
 * Konekti media
 * @param id Id of the media component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 */
Konekti.media = function(id, media, type, src){
	if( typeof id==='string' ) return Konekti.plugin.media.connect({"id":id, "media":media, "type":type, "src":src})
	else return Konekti.plugin.media.connect(id)
}

/**
 * @function
 * Konekti video
 * @param id Id of the video component
 * @param type Type of video to connect
 * @param src url of video to connect
 */
Konekti.video = function(id, type, src){
    return this.media(container, "video", type, src)
}

/**
 * @function
 * Konekti mp4
 * @param id Id of the mp4 component
 * @param src url of video to connect
 */
Konekti.mp4 = function(id, src){
    return this.media(id, "video", "mp4", src)
}

/**
 * @function
 * Konekti audio
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 */
Konekti.audio = function(id, type, src){
    return this.media(id, "audio", type, src)
}

/**
 * @function
 * Konekti mp4
 * @param id Id of the audio component
 * @param src url of audio to connect
 */
Konekti.mp3 = function(id, src){
    return this.media(id, "audio", "mp3", src)
}

/**
 * A media manager.
 */
class Media extends KonektiMedia{
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
