/** Konekti Plugin for media components */
class MediaPlugIn extends KonektiPlugIn{
    /** Creates a Plugin for media components */
    constructor(){ super('media') }
    /** 
     * Connects (extra steps) the media component with the GUI component
     * @param thing media component configuration
     */
    extra( thing ){ new Media(thing.id, thing.client) }
}

new MediaPlugIn()

/**
 * @function
 * Konekti media
 * @param id Id of the media component
 * @param media Type of media to connect (audio/video)
 * @param type Type of media to connect
 * @param src url of media to connect
 * @param client Client of the media component
 */
Konekti.media = function(id, media, type, src, client='client'){
    var dict = {"id":id, "media":media, "type":type, "src":src}
    Konekti.plugin.media.connect(dict)
}

/**
 * @function
 * Konekti video
 * @param id Id of the video component
 * @param type Type of video to connect
 * @param src url of video to connect
 * @param client Client of the video component
 */
Konekti.video = function(id, type, src, client){
    this.media(container, "video", type, src, client)
}

/**
 * @function
 * Konekti mp4
 * @param id Id of the mp4 component
 * @param src url of video to connect
 * @param client Client of the video component
 */
Konekti.mp4 = function(id, src, client){
    this.media(id, "video", "mp4", src, client)
}

/**
 * @function
 * Konekti audio
 * @param id Id of the audio component
 * @param type Type of audio to connect
 * @param src url of audio to connect
 * @param client Client of the audio component
 */
Konekti.audio = function(id, type, src, client){
    this.media(id, "audio", type, src, client)
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
	constructor( id, client ){
		super(id, client)
		this.media = this.vc('Content')
		var c = this.client
		if( c !== null ){
			var media = this.media
			if( c.play !== undefined )
				media.addEventListener('play', function(e){  c.play(id, media.currentTime) })
			if( c.seek !== undefined )
				media.ontimeupdate = function(){ c.seek(id, media.currentTime) };
			if( c.pause !== undefined )		
				media.addEventListener('pause', function(e){ c.pause(id) })
			if( c.addMedia !== undefined ) c.addMedia( this )
		}
	}

	/**
	 * Pauses the media component
	 */
	pause(){
		this.media.pause() 
		var c = this.client
		if( c!==null && c.pause !== undefined ) c.pause(this.id)
	}

	/**
	 * Plays the media component
	 */
	play(){ 
		this.media.play() 
		var c = this.client
		if( c!==null && c.pause !== undefined ) c.play(this.id)
	}

	/**
	 * Locates the media component at the given time
	 * @param time Time position for the media component
	 */
	seek(time){
		this.media.currentTime = time
		var c = this.client
		if( c!==null && c.seek !== undefined ) c.seek(this.id, time)
	}
}
