/** Konekti Plugin for media components */
class MediaPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for media components */
    constructor(){ super('media') }
    /** 
     * Connects (extra steps) the media component with the GUI component
     * @param thing media component configuration
     */
    extra( thing ){ new Media(thing) }
}

new MediaPlugIn()

/**
 * @function
 * Konekti media
 * @param container Id of the media component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 * @param client Client of the media component
 */
Konekti.media = function(container, media, type, src, client){
    var dict = {"id":container, "media":media, "type":type, "src":src}
    if(client !== undefined ) dict.client=client
    Konekti.plugin.media.connect(dict)
}

/**
 * @function
 * Konekti video
 * @param container Id of the video component
 * @param type Type of video to connect
 * @param src url of video to connect
 * @param client Client of the video component
 */
Konekti.video = function(container, type, src, client){
    this.media(container, "video", type, src, client)
}

/**
 * @function
 * Konekti mp4
 * @param container Id of the video component
 * @param src url of video to connect
 * @param client Client of the video component
 */
Konekti.mp4 = function(containe, src, client){
    this.media(container, "video", "mp4", src, client)
}

/**
 * @function
 * Konekti audio
 * @param container Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 * @param client Client of the audio component
 */
Konekti.audio = function(container, type, src, client){
    this.media(container, "audio", type, src, client)
}

/**
 * @function
 * Konekti mp4
 * @param container Id of the audio component
 * @param src url of audio to connect
 * @param client Client of the audio component
 */
Konekti.mp3 = function(container, src, client){
    this.media(container, "audio", "mp3", src, client)
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
		
		if( typeof thing.client != 'undefined' ){
			var media = this.media
			var id = thing.id
			var client = Konekti.client(thing.client)
			function playing(e){ client.playing(id, media.currentTime) }
			function stop(e){ client.paused(id) }
			media.addEventListener('play', playing);
			media.addEventListener('pause', stop);
			media.ontimeupdate = function(){ client.playing(id, media.currentTime) };
			client[this.id] = this
		}
	}

	/**
	 * Pauses the media component
	 */
	pause(){ this.media.pause() }

	/**
	 * Plays the media component
	 */
	play(){ this.media.play() }

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){ this.media.currentTime = time }
}
