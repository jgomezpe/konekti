/**
 * A media manager.
 */
class Media extends MediaClient{
	/**
	 * Creates a media config object
	 * @param parent Parent component
	 * @param id Id of the media component
	 * @param width Width of the div's component
	 * @param height Height of the div's component
	 * @param media Type of media to connect (audio/video)
	 * @param type Type of media to connect
	 * @param src url of media to connect
	 * @param config Style of component
	 */
	setup(parent, id, width, height, media, type, src, config={}){
		config.tag = media
		config.type = type 
		config.src = src
		config.extra ='controls'
		return super.setup(parent, 'media', id, width, height, config,'Your browser does not support the ' + media +' element.')
	}

	/**
	 * Creates a media component
	 */
	constructor(){
		super(...arguments)
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
 * @param id Id of the media component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 * @param parent Parent component
 */
Konekti.media = function(parent, id, width, height, media, type, src, config={}){ return new Media(parent, id, width, height, media, type, src, config) }

/**
 * Associates/Adds a general video component
 * @method
 * video
 * @param id Id of the video component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param type Type of video to connect
 * @param src url of video to connect
 * @param parent Parent component
 */
 Konekti.video = function(parent, id, width, height, type, src, config={}){ return this.media(parent, id, width, height, "video", type, src, config) }

/**
 * Associates/Adds a mp4 video component
 * @method
 * mp4
 * @param id Id of the mp4 component
 * @param width Width of the div's component
 * @param height Height of the div's component
 * @param src url of video to connect
 * @param parent Parent component
 */
 Konekti.mp4 = function(parent, id, width, height, src, config={}){ return Konekti.media(parent, id, width, height, "video", "mp4", src, config) }

/**
 * Associates/Adds a general audio component
 * @method
 * audio
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 * @param parent Parent component
 */
 Konekti.audio = function(parent, id, type, src, config={}){ return Konekti.media(parent, id, '', '', "audio", type, src, config) }

/** 
* Associates/Adds a mp3 audio component
* @method
* mp4
* @param id Id of the audio component
* @param src url of audio to connect
* @param parent Parent component
*/
Konekti.mp3 = function(parent, id, src, config={}){ return Konekti.audio(parent, id, "mp3", src, config) }

Konekti.register('mp3', 'audio', 'mp4', 'video')