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
     * Connects (extra steps) the youtube video with the GUI component
     * @param thing youtube configuration
     */
    extra( thing ){
        if( this.APILoaded ){
            var id = thing.id
            function onPlayerReady(event){
                var video = event.target.playerInfo.videoData.video_id
                var comp = Konekti.vc(video)
                var clientId = thing.client
                if( clientId !== undefined ){
                    var client = Konekti.client(clientId)
                    client.pause(id, function(){ window[id].pauseVideo() } )
                    client.play(id, function(){ window[id].playVideo() })
                    client.seek(id, function(time){ window[id].seekTo(time,true) })
                }
            }

            function onPlayerStateChange(event){
                var video = event.target.playerInfo.videoData.video_id
                var comp = Konekti.vc(video)
                var client = Konekti.client(thing.client)
                if( client != null ){
                    if (event.data == YT.PlayerState.PLAYING) {
                        function updatePlaying() {
                            if (YT.PlayerState.PLAYING) {
                                client.playing(id, event.target.playerInfo.currentTime)
                                comp.setAttribute('timeout', setTimeout(updatePlaying,100))
                            }
                        }
                        updatePlaying()
                    }else{
                        clearTimeout(comp.getAttribute('timeout'))
                        client.paused(id)
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
        }else this.video.push( thing )
    }
}

new YoutubePlugIn()

//  Using the youtube api
Konekti.core.resource.script(null,'https://www.youtube.com/iframe_api', null)

window.onYouTubeIframeAPIReady = function(){ Konekti.plugin.youtube.done() }

/**
 * @function
 * Konekti youtube
 * @param container Id of the youtube component
 * @param video youtube id of the video
 * @param client Client of the latex component
 */
Konekti.youtube = function(container, video, client){
    var dict = {"id":container, "video":video}
    if(client !== undefined ) dict.client=client
    Konekti.plugin.youtube.connect(dict)
}
